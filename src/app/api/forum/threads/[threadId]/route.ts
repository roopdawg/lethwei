import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { canDeletePost, canEditPost } from "@/lib/permissions";
import { NextResponse } from "next/server";
import { LIMITS, cleanText } from "@/lib/limits";

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

  const raw = await req.json().catch(() => ({}));
  const data: { title?: string; body?: string; editedAt: Date } = { editedAt: new Date() };
  if (raw?.title !== undefined) {
    const title = cleanText(raw.title, LIMITS.threadTitle);
    if (!title) return NextResponse.json({ error: "Invalid title" }, { status: 400 });
    data.title = title;
  }
  if (raw?.body !== undefined) {
    const body = cleanText(raw.body, LIMITS.threadBody);
    if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    data.body = body;
  }
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
