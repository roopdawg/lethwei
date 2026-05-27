import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { name, city, state, country, website, instagram, description } = await req.json();

  if (!name || !city || !state) {
    return NextResponse.json({ error: "Name, city, and state are required" }, { status: 400 });
  }

  await prisma.gym.create({
    data: {
      name: name.trim(),
      city: city.trim(),
      state: state.trim(),
      country: country?.trim() || "USA",
      website: website?.trim() || null,
      instagram: instagram?.trim() || null,
      description: description?.trim() || null,
      approved: false,
    },
  });

  return NextResponse.json({ success: true }, { status: 201 });
}
