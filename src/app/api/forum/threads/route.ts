import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { canPost } from "@/lib/permissions";
import { LIMITS, cleanText } from "@/lib/limits";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!canPost(user)) {
    return NextResponse.json({ error: "Banned" }, { status: 403 });
  }

  const raw = await req.json().catch(() => ({}));
  const title = cleanText(raw?.title, LIMITS.threadTitle);
  const body = cleanText(raw?.body, LIMITS.threadBody);
  const categorySlug = cleanText(raw?.categorySlug, LIMITS.categorySlug);
  if (!title || !body || !categorySlug) {
    return NextResponse.json({ error: "All fields required" }, { status: 400 });
  }

  const category = await prisma.category.findUnique({ where: { slug: categorySlug } });
  if (!category) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  const thread = await prisma.thread.create({
    data: {
      title,
      body,
      categoryId: category.id,
      userId: user.id,
    },
  });

  return NextResponse.json({ threadId: thread.id }, { status: 201 });
}
