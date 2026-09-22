/**
 * Shop integration. Runs in two modes, decided by the server under test:
 *   - catalogue: no Shopify env (CI) → static products, checkout answers 503
 *   - live:      Shopify configured and stocked → Buy buttons, real checkout URL
 */
import { describe, expect, it } from "vitest";
import { Session } from "./helpers";

async function shopHtml() {
  const s = new Session();
  return s.text("/shop");
}

describe("shop page", () => {
  it("renders in exactly one mode", async () => {
    const html = await shopHtml();
    const live = html.includes('data-shop="live"');
    const catalogue = html.includes('data-shop="catalogue"');
    expect(live !== catalogue).toBe(true);
  });

  it("in catalogue mode keeps the Instagram ordering path", async () => {
    const html = await shopHtml();
    if (!html.includes('data-shop="catalogue"')) return;
    expect(html).toContain("DM to Order");
    expect(html).toContain("Online ordering coming soon.");
    expect(html).not.toContain('data-testid="buy-button"');
  });

  it("in live mode shows a price and a Buy button per product and no DM ordering", async () => {
    const html = await shopHtml();
    if (!html.includes('data-shop="live"')) return;
    const products = html.match(/data-testid="live-product"/g)?.length ?? 0;
    const prices = html.match(/data-testid="live-price"/g)?.length ?? 0;
    const buttons = html.match(/data-testid="buy-button"/g)?.length ?? 0;
    expect(products).toBeGreaterThan(0);
    expect(prices).toBe(products);
    expect(buttons).toBe(products);
    expect(html).not.toContain("DM to Order");
    expect(html).not.toContain("to order while the online shop is being built");
  });
});

describe("checkout route", () => {
  it("rejects a missing or malformed variant", async () => {
    // 400 when Shopify is configured, 503 when it is not; never a 200 or 500.
    const s = new Session();
    const res = await s.json("/api/shop/checkout", { variantId: "not-a-gid" });
    expect([400, 503]).toContain(res.status);
  });

  it("rejects a bad quantity", async () => {
    const s = new Session();
    const html = await shopHtml();
    if (!html.includes('data-shop="live"')) return;
    const res = await s.json("/api/shop/checkout", {
      variantId: "gid://shopify/ProductVariant/1",
      quantity: 99,
    });
    expect(res.status).toBe(400);
  });

  it("in live mode returns a Shopify checkout URL for a real variant", async () => {
    const html = await shopHtml();
    if (!html.includes('data-shop="live"')) return;
    const m = html.match(/value="(gid:\/\/shopify\/ProductVariant\/\d+)"/);
    // Single-variant products render no <select>; fall back to the JSON props.
    const variantId =
      m?.[1] ?? html.match(/gid:\\\\u002F\\\\u002Fshopify\\\\u002FProductVariant\\\\u002F(\d+)/)?.[0];
    expect(variantId, "a variant id should be present in the page").toBeTruthy();
    const gid = variantId!.startsWith("gid://")
      ? variantId!
      : `gid://shopify/ProductVariant/${variantId!.split("u002F").pop()}`;
    const s = new Session();
    const res = await s.json("/api/shop/checkout", { variantId: gid, quantity: 1 });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.checkoutUrl).toMatch(/^https:\/\/.+\/(cart\/c|checkouts)\//);
  });
});
