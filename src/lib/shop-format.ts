/**
 * Pure helpers for the shop. No network, no env, unit-tested. The Storefront
 * client in shopify.ts returns raw API shapes; everything the page renders
 * goes through here first.
 */

export type StorefrontMoney = { amount: string; currencyCode: string };

export type StorefrontVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: StorefrontMoney;
};

export type StorefrontProduct = {
  id: string;
  handle: string;
  title: string;
  description: string;
  availableForSale: boolean;
  images: { edges: { node: { url: string; altText: string | null } }[] };
  variants: { edges: { node: StorefrontVariant }[] };
};

export type ShopVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: string;
};

export type ShopProduct = {
  id: string;
  handle: string;
  name: string;
  description: string;
  availableForSale: boolean;
  /** At-rest image first, hover image second, as the static catalogue does. */
  views: { src: string; label: string }[];
  /** Lowest variant price, already formatted. */
  price: string;
  variants: ShopVariant[];
};

const LABELS = ["Front", "Back", "Side"];

export function formatPrice(money: StorefrontMoney): string {
  const n = Number(money.amount);
  if (!Number.isFinite(n)) return "";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: money.currencyCode || "USD",
    minimumFractionDigits: n % 1 === 0 ? 0 : 2,
  }).format(n);
}

/** Flattens a Storefront product into what the grid needs. */
export function mapProduct(p: StorefrontProduct): ShopProduct {
  const variants = p.variants.edges.map(({ node }) => ({
    id: node.id,
    title: node.title,
    availableForSale: node.availableForSale,
    price: formatPrice(node.price),
  }));
  const cheapest = p.variants.edges
    .map(({ node }) => Number(node.price.amount))
    .filter(Number.isFinite)
    .sort((a, b) => a - b)[0];
  const currency = p.variants.edges[0]?.node.price.currencyCode ?? "USD";
  const views = p.images.edges.slice(0, 2).map(({ node }, i) => ({
    src: node.url,
    label: node.altText && LABELS.includes(node.altText) ? node.altText : LABELS[i],
  }));
  return {
    id: p.id,
    handle: p.handle,
    name: p.title,
    description: p.description,
    availableForSale: p.availableForSale,
    views,
    price: cheapest === undefined ? "" : formatPrice({ amount: String(cheapest), currencyCode: currency }),
    variants,
  };
}

/** A Shopify GID for a product variant, the only thing checkout accepts. */
export function isVariantId(value: unknown): value is string {
  return typeof value === "string" && /^gid:\/\/shopify\/ProductVariant\/\d+$/.test(value);
}

/** Whole number between 1 and 10; anything else is a 400. */
export function cleanQuantity(value: unknown): number | null {
  if (value === undefined) return 1;
  if (typeof value !== "number" || !Number.isInteger(value)) return null;
  if (value < 1 || value > 10) return null;
  return value;
}
