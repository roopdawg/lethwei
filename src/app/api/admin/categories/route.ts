import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { canManageCategories } from "@/lib/permissions";
import { NextResponse } from "next/server";
import { LIMITS, cleanSlug, cleanText } from "@/lib/limits";

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

  const cleanName = cleanText(name, LIMITS.categoryName);
  const trimmedSlug = cleanSlug(slug);
  const cleanDescription = cleanText(description, LIMITS.categoryDescription);
  if (!cleanName || !trimmedSlug || !cleanDescription) {
    return NextResponse.json(
      { error: "name, slug (lowercase letters, digits, hyphens), and description are required" },
      { status: 400 }
    );
  }
  const cleanIcon = icon === undefined ? undefined : cleanText(icon, LIMITS.categoryIcon);
  if (icon !== undefined && !cleanIcon) {
    return NextResponse.json({ error: "Invalid icon" }, { status: 400 });
  }
  const existing = await prisma.category.findUnique({ where: { slug: trimmedSlug } });
  if (existing) {
    return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
  }

  const category = await prisma.category.create({
    data: {
      name: cleanName,
      slug: trimmedSlug,
      description: cleanDescription,
      ...(cleanIcon ? { icon: cleanIcon } : {}),
      ...(typeof order === "number" && Number.isFinite(order) ? { order } : {}),
    },
  });

  return NextResponse.json({ id: category.id }, { status: 201 });
}
