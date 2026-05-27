import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ threadId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
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

  const reply = await prisma.reply.create({
    data: {
      body: body.trim(),
      threadId,
      userId: session.user.id,
    },
  });

  return NextResponse.json({ replyId: reply.id }, { status: 201 });
}
