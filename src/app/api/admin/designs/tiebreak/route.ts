import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { canApproveDesign } from "@/lib/permissions";
import { tallyBatch, leaders, breakTie } from "@/lib/design-votes";
import { NextResponse } from "next/server";

/**
 * Admin-triggered (not automatic on page load, to avoid an API call per
 * view) — runs the AI tiebreaker for a batch currently tied at the top of
 * the vote count, and persists the reasoning on the winning Design row.
 */
export async function POST(req: Request) {
  const actor = await getCurrentUser();
  if (!actor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!canApproveDesign(actor)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { batchLabel } = await req.json().catch(() => ({}));
  if (typeof batchLabel !== "string" || !batchLabel) {
    return NextResponse.json({ error: "batchLabel is required" }, { status: 400 });
  }

  const tally = await tallyBatch(batchLabel);
  const tied = leaders(tally);
  if (tied.length < 2) {
    return NextResponse.json({ error: "This batch isn't tied — nothing to break" }, { status: 400 });
  }

  let result;
  try {
    result = await breakTie(batchLabel, tied.map((t) => t.designId));
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Tiebreak call failed" },
      { status: 502 }
    );
  }
  if (!result) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY is not configured" }, { status: 503 });
  }

  await prisma.design.update({
    where: { id: result.designId },
    data: { aiTiebreakReason: result.reason },
  });

  return NextResponse.json(result);
}
