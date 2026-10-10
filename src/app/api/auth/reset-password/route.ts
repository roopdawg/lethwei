import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { MIN_PASSWORD_LENGTH } from "@/app/api/auth/register/route";

export async function POST(req: Request) {
  const { email, code, password } = await req.json().catch(() => ({}));

  if (typeof email !== "string" || typeof code !== "string" || typeof password !== "string") {
    return NextResponse.json({ error: "All fields required" }, { status: 400 });
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return NextResponse.json(
      { error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` },
      { status: 400 }
    );
  }

  const token = await prisma.verificationToken.findUnique({
    where: { identifier_token: { identifier: email, token: code } },
  });
  if (!token || token.expires < new Date()) {
    return NextResponse.json({ error: "Invalid or expired code" }, { status: 400 });
  }

  const hashed = await bcrypt.hash(password, 12);
  await prisma.user.update({ where: { email }, data: { password: hashed } });
  await prisma.verificationToken.delete({
    where: { identifier_token: { identifier: email, token: code } },
  });

  return NextResponse.json({ success: true });
}
