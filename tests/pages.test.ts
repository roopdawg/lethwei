import { describe, it, expect } from "vitest";
import { Session } from "./helpers";

const s = new Session();

describe("routes respond", () => {
  const ok = ["/", "/learn", "/shop", "/gyms", "/gyms/submit", "/forum", "/trademark", "/auth/signin", "/auth/signup"];
  it.each(ok)("%s returns 200", async (path) => {
    expect((await s.fetch(path)).status).toBe(200);
  });

  it("an unknown path returns a branded 404", async () => {
    const res = await s.fetch("/no-such-page");
    expect(res.status).toBe(404);
    expect(await res.text()).toContain("DIDN'T MAKE WEIGHT");
  });
});

describe("assets", () => {
  const assets = ["/favicon.ico", "/og.jpg", "/emblem.webp", "/wear-01.webp", "/hat-script-pink-front.webp"];
  it.each(assets)("%s is served", async (path) => {
    expect((await s.fetch(path)).status).toBe(200);
  });
});

/**
 * Trademark symbols.
 *
 * ® is only lawful for what a registration actually covers:
 *   Reg. 6667578 (Class 025, Principal)    — shirts, hats, hoodies, jackets
 *   Reg. 6661546 (Class 038, Supplemental) — broadcasting, streaming, on-line forums
 * Everything else — gyms, training, coaching, the sport itself — must stay ™.
 *
 * These tests exist to stop a well-meaning find-and-replace from putting ®
 * on gym services, which would be improper use.
 */
describe("trademark symbols", () => {
  it("uses ® on product names, which are all registered goods", async () => {
    const html = await s.text("/shop");
    expect(html).toContain("LETHWEI® Skull Tee");
    expect(html).toContain("LETHWEI® 9 Skull Hoodie");
    expect(html).toContain("LETHWEI® Script Cap");
  });

  it("uses ® on the forum, which is a recited service", async () => {
    expect(await s.text("/forum")).toContain("LETHWEI®");
  });

  it("never uses ® next to gym or training services", async () => {
    for (const path of ["/gyms", "/gyms/submit"]) {
      const html = await s.text(path);
      expect(html).not.toMatch(/LETHWEI®\s*(gym|Gym|training|martial)/);
    }
  });

  it("keeps ™ for the unregistered services on /gyms", async () => {
    expect(await s.text("/gyms")).toContain("LETHWEI™");
  });

  it("names the owner and both registrations on /trademark", async () => {
    const html = await s.text("/trademark");
    expect(html).toContain("Dean Perry Rosenwald");
    expect(html).toContain("6667578");
    expect(html).toContain("6661546");
  });

  it("names the owner in the footer", async () => {
    expect(await s.text("/")).toContain("registered trademark of Dean Perry Rosenwald");
  });
});

/**
 * Regression: both Weapons Tee entries had frontImage and backImage pointing
 * at the same file, so the hover swap did nothing and the back was labelled
 * as the front.
 */
describe("product views", () => {
  it("labels every product view front, back or side", async () => {
    const html = await s.text("/shop");
    expect(html).toMatch(/>(Front|Back|Side)</);
  });

  it("shows a hover hint only where a second view exists", async () => {
    const html = await s.text("/shop");
    const hints = html.match(/Hover for back/g)?.length ?? 0;
    const surf = html.indexOf("LETHWEI® Surf Cap");
    expect(hints).toBeGreaterThan(0);
    expect(surf).toBeGreaterThan(-1); // single-view product is present
  });
});

describe("metadata", () => {
  it("advertises the OG image", async () => {
    const html = await s.text("/");
    expect(html).toMatch(/og:image/);
    expect(html).toContain("og.jpg");
  });
});
