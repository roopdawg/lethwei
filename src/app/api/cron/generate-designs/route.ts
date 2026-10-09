import { prisma } from "@/lib/prisma";
import { generateDesigns, isClaudeDesignConfigured } from "@/lib/claude-design";
import { listConfiguredProductTypes } from "@/lib/printify";
import { NextResponse } from "next/server";

function isAuthorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return req.headers.get("x-cron-secret") === secret;
}

function currentBatchLabel(): string {
  const d = new Date();
  const onejan = new Date(d.getUTCFullYear(), 0, 1);
  const week = Math.ceil(((d.getTime() - onejan.getTime()) / 86400000 + onejan.getUTCDay() + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

/**
 * Triggers one batch of AI design generation. Protected by a shared secret
 * header rather than user auth, since this is meant to be called by an
 * external scheduler (Railway cron / cron-job.org / similar), not a signed-in
 * admin — no such schedule is wired up yet, this just needs to exist for
 * when it is.
 *
 * Body: { brief: string, productTypes: string[], count?: number }
 * e.g. { "brief": "fight shorts for men and women", "productTypes": ["mens-shorts","womens-shorts"], "count": 3 }
 */
export async function POST(req: Request) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isClaudeDesignConfigured()) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY is not configured" }, { status: 503 });
  }

  const raw = await req.json().catch(() => ({}));
  const brief = typeof raw?.brief === "string" && raw.brief.trim() ? raw.brief.trim() : null;
  if (!brief) return NextResponse.json({ error: "brief is required" }, { status: 400 });

  const productTypes = Array.isArray(raw?.productTypes) && raw.productTypes.length > 0
    ? raw.productTypes.filter((t: unknown) => typeof t === "string")
    : listConfiguredProductTypes();
  if (productTypes.length === 0) {
    return NextResponse.json({ error: "No productTypes given and PRINTIFY_PRODUCT_CONFIG is empty" }, { status: 400 });
  }

  const count = Number.isInteger(raw?.count) && raw.count > 0 && raw.count <= 10 ? raw.count : 3;
  const batchLabel = currentBatchLabel();

  const generated = await generateDesigns(brief, count);

  const created = await prisma.$transaction(
    generated.map((d) =>
      prisma.design.create({
        data: {
          batchLabel,
          label: d.label,
          imageUrl: d.imageUrl,
          svgMarkup: d.svgMarkup,
          prompt: d.prompt,
          productTypes,
          status: "pending",
        },
      })
    )
  );

  return NextResponse.json({ batchLabel, count: created.length, designIds: created.map((d) => d.id) }, { status: 201 });
}
