import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { canManageCategories } from "@/lib/permissions";
import { NextResponse } from "next/server";

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
    if (typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "name must be a non-empty string" }, { status: 400 });
    }
    data.name = name.trim();
  }
  if (description !== undefined) {
    if (typeof description !== "string" || !description.trim()) {
      return NextResponse.json(
        { error: "description must be a non-empty string" },
        { status: 400 }
      );
    }
    data.description = description.trim();
  }
  if (icon !== undefined) {
    if (typeof icon !== "string" || !icon.trim()) {
      return NextResponse.json({ error: "icon must be a non-empty string" }, { status: 400 });
    }
    data.icon = icon.trim();
  }
  if (order !== undefined) {
    if (typeof order !== "number" || !Number.isFinite(order)) {
      return NextResponse.json({ error: "order must be a number" }, { status: 400 });
    }
    data.order = order;
  }
  if (slug !== undefined) {
    if (typeof slug !== "string" || !slug.trim()) {
      return NextResponse.json({ error: "slug must be a non-empty string" }, { status: 400 });
    }
    const trimmedSlug = slug.trim();
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
