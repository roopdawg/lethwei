import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { canApproveDesign } from "@/lib/permissions";
import { publishDesign } from "@/lib/design-pipeline";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: Promise<{ designId: string }> }) {
  const actor = await getCurrentUser();
  if (!actor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!canApproveDesign(actor)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { designId } = await params;
  const design = await prisma.design.findUnique({ where: { id: designId } });
  if (!design) return NextResponse.json({ error: "Design not found" }, { status: 404 });
  if (design.status !== "pending") {
    return NextResponse.json({ error: `Design is already ${design.status}` }, { status: 400 });
  }

  // Let the admin adjust which garments to publish this design on before
  // approving, defaulting to whatever the generation batch targeted.
  const raw = await req.json().catch(() => ({}));
  const productTypes = Array.isArray(raw?.productTypes) && raw.productTypes.every((t: unknown) => typeof t === "string")
    ? (raw.productTypes as string[])
    : design.productTypes;

  const updated = await prisma.design.update({
    where: { id: designId },
    data: { status: "approved", productTypes },
  });

  // Runs the Printify → Shopify Headless fix → Instagram chain. Awaited
  // rather than fired-and-forgotten since this is a low-frequency admin
  // action (not a hot path) and the admin should see the real result.
  await publishDesign(updated);

  const final = await prisma.design.findUnique({ where: { id: designId } });
  return NextResponse.json({ status: final?.status, publishResults: final?.publishResults });
}
