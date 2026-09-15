import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { canReply } from "@/lib/permissions";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ threadId: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { threadId } = await params;
  const { body } = await req.json();
  if (!body?.trim()) {
    return NextResponse.json({ error: "Reply body required" }, { status: 400 });
  }

  const thread = await prisma.thread.findUnique({ where: { id: threadId } });
  if (!thread) {
    return NextResponse.json({ error: "Thread not found" }, { status: 404 });
  }

  if (user.banned) {
    return NextResponse.json({ error: "Banned" }, { status: 403 });
  }
  if (!canReply(user, thread)) {
    return NextResponse.json({ error: "Thread locked" }, { status: 403 });
  }

  const reply = await prisma.reply.create({
    data: {
      body: body.trim(),
      threadId,
      userId: user.id,
    },
  });

  return NextResponse.json({ replyId: reply.id }, { status: 201 });
}
