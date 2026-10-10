import crypto from "node:crypto";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CODE_TTL_MS = 15 * 60 * 1000;

/**
 * Always returns a generic success response regardless of whether the email
 * matches an account — doesn't leak which emails are registered. The actual
 * code is only sent (or logged, if email isn't configured yet) when a match
 * exists.
 */
export async function POST(req: Request) {
  const { email } = await req.json().catch(() => ({}));
  if (typeof email !== "string" || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (user) {
    const code = crypto.randomInt(100000, 1000000).toString();

    // One outstanding code per email — replace, don't stack.
    await prisma.verificationToken.deleteMany({ where: { identifier: email } });
    await prisma.verificationToken.create({
      data: { identifier: email, token: code, expires: new Date(Date.now() + CODE_TTL_MS) },
    });

    await sendEmail(
      email,
      "Your LETHWEI® password reset code",
      `Your password reset code is ${code}. It expires in 15 minutes. If you didn't request this, ignore this email.`
    );
  }

  return NextResponse.json({ success: true });
}
