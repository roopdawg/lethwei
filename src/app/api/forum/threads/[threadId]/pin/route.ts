import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { canPinThread } from "@/lib/permissions";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ threadId: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!canPinThread(user)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { threadId } = await params;
  const thread = await prisma.thread.findUnique({ where: { id: threadId } });
  if (!thread) {
    return NextResponse.json({ error: "Thread not found" }, { status: 404 });
  }

  const { pinned } = await req.json();
  if (typeof pinned !== "boolean") {
    return NextResponse.json({ error: "pinned must be a boolean" }, { status: 400 });
  }

  await prisma.thread.update({ where: { id: threadId }, data: { pinned } });
  return NextResponse.json({ pinned });
}
