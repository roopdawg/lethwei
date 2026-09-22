import { NextResponse } from "next/server";
import { createCheckout, isShopifyConfigured } from "@/lib/shopify";
import { cleanQuantity, isVariantId } from "@/lib/shop-format";

/**
 * POST { variantId, quantity? } → { checkoutUrl }
 * Creates a Shopify cart and hands the shopper to Shopify's hosted checkout.
 * No account needed: anyone can buy.
 */
export async function POST(req: Request) {
  if (!isShopifyConfigured()) {
    return NextResponse.json({ error: "Online ordering is not available yet" }, { status: 503 });
  }

  const raw = await req.json().catch(() => ({}));
  const quantity = cleanQuantity(raw?.quantity);
  if (!isVariantId(raw?.variantId) || quantity === null) {
    return NextResponse.json({ error: "Pick a size and quantity" }, { status: 400 });
  }

  try {
    const checkoutUrl = await createCheckout(raw.variantId, quantity);
    return NextResponse.json({ checkoutUrl });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Checkout failed";
    console.error("[shopify] checkout failed:", message);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
