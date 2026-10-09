import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { canApproveDesign } from "@/lib/permissions";
import { NextResponse } from "next/server";

export async function POST(_req: Request, { params }: { params: Promise<{ designId: string }> }) {
  const actor = await getCurrentUser();
  if (!actor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!canApproveDesign(actor)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { designId } = await params;
  const design = await prisma.design.findUnique({ where: { id: designId } });
  if (!design) return NextResponse.json({ error: "Design not found" }, { status: 404 });
  if (design.status !== "pending") {
    return NextResponse.json({ error: `Design is already ${design.status}` }, { status: 400 });
  }

  const updated = await prisma.design.update({ where: { id: designId }, data: { status: "rejected" } });
  return NextResponse.json({ status: updated.status });
}
