import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { canDeletePost, canEditPost } from "@/lib/permissions";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ threadId: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { threadId } = await params;
  const thread = await prisma.thread.findUnique({ where: { id: threadId } });
  if (!thread) {
    return NextResponse.json({ error: "Thread not found" }, { status: 404 });
  }

  if (!canEditPost(user, thread, thread)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { title, body } = await req.json();
  const data: { title?: string; body?: string; editedAt: Date } = { editedAt: new Date() };
  if (typeof title === "string" && title.trim()) data.title = title.trim();
  if (typeof body === "string" && body.trim()) data.body = body.trim();
  if (!data.title && !data.body) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  await prisma.thread.update({ where: { id: threadId }, data });
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ threadId: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { threadId } = await params;
  const thread = await prisma.thread.findUnique({ where: { id: threadId } });
  if (!thread) {
    return NextResponse.json({ error: "Thread not found" }, { status: 404 });
  }

  if (!canDeletePost(user, thread)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.thread.delete({ where: { id: threadId } });
  return NextResponse.json({ ok: true });
}
