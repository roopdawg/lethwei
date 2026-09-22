import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { canDeletePost, canEditPost } from "@/lib/permissions";
import { NextResponse } from "next/server";
import { LIMITS, cleanText } from "@/lib/limits";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ replyId: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { replyId } = await params;
  const reply = await prisma.reply.findUnique({
    where: { id: replyId },
    include: { thread: true },
  });
  if (!reply) {
    return NextResponse.json({ error: "Reply not found" }, { status: 404 });
  }

  if (!canEditPost(user, reply, reply.thread)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const raw = await req.json().catch(() => ({}));
  const body = cleanText(raw?.body, LIMITS.replyBody);
  if (!body) {
    return NextResponse.json({ error: "Reply body required" }, { status: 400 });
  }

  await prisma.reply.update({
    where: { id: replyId },
    data: { body, editedAt: new Date() },
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ replyId: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { replyId } = await params;
  const reply = await prisma.reply.findUnique({ where: { id: replyId } });
  if (!reply) {
    return NextResponse.json({ error: "Reply not found" }, { status: 404 });
  }

  if (!canDeletePost(user, reply)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.reply.delete({ where: { id: replyId } });
  return NextResponse.json({ ok: true });
}
