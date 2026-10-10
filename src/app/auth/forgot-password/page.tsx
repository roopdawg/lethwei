"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Something went wrong.");
      return;
    }
    setSent(true);
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--bg)" }}>
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text)" }}>Reset Password</h1>
        <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
          Enter the email on your account — we&apos;ll send a code to reset your password.
        </p>

        {sent ? (
          <div className="flex flex-col gap-4">
            <p className="text-sm" style={{ color: "var(--text)" }}>
              If that email is on an account, a code is on its way. Check your inbox, then{" "}
              <Link href={`/auth/reset-password?email=${encodeURIComponent(email)}`} style={{ color: "var(--gold)" }}>
                enter it here
              </Link>
              .
            </p>
            <button
              type="button"
              onClick={() => router.push(`/auth/reset-password?email=${encodeURIComponent(email)}`)}
              className="py-3 rounded font-semibold text-sm transition-colors"
              style={{ background: "var(--red)", color: "var(--text)" }}
            >
              Enter Code
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              name="email"
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-3 rounded text-sm outline-none"
              style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
            />
            {error && <p className="text-sm" style={{ color: "var(--red)" }}>{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="py-3 rounded font-semibold text-sm transition-colors"
              style={{ background: "var(--red)", color: "var(--text)" }}
            >
              {loading ? "Sending…" : "Send Code"}
            </button>
          </form>
        )}

        <p className="text-sm mt-6" style={{ color: "var(--text-muted)" }}>
          <Link href="/auth/signin" style={{ color: "var(--gold)" }}>Back to sign in</Link>
        </p>
      </div>
    </main>
  );
}
