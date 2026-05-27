import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, username, password } = await req.json();

  if (!email || !username || !password) {
    return NextResponse.json({ error: "All fields required" }, { status: 400 });
  }

  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
  });
  if (existing) {
    return NextResponse.json({ error: "Email or username already taken" }, { status: 409 });
  }

  const hashed = await bcrypt.hash(password, 12);
  await prisma.user.create({
    data: { email, username, password: hashed },
  });

  return NextResponse.json({ success: true }, { status: 201 });
}
