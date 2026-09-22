import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { canLockThread } from "@/lib/permissions";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ threadId: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!canLockThread(user)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { threadId } = await params;
  const thread = await prisma.thread.findUnique({ where: { id: threadId } });
  if (!thread) {
    return NextResponse.json({ error: "Thread not found" }, { status: 404 });
  }

  const { locked } = await req.json();
  if (typeof locked !== "boolean") {
    return NextResponse.json({ error: "locked must be a boolean" }, { status: 400 });
  }

  await prisma.thread.update({ where: { id: threadId }, data: { locked } });
  return NextResponse.json({ locked });
}
