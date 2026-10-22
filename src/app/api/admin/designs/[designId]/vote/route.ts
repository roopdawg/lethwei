import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { canVoteOnDesigns } from "@/lib/permissions";
import { NextResponse } from "next/server";

/**
 * Casts (or changes) the signed-in judge's single favorite-design vote for
 * that design's batch (month) — the @@unique([batchLabel, voterId])
 * constraint means re-voting in the same batch just moves the pick, it
 * never stacks up extra votes.
 */
export async function POST(_req: Request, { params }: { params: Promise<{ designId: string }> }) {
  const actor = await getCurrentUser();
  if (!actor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!canVoteOnDesigns(actor)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { designId } = await params;
  const design = await prisma.design.findUnique({ where: { id: designId } });
  if (!design) return NextResponse.json({ error: "Design not found" }, { status: 404 });

  const vote = await prisma.designVote.upsert({
    where: { batchLabel_voterId: { batchLabel: design.batchLabel, voterId: actor.id } },
    update: { designId },
    create: { batchLabel: design.batchLabel, designId, voterId: actor.id },
  });

  return NextResponse.json({ voteId: vote.id, designId: vote.designId });
}
