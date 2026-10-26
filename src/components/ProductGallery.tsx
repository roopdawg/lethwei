"use client";

import { useEffect, useState } from "react";

/**
 * Motion is always on, except when the OS-level prefers-reduced-motion
 * setting is active — that's an accessibility signal, not a user toggle,
 * so it's still respected.
 */
function useProductAnimation() {
  // Starts false so server-rendered markup (and the first client paint, before
  // this effect runs) is always the plain hover-swap version — then upgrades
  // once mounted. Keeps SSR and first paint identical and gives no-JS/crawler
  // requests the static fallback instead of nothing.
  const [reducedMotion, setReducedMotion] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onMotionChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onMotionChange);
    return () => mq.removeEventListener("change", onMotionChange);
  }, []);

  return { animate: mounted && !reducedMotion };
}

/**
 * Stacked product images inside a `relative group` container. With motion on,
 * multi-view products auto-cycle on a timer; with it off, falls back to the
 * original hover-to-reveal-back behaviour exactly.
 */
export function ProductGallery({
  views,
  name,
  rotateMs = 2800,
}: {
  views: { src: string; label: string }[];
  name: string;
  rotateMs?: number;
}) {
  const { animate } = useProductAnimation();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!animate || views.length < 2) {
      setIndex(0);
      return;
    }
    const id = setInterval(() => setIndex((i) => (i + 1) % views.length), rotateMs);
    return () => clearInterval(id);
  }, [animate, views.length, rotateMs]);

  const first = views[0];
  const second = views[1];

  if (!first) return null;

  if (!second) {
    return (
      <img
        src={first.src}
        alt={`${name} — ${first.label.toLowerCase()}`}
        className="w-full h-full object-contain absolute inset-0"
      />
    );
  }

  if (animate) {
    return (
      <>
        {views.map((view, i) => (
          <img
            key={view.src}
            src={view.src}
            alt={`${name} — ${view.label.toLowerCase()}`}
            className="w-full h-full object-contain absolute inset-0 transition-opacity duration-700"
            style={{ opacity: i === index ? 1 : 0 }}
          />
        ))}
        <div className="absolute top-3 left-3">
          <span className="font-[family-name:var(--font-oswald)] text-xs tracking-widest uppercase bg-[#C41E1E]/20 text-[#C41E1E] px-2 py-1">
            {views[index].label}
          </span>
        </div>
      </>
    );
  }

  return (
    <>
      <img
        src={first.src}
        alt={`${name} — ${first.label.toLowerCase()}`}
        className="w-full h-full object-contain absolute inset-0 transition-opacity duration-500 group-hover:opacity-0"
      />
      <img
        src={second.src}
        alt={`${name} — ${second.label.toLowerCase()}`}
        className="w-full h-full object-contain absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />
      <div className="absolute top-3 left-3">
        <span className="font-[family-name:var(--font-oswald)] text-xs tracking-widest uppercase bg-[#C41E1E]/20 text-[#C41E1E] px-2 py-1 transition-opacity duration-500 group-hover:opacity-0">
          {first.label}
        </span>
        <span className="font-[family-name:var(--font-oswald)] text-xs tracking-widest uppercase bg-[#C41E1E]/20 text-[#C41E1E] px-2 py-1 absolute left-0 top-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          {second.label}
        </span>
      </div>
      <span className="absolute bottom-3 right-3 text-[#555555] text-[10px] tracking-widest uppercase group-hover:opacity-0 transition-opacity duration-500">
        Hover for back
      </span>
    </>
  );
}
