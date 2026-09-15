import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { canApproveGym } from "@/lib/permissions";
import { NextResponse } from "next/server";

export async function DELETE(
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

  await prisma.gym.delete({ where: { id: gymId } });

  return NextResponse.json({ ok: true });
}
