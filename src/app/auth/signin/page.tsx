"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignInPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const result = await signIn("credentials", {
      email: form.get("email"),
      password: form.get("password"),
      redirect: false,
    });

    setLoading(false);
    if (result?.error) {
      setError("Invalid email or password.");
    } else {
      router.push("/forum");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--bg)" }}>
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text)" }}>Sign In</h1>
        <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
          New here?{" "}
          <Link href="/auth/signup" style={{ color: "var(--gold)" }}>Create an account</Link>
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </main>
  );
}
