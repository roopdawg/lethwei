import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { canApproveGym } from "@/lib/permissions";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ gymId: string }> }
) {
  const actor = await getCurrentUser();
  if (!actor) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!canApproveGym(actor)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { gymId } = await params;
  const gym = await prisma.gym.findUnique({ where: { id: gymId } });
  if (!gym) {
    return NextResponse.json({ error: "Gym not found" }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const { approved } = (body ?? {}) as { approved?: unknown };
  if (typeof approved !== "boolean") {
    return NextResponse.json({ error: "approved must be a boolean" }, { status: 400 });
  }

  const updated = await prisma.gym.update({
    where: { id: gymId },
    data: { approved },
    select: { approved: true },
  });

  return NextResponse.json({ approved: updated.approved });
}
