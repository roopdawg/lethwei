/**
 * Shopify Storefront API client. Server-side only: never import this from a
 * "use client" file. Uses plain fetch, no SDK.
 *
 * Configured by two env vars. When either is missing the shop page falls back
 * to the static catalogue and checkout returns 503, so a fresh checkout (CI,
 * a new laptop) still runs and tests still pass.
 */
import { mapProduct, type ShopProduct, type StorefrontProduct } from "@/lib/shop-format";

const API_VERSION = "2025-07";

export function isShopifyConfigured(): boolean {
  return !!(process.env.SHOPIFY_STORE_DOMAIN && process.env.SHOPIFY_STOREFRONT_TOKEN);
}

type GraphQLResponse<T> = { data?: T; errors?: { message: string }[] };

async function storefront<T>(
  query: string,
  variables: Record<string, unknown> = {},
  revalidate: number | false = 60
): Promise<T> {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_TOKEN;
  if (!domain || !token) throw new Error("Shopify is not configured");

  const res = await fetch(`https://${domain}/api/${API_VERSION}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
    ...(revalidate === false ? { cache: "no-store" } : { next: { revalidate } }),
  });
  if (!res.ok) throw new Error(`Shopify responded ${res.status}`);
  const json = (await res.json()) as GraphQLResponse<T>;
  if (json.errors?.length) throw new Error(json.errors.map((e) => e.message).join("; "));
  if (!json.data) throw new Error("Shopify returned no data");
  return json.data;
}

const PRODUCTS_QUERY = /* GraphQL */ `
  query ShopProducts {
    products(first: 50, sortKey: CREATED_AT, reverse: true) {
      edges {
        node {
          id
          handle
          title
          description
          availableForSale
          images(first: 2) { edges { node { url altText } } }
          variants(first: 50) {
            edges {
              node {
                id
                title
                availableForSale
                price { amount currencyCode }
              }
            }
          }
        }
      }
    }
  }
`;

/**
 * Every product published to the Headless channel. Returns [] when Shopify is
 * not configured or unreachable; the page treats [] as "use the catalogue".
 */
export async function getProducts(): Promise<ShopProduct[]> {
  if (!isShopifyConfigured()) return [];
  try {
    const data = await storefront<{ products: { edges: { node: StorefrontProduct }[] } }>(
      PRODUCTS_QUERY
    );
    return data.products.edges.map(({ node }) => mapProduct(node));
  } catch (err) {
    console.error("[shopify] getProducts failed:", err instanceof Error ? err.message : err);
    return [];
  }
}

const CART_CREATE = /* GraphQL */ `
  mutation CreateCart($lines: [CartLineInput!]!) {
    cartCreate(input: { lines: $lines }) {
      cart { checkoutUrl }
      userErrors { field message }
    }
  }
`;

/**
 * Creates a Shopify cart with one line and returns the hosted checkout URL.
 * Throws with Shopify's own message when the variant is unknown or sold out.
 */
export async function createCheckout(variantId: string, quantity: number): Promise<string> {
  const data = await storefront<{
    cartCreate: { cart: { checkoutUrl: string } | null; userErrors: { message: string }[] };
  }>(CART_CREATE, { lines: [{ merchandiseId: variantId, quantity }] }, false);
  const { cart, userErrors } = data.cartCreate;
  if (userErrors.length) throw new Error(userErrors.map((e) => e.message).join("; "));
  if (!cart?.checkoutUrl) throw new Error("Shopify returned no checkout URL");
  return cart.checkoutUrl;
}
