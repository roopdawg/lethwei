import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, body, categorySlug } = await req.json();
  if (!title || !body || !categorySlug) {
    return NextResponse.json({ error: "All fields required" }, { status: 400 });
  }

  const category = await prisma.category.findUnique({ where: { slug: categorySlug } });
  if (!category) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  const thread = await prisma.thread.create({
    data: {
      title: title.trim(),
      body: body.trim(),
      categoryId: category.id,
      userId: session.user.id,
    },
  });

  return NextResponse.json({ threadId: thread.id }, { status: 201 });
}
