import { describe, expect, it } from "vitest";
import {
  cleanQuantity,
  formatPrice,
  isVariantId,
  mapProduct,
  type StorefrontProduct,
} from "../../src/lib/shop-format";

const money = (amount: string, currencyCode = "USD") => ({ amount, currencyCode });

const product: StorefrontProduct = {
  id: "gid://shopify/Product/1",
  handle: "skull-tee",
  title: "LETHWEI® Skull Tee",
  description: "Acid wash heavyweight tee.",
  availableForSale: true,
  images: {
    edges: [
      { node: { url: "https://cdn.shopify.com/front.jpg", altText: null } },
      { node: { url: "https://cdn.shopify.com/back.jpg", altText: "Back" } },
      { node: { url: "https://cdn.shopify.com/third.jpg", altText: null } },
    ],
  },
  variants: {
    edges: [
      { node: { id: "gid://shopify/ProductVariant/11", title: "M", availableForSale: true, price: money("40.00") } },
      { node: { id: "gid://shopify/ProductVariant/12", title: "L", availableForSale: false, price: money("38.50") } },
    ],
  },
};

describe("formatPrice", () => {
  it("drops cents on whole dollars and keeps them otherwise", () => {
    expect(formatPrice(money("40.00"))).toBe("$40");
    expect(formatPrice(money("38.50"))).toBe("$38.50");
    expect(formatPrice(money("1.00"))).toBe("$1");
  });

  it("returns empty for a non-numeric amount instead of throwing", () => {
    expect(formatPrice(money("abc"))).toBe("");
  });
});

describe("mapProduct", () => {
  it("keeps only two images, labelled Front then Back unless Shopify says otherwise", () => {
    const p = mapProduct(product);
    expect(p.views).toEqual([
      { src: "https://cdn.shopify.com/front.jpg", label: "Front" },
      { src: "https://cdn.shopify.com/back.jpg", label: "Back" },
    ]);
  });

  it("shows the cheapest variant price, including sold-out variants", () => {
    expect(mapProduct(product).price).toBe("$38.50");
  });

  it("carries variant ids, titles, availability and prices", () => {
    const p = mapProduct(product);
    expect(p.variants).toEqual([
      { id: "gid://shopify/ProductVariant/11", title: "M", availableForSale: true, price: "$40" },
      { id: "gid://shopify/ProductVariant/12", title: "L", availableForSale: false, price: "$38.50" },
    ]);
  });

  it("handles a product with no images or variants", () => {
    const bare = { ...product, images: { edges: [] }, variants: { edges: [] } };
    const p = mapProduct(bare);
    expect(p.views).toEqual([]);
    expect(p.variants).toEqual([]);
    expect(p.price).toBe("");
  });
});

describe("checkout input", () => {
  it("accepts only a Shopify variant id", () => {
    expect(isVariantId("gid://shopify/ProductVariant/123")).toBe(true);
    expect(isVariantId("gid://shopify/Product/123")).toBe(false);
    expect(isVariantId("123")).toBe(false);
    expect(isVariantId(123)).toBe(false);
    expect(isVariantId(undefined)).toBe(false);
  });

  it("defaults quantity to 1 and caps it at 10", () => {
    expect(cleanQuantity(undefined)).toBe(1);
    expect(cleanQuantity(3)).toBe(3);
    expect(cleanQuantity(10)).toBe(10);
    expect(cleanQuantity(0)).toBeNull();
    expect(cleanQuantity(11)).toBeNull();
    expect(cleanQuantity(1.5)).toBeNull();
    expect(cleanQuantity("2")).toBeNull();
  });
});
