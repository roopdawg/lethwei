/**
 * Shopify Admin API client — separate from src/lib/shopify.ts (which is the
 * read-only Storefront API the live site renders from). Needs its own token
 * with write_products scope from a custom app in the Shopify admin.
 *
 * This file exists to solve one specific gap: Printify's publish-to-Shopify
 * step lands products in the default "Online Store" sales channel only —
 * there's no Printify parameter to target a different channel. This site's
 * Storefront API reads from a separate "Headless" channel, so without the
 * explicit publish below, every Printify-created product is invisible on
 * lethwei.com.
 */
const API_VERSION = "2025-07";

export function isShopifyAdminConfigured(): boolean {
  return !!(process.env.SHOPIFY_STORE_DOMAIN && process.env.SHOPIFY_ADMIN_TOKEN);
}

async function adminGraphql<T>(
  query: string,
  variables: Record<string, unknown> = {}
): Promise<T> {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_ADMIN_TOKEN;
  if (!domain || !token) throw new Error("Shopify Admin API is not configured");

  const res = await fetch(`https://${domain}/admin/api/${API_VERSION}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`Shopify Admin API responded ${res.status}`);
  const json = (await res.json()) as { data?: T; errors?: unknown };
  if (json.errors) throw new Error(`Shopify Admin API errors: ${JSON.stringify(json.errors)}`);
  if (!json.data) throw new Error("Shopify Admin API returned no data");
  return json.data;
}

let cachedHeadlessPublicationId: string | null = null;

async function getHeadlessPublicationId(): Promise<string> {
  if (process.env.SHOPIFY_HEADLESS_PUBLICATION_ID) {
    return process.env.SHOPIFY_HEADLESS_PUBLICATION_ID;
  }
  if (cachedHeadlessPublicationId) return cachedHeadlessPublicationId;

  const data = await adminGraphql<{
    publications: { edges: { node: { id: string; name: string } }[] };
  }>(`query { publications(first: 20) { edges { node { id name } } } }`);

  const match = data.publications.edges.find((e) => /headless/i.test(e.node.name));
  if (!match) throw new Error('No Shopify sales channel named "Headless" was found');

  cachedHeadlessPublicationId = match.node.id;
  return cachedHeadlessPublicationId;
}

export async function publishToHeadlessChannel(shopifyProductGid: string): Promise<void> {
  const publicationId = await getHeadlessPublicationId();
  await adminGraphql(
    `mutation PublishToHeadless($id: ID!, $publicationId: ID!) {
      publishablePublish(id: $id, input: [{ publicationId: $publicationId }]) {
        userErrors { field message }
      }
    }`,
    { id: shopifyProductGid, publicationId }
  );
}

/**
 * Printify's publish call doesn't hand back the Shopify product's GID
 * directly, so look it up by the exact title we gave Printify. Call this a
 * few seconds after Printify's publish — it's async on Shopify's side.
 */
export async function findShopifyProductGidByTitle(title: string): Promise<string | null> {
  const data = await adminGraphql<{
    products: { edges: { node: { id: string; title: string } }[] };
  }>(`query($q: String!) { products(first: 5, query: $q) { edges { node { id title } } } }`, {
    q: `title:'${title}'`,
  });
  const match = data.products.edges.find((e) => e.node.title === title);
  return match?.node.id ?? null;
}

/**
 * Reuses Shopify's own CDN URL for a product's primary image instead of
 * standing up separate image hosting — needed for the Instagram post, which
 * requires a real public URL (a data: URI from Claude's raw SVG output
 * won't do).
 */
export async function getProductImageUrl(shopifyProductGid: string): Promise<string | null> {
  const data = await adminGraphql<{
    product: { featuredImage: { url: string } | null } | null;
  }>(`query($id: ID!) { product(id: $id) { featuredImage { url } } }`, { id: shopifyProductGid });
  return data.product?.featuredImage?.url ?? null;
}
