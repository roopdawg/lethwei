"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        code: form.get("code"),
        password: form.get("password"),
      }),
    });

    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Something went wrong.");
      return;
    }
    router.push("/auth/signin");
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--bg)" }}>
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text)" }}>Enter Code</h1>
        <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
          Check your email for the code, then set a new password.
        </p>

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
          <input
            name="code"
            type="text"
            inputMode="numeric"
            placeholder="6-digit code"
            required
            className="px-4 py-3 rounded text-sm outline-none"
            style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
          />
          <input
            name="password"
            type="password"
            placeholder="New password"
            required
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
            {loading ? "Resetting…" : "Reset Password"}
          </button>
        </form>

        <p className="text-sm mt-6" style={{ color: "var(--text-muted)" }}>
          <Link href="/auth/signin" style={{ color: "var(--gold)" }}>Back to sign in</Link>
        </p>
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
