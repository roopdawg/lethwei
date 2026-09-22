"use client";

import { useState } from "react";
import type { ShopVariant } from "@/lib/shop-format";

/**
 * Size picker plus Buy button for one product. Creates a Shopify cart through
 * our API and sends the shopper to Shopify's hosted checkout.
 */
export default function BuyButton({ variants }: { variants: ShopVariant[] }) {
  const purchasable = variants.filter((v) => v.availableForSale);
  const [variantId, setVariantId] = useState(purchasable[0]?.id ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const single = variants.length === 1;
  const soldOut = purchasable.length === 0;

  async function buy() {
    setLoading(true);
    setError("");
    const res = await fetch("/api/shop/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ variantId, quantity: 1 }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.checkoutUrl) {
      setLoading(false);
      setError(data.error || "Checkout failed. Try again.");
      return;
    }
    window.location.assign(data.checkoutUrl);
  }

  return (
    <div className="flex flex-col gap-3" data-testid="buy-button">
      {!single && (
        <select
          value={variantId}
          onChange={(e) => setVariantId(e.target.value)}
          disabled={soldOut}
          aria-label="Size"
          className="px-4 py-3 rounded text-sm outline-none"
          style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
        >
          {variants.map((v) => (
            <option key={v.id} value={v.id} disabled={!v.availableForSale}>
              {v.title}
              {v.availableForSale ? "" : " · Sold out"}
            </option>
          ))}
        </select>
      )}
      <button
        type="button"
        onClick={buy}
        disabled={loading || soldOut}
        className="font-[family-name:var(--font-oswald)] tracking-widest uppercase text-sm bg-[#C41E1E] hover:bg-[#E02020] disabled:bg-[#2A2A2A] disabled:text-[#555555] text-white px-6 py-3 transition-colors inline-block w-full text-center"
      >
        {soldOut ? "Sold out" : loading ? "Opening checkout…" : "Buy now"}
      </button>
      {error && (
        <p className="text-xs" style={{ color: "var(--red)" }}>
          {error}
        </p>
      )}
    </div>
  );
}
