import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { canBanUser } from "@/lib/permissions";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const actor = await getCurrentUser();
  if (!actor) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const { banned } = (body ?? {}) as { banned?: unknown };
  if (typeof banned !== "boolean") {
    return NextResponse.json({ error: "banned must be a boolean" }, { status: 400 });
  }

  const { userId } = await params;
  const target = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true, banned: true },
  });
  if (!target) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (!canBanUser(actor, target)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { banned },
    select: { banned: true },
  });

  return NextResponse.json({ banned: updated.banned });
}
