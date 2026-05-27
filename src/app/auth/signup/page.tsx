"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/forum";

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;
    const username = form.get("username") as string;
    const password = form.get("password") as string;

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, username, password }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Registration failed.");
      setLoading(false);
      return;
    }

    await signIn("credentials", { email, password, redirect: false });
    router.push(callbackUrl);
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--bg)" }}>
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text)" }}>Create Account</h1>
        {callbackUrl !== "/forum" && (
          <p className="text-sm mb-2" style={{ color: "var(--gold)" }}>
            Create an account to post your thread.
          </p>
        )}
        <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
          Already have one?{" "}
          <Link href={`/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`} style={{ color: "var(--gold)" }}>Sign in</Link>
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            name="username"
            type="text"
            placeholder="Username"
            required
            className="px-4 py-3 rounded text-sm outline-none"
            style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="px-4 py-3 rounded text-sm outline-none"
            style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            minLength={8}
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
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default function SignUpPage() {
  return (
    <Suspense>
      <SignUpForm />
    </Suspense>
  );
}
