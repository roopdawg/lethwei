import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import {
  isShopifyAdminConfigured,
  createSignupDiscountCode,
  deactivateDiscountCode,
} from "@/lib/shopify-admin-discounts";
import { NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// In-memory per-IP limiter. Good enough at this app's scale (single
// long-running Railway container, not serverless) — resets on deploy, which
// is fine for a spam deterrent rather than a hard guarantee.
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60 * 60 * 1000;
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || entry.resetAt < now) {
    hits.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT;
}

/**
 * Always returns a generic success response regardless of whether the email
 * already signed up — doesn't leak that, same convention as forgot-password.
 * A brand-new email gets a fresh 10%-off code and an email with it; a repeat
 * email is a silent no-op (never reissues or resends).
 */
export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { email } = await req.json().catch(() => ({}));
  if (typeof email !== "string" || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
  }
  const normalizedEmail = email.trim().toLowerCase();

  if (!isShopifyAdminConfigured()) {
    return NextResponse.json({ error: "Discount signup isn't available right now" }, { status: 503 });
  }

  const existing = await prisma.discountSignup.findUnique({ where: { email: normalizedEmail } });
  if (!existing) {
    const discount = await createSignupDiscountCode();
    if (discount) {
      try {
        await prisma.discountSignup.create({
          data: { email: normalizedEmail, code: discount.code, discountId: discount.id },
        });
        try {
          await sendEmail(
            normalizedEmail,
            "Your 10% off LETHWEI® code",
            `Thanks for joining the LETHWEI® list! Use code ${discount.code} for 10% off your first order at lethwei.com/shop.`
          );
        } catch (err) {
          console.error("[discount-signup] sendEmail failed:", err instanceof Error ? err.message : err);
        }
      } catch (err) {
        // Two concurrent requests for the same email both pass findUnique
        // as null, both mint a real Shopify code, and the loser hits this
        // unique constraint. Deactivate the orphaned code rather than
        // leaving a live, unrecorded discount floating in Shopify.
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
          await deactivateDiscountCode(discount.id);
        } else {
          throw err;
        }
      }
    }
  }

  return NextResponse.json({ success: true });
}
