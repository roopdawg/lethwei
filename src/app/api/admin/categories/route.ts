import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { canManageCategories } from "@/lib/permissions";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const actor = await getCurrentUser();
  if (!actor) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!canManageCategories(actor)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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

  if (
    typeof name !== "string" || !name.trim() ||
    typeof slug !== "string" || !slug.trim() ||
    typeof description !== "string" || !description.trim()
  ) {
    return NextResponse.json(
      { error: "name, slug, and description are required" },
      { status: 400 }
    );
  }

  const trimmedSlug = slug.trim();
  const existing = await prisma.category.findUnique({ where: { slug: trimmedSlug } });
  if (existing) {
    return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
  }

  const category = await prisma.category.create({
    data: {
      name: name.trim(),
      slug: trimmedSlug,
      description: description.trim(),
      ...(typeof icon === "string" && icon.trim() ? { icon: icon.trim() } : {}),
      ...(typeof order === "number" && Number.isFinite(order) ? { order } : {}),
    },
  });

  return NextResponse.json({ id: category.id }, { status: 201 });
}
