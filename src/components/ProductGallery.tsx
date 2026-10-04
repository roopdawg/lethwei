"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "lethwei:productAnimation";
const PREFERENCE_EVENT = "lethwei:productAnimationChange";

function readPreference(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === null ? true : stored === "on";
  } catch {
    return true;
  }
}

/**
 * Shared on/off state for product-image motion, synced across every gallery
 * and toggle on the page via a custom event (localStorage's own "storage"
 * event only fires cross-tab, not within the tab that wrote it).
 */
function useProductAnimation() {
  // Starts false so server-rendered markup (and the first client paint, before
  // this effect runs) is always the plain hover-swap version — then upgrades
  // to the stored preference after mount. Keeps SSR and first paint identical
  // and gives no-JS/crawler requests the static fallback instead of nothing.
  const [enabled, setEnabled] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setEnabled(readPreference());
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onMotionChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    const onPreferenceChange = () => setEnabled(readPreference());
    mq.addEventListener("change", onMotionChange);
    window.addEventListener(PREFERENCE_EVENT, onPreferenceChange);
    return () => {
      mq.removeEventListener("change", onMotionChange);
      window.removeEventListener(PREFERENCE_EVENT, onPreferenceChange);
    };
  }, []);

  const toggle = () => {
    const next = !enabled;
    setEnabled(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next ? "on" : "off");
    } catch {
      // Private window / blocked storage — state still updates for this session.
    }
    window.dispatchEvent(new Event(PREFERENCE_EVENT));
  };

  return { animate: enabled && !reducedMotion, enabled, reducedMotion, toggle };
}

/** Same outline-button styling used site-wide, just with a status dot added. */
export function ProductAnimationToggle({ className = "" }: { className?: string }) {
  const { enabled, reducedMotion, toggle } = useProductAnimation();
  if (reducedMotion) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={enabled}
      className={`font-[family-name:var(--font-oswald)] tracking-widest uppercase text-xs border border-[#2A2A2A] hover:border-[#D4A017] hover:text-[#D4A017] text-[#888888] px-4 py-2 transition-colors inline-flex items-center gap-2 ${className}`}
    >
      <span className={`w-2 h-2 rounded-full ${enabled ? "bg-[#D4A017]" : "bg-[#555555]"}`} />
      {enabled ? "Motion: On" : "Motion: Off"}
    </button>
  );
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
