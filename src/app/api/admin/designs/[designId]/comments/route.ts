import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { canApproveDesign } from "@/lib/permissions";
import { LIMITS, cleanText } from "@/lib/limits";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: Promise<{ designId: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!canApproveDesign(user)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { designId } = await params;
  const raw = await req.json().catch(() => ({}));
  const body = cleanText(raw?.body, LIMITS.designCommentBody);
  if (!body) return NextResponse.json({ error: "Comment body required" }, { status: 400 });

  const design = await prisma.design.findUnique({ where: { id: designId } });
  if (!design) return NextResponse.json({ error: "Design not found" }, { status: 404 });

  const comment = await prisma.designComment.create({ data: { body, designId, userId: user.id } });
  return NextResponse.json({ commentId: comment.id }, { status: 201 });
}
