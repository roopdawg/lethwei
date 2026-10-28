"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";

const DISMISS_KEY = "lethwei-discount-popup-dismissed";
const SHOW_DELAY_MS = 2000;

type Status = "idle" | "submitting" | "success" | "error";

export default function DiscountSignupPopup() {
  const pathname = usePathname();
  const skip = pathname?.startsWith("/admin") || pathname?.startsWith("/auth");
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    if (skip) return;
    let dismissed = false;
    try {
      dismissed = localStorage.getItem(DISMISS_KEY) === "1";
    } catch {
      // Private browsing / blocked storage — just show the popup.
    }
    if (dismissed) return;
    const timer = setTimeout(() => setOpen(true), SHOW_DELAY_MS);
    return () => clearTimeout(timer);
  }, [skip]);

  function dismiss() {
    setOpen(false);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // Ignore — worst case the popup reappears next visit.
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/api/discount-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("request failed");
      setStatus("success");
      try {
        localStorage.setItem(DISMISS_KEY, "1");
      } catch {
        // Ignore.
      }
    } catch {
      setStatus("error");
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4">
      <div className="relative w-full max-w-md border border-[var(--border)] bg-[var(--surface)] p-8">
        <button
          onClick={dismiss}
          aria-label="Close"
          className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--text)]"
        >
          <X size={20} />
        </button>

        {status === "success" ? (
          <>
            <h2 className="font-[family-name:var(--font-oswald)] text-2xl tracking-widest uppercase text-[var(--gold)] mb-3">
              You&apos;re in
            </h2>
            <p className="text-[var(--text-muted)]">
              Check your email for your 10% off code.
            </p>
          </>
        ) : (
          <>
            <h2 className="font-[family-name:var(--font-oswald)] text-2xl tracking-widest uppercase text-[var(--text)] mb-2">
              Get 10% Off
            </h2>
            <p className="text-[var(--text-muted)] mb-6">
              Join the list for 10% off your first order.
            </p>
            <form onSubmit={submit} className="flex flex-col gap-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] px-4 py-3 placeholder:text-[var(--text-dim)] focus:outline-none focus:border-[var(--gold)]"
              />
              <button
                type="submit"
                disabled={status === "submitting"}
                className="font-[family-name:var(--font-oswald)] tracking-widest uppercase bg-[var(--red)] hover:bg-[var(--red-hover)] disabled:opacity-60 text-white px-4 py-3 transition-colors"
              >
                {status === "submitting" ? "Submitting..." : "Claim My Code"}
              </button>
              {status === "error" && (
                <p className="text-sm text-[var(--red-hover)]">Something went wrong — try again.</p>
              )}
            </form>
          </>
        )}
      </div>
    </div>
  );
}
