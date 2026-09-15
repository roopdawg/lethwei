import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { canManageCategories } from "@/lib/permissions";
import { NextResponse } from "next/server";
import { LIMITS, cleanSlug, cleanText } from "@/lib/limits";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  const actor = await getCurrentUser();
  if (!actor) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!canManageCategories(actor)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { categoryId } = await params;
  const category = await prisma.category.findUnique({ where: { id: categoryId } });
  if (!category) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const { name, slug, description, icon, order } = (body ?? {}) as {
    name?: unknown;
    slug?: unknown;
    description?: unknown;
    icon?: unknown;
    order?: unknown;
  };

  const data: {
    name?: string;
    slug?: string;
    description?: string;
    icon?: string;
    order?: number;
  } = {};

  if (name !== undefined) {
    const v = cleanText(name, LIMITS.categoryName);
    if (!v) return NextResponse.json({ error: "Invalid name" }, { status: 400 });
    data.name = v;
  }
  if (description !== undefined) {
    const v = cleanText(description, LIMITS.categoryDescription);
    if (!v) return NextResponse.json({ error: "Invalid description" }, { status: 400 });
    data.description = v;
  }
  if (icon !== undefined) {
    const v = cleanText(icon, LIMITS.categoryIcon);
    if (!v) return NextResponse.json({ error: "Invalid icon" }, { status: 400 });
    data.icon = v;
  }
  if (order !== undefined) {
    if (typeof order !== "number" || !Number.isFinite(order)) {
      return NextResponse.json({ error: "order must be a number" }, { status: 400 });
    }
    data.order = order;
  }
  if (slug !== undefined) {
    const trimmedSlug = cleanSlug(slug);
    if (!trimmedSlug) {
      return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
    }
    if (trimmedSlug !== category.slug) {
      const existing = await prisma.category.findUnique({ where: { slug: trimmedSlug } });
      if (existing) {
        return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
      }
    }
    data.slug = trimmedSlug;
  }

  await prisma.category.update({ where: { id: categoryId }, data });

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  const actor = await getCurrentUser();
  if (!actor) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!canManageCategories(actor)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { categoryId } = await params;
  const category = await prisma.category.findUnique({ where: { id: categoryId } });
  if (!category) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  const threadCount = await prisma.thread.count({ where: { categoryId } });
  if (threadCount > 0) {
    return NextResponse.json({ error: "Category has threads" }, { status: 409 });
  }

  await prisma.category.delete({ where: { id: categoryId } });

  return NextResponse.json({ ok: true });
}
