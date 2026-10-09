/**
 * Printify API client. Uploads artwork, creates a product on a blueprint
 * (e.g. a specific t-shirt), and publishes it — Printify auto-generates
 * mockups on product creation, no separate call needed.
 *
 * NOTE: Printify's own publish call is asynchronous and normally expects a
 * webhook callback (publishing_succeeded.json) once Shopify finishes
 * processing. This client doesn't implement that callback yet — the caller
 * (src/lib/design-pipeline.ts) works around it with a fixed delay + lookup
 * by title instead. Replace with the real webhook once this is live and the
 * actual timing is known.
 */
const API_BASE = "https://api.printify.com/v1";

export function isPrintifyConfigured(): boolean {
  return !!(process.env.PRINTIFY_API_TOKEN && process.env.PRINTIFY_SHOP_ID);
}

async function printifyFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = process.env.PRINTIFY_API_TOKEN;
  if (!token) throw new Error("Printify is not configured");

  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Printify ${path} responded ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

export async function uploadImage(imageUrl: string, fileName: string): Promise<string> {
  const data = await printifyFetch<{ id: string }>("/uploads/images.json", {
    method: "POST",
    body: JSON.stringify({ file_name: fileName, url: imageUrl }),
  });
  return data.id;
}

/** For artwork that only exists as bytes we generated (e.g. a rasterized
 * SVG), not something with its own public URL. */
export async function uploadImageBase64(base64Contents: string, fileName: string): Promise<string> {
  const data = await printifyFetch<{ id: string }>("/uploads/images.json", {
    method: "POST",
    body: JSON.stringify({ file_name: fileName, contents: base64Contents }),
  });
  return data.id;
}

export type PrintifyProductConfig = {
  blueprintId: number;
  printProviderId: number;
  variantIds: number[];
  label: string;
};

let cachedProductConfig: Record<string, PrintifyProductConfig> | null = null;

/** Per-garment Printify blueprint/provider/variant IDs, keyed by productType
 * (e.g. "mens-shorts"). Looked up from real catalog data, not guessed —
 * see PRINTIFY_PRODUCT_CONFIG in Railway. */
export function getProductConfig(productType: string): PrintifyProductConfig | null {
  if (!cachedProductConfig) {
    const raw = process.env.PRINTIFY_PRODUCT_CONFIG;
    if (!raw) return null;
    try {
      cachedProductConfig = JSON.parse(raw);
    } catch {
      throw new Error("PRINTIFY_PRODUCT_CONFIG is not valid JSON");
    }
  }
  return cachedProductConfig?.[productType] ?? null;
}

export function listConfiguredProductTypes(): string[] {
  if (!cachedProductConfig) getProductConfig("__probe__");
  return Object.keys(cachedProductConfig ?? {});
}

/**
 * NOTE on `position: "front"` below: the shorts/jacket blueprints this is
 * being used for are Printify's All-Over-Print (AOP) products. AOP print
 * areas commonly use a different placeholder layout than a simple
 * front-print tee (sometimes a single wraparound position, sometimes
 * several named ones) — this hasn't been verified against a real AOP
 * product creation call yet. If a created product comes back with the
 * artwork missing/misplaced, this is the first thing to check against
 * Printify's docs for blueprint-specific print_areas.
 */
export async function createAndPublishProduct(opts: {
  title: string;
  description: string;
  blueprintId: number;
  printProviderId: number;
  variantIds: number[];
  printAreaImageId: string;
}): Promise<{ productId: string }> {
  const shopId = process.env.PRINTIFY_SHOP_ID;

  const product = await printifyFetch<{ id: string }>(`/shops/${shopId}/products.json`, {
    method: "POST",
    body: JSON.stringify({
      title: opts.title,
      description: opts.description,
      blueprint_id: opts.blueprintId,
      print_provider_id: opts.printProviderId,
      variants: opts.variantIds.map((id) => ({ id, price: 2500, is_enabled: true })),
      print_areas: [
        {
          variant_ids: opts.variantIds,
          placeholders: [
            {
              position: "front",
              images: [{ id: opts.printAreaImageId, x: 0.5, y: 0.5, scale: 1, angle: 0 }],
            },
          ],
        },
      ],
    }),
  });

  await printifyFetch(`/shops/${shopId}/products/${product.id}/publish.json`, {
    method: "POST",
    body: JSON.stringify({
      title: true,
      description: true,
      images: true,
      variants: true,
      tags: true,
      keyFeatures: true,
      shipping_template: true,
    }),
  });

  return { productId: product.id };
}
