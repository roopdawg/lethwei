"use client";

import { useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

/**
 * Inline email capture on the homepage. Posts to the same endpoint as the
 * popup, so a visitor who dismissed the popup still has a way to get the
 * first-order code.
 */
export default function EmailSignupSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

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
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="py-24 bg-[var(--surface)] border-t border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-12 md:gap-16">
        <div>
          <span className="font-[family-name:var(--font-oswald)] text-[var(--gold)] text-sm tracking-[0.3em] uppercase mb-4 block">
            Keep in the Loop
          </span>
          <h2 className="font-[family-name:var(--font-oswald)] text-5xl md:text-6xl font-bold leading-none">
            The Next Round<span className="text-[var(--red)]">.</span>
          </h2>
          <p className="text-[var(--text-muted)] mt-6 leading-relaxed max-w-md">
            Collection news, future drops and updates from LETHWEI®. Straight to your inbox.
          </p>
        </div>

        <div className="flex flex-col justify-center">
          {status === "success" ? (
            <>
              <h3 className="font-[family-name:var(--font-oswald)] text-2xl tracking-widest uppercase text-[var(--gold)] mb-3">
                You&apos;re in
              </h3>
              <p className="text-[var(--text-muted)]">Check your email for your 10% off code.</p>
            </>
          ) : (
            <form onSubmit={submit}>
              <label
                htmlFor="homepage-email"
                className="font-[family-name:var(--font-oswald)] text-xs tracking-[0.3em] uppercase text-[var(--text-muted)] mb-4 block"
              >
                Your Email Address
              </label>
              <div className="flex items-center gap-4 border-b border-[var(--border)] focus-within:border-[var(--gold)] transition-colors pb-3">
                <input
                  id="homepage-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="flex-1 bg-transparent text-[var(--text)] text-lg placeholder:text-[var(--text-dim)] focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  aria-label="Sign up"
                  className="text-[var(--gold)] hover:text-[var(--gold-light)] disabled:opacity-50 text-2xl leading-none transition-colors"
                >
                  ↗
                </button>
              </div>
              <p className="text-[var(--text-dim)] text-xs mt-4 leading-relaxed">
                By signing up, you agree to receive marketing emails from LETHWEI®. Unsubscribe at any time.
              </p>
              {status === "error" && (
                <p className="text-sm text-[var(--red-hover)] mt-3">Something went wrong — try again.</p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
