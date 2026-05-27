"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

const CATEGORIES = [
  { slug: "training", name: "Training" },
  { slug: "technique", name: "Technique" },
  { slug: "events", name: "Events & Fights" },
  { slug: "general", name: "General Discussion" },
  { slug: "find-training", name: "Find Training Partners" },
  { slug: "beginners", name: "New to Lethwei" },
];

function NewThreadForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultCategory = searchParams.get("category") || "";

  const [title, setTitle] = useState(searchParams.get("title") || "");
  const [body, setBody] = useState(searchParams.get("body") || "");
  const [categorySlug, setCategorySlug] = useState(defaultCategory);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/forum/threads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, body, categorySlug }),
    });

    setLoading(false);
    if (res.status === 401) {
      // Not signed in — send them to signup, preserve their draft in URL
      const params = new URLSearchParams({
        callbackUrl: `/forum/new-thread?category=${categorySlug}&title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`,
      });
      router.push(`/auth/signup?${params}`);
      return;
    }
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to post thread.");
      return;
    }
    const { threadId } = await res.json();
    router.push(`/forum/${categorySlug}/${threadId}`);
  }

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-24">
      <Link href="/forum" className="text-sm mb-6 inline-block" style={{ color: "var(--text-muted)" }}>
        ← Forum
      </Link>
      <h1 className="font-[family-name:var(--font-oswald)] text-4xl uppercase mb-8" style={{ color: "var(--text)" }}>
        New Thread
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold" style={{ color: "var(--text-muted)" }}>Category</label>
          <select
            value={categorySlug}
            onChange={(e) => setCategorySlug(e.target.value)}
            required
            className="px-4 py-3 rounded text-sm outline-none"
            style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
          >
            <option value="">Select a category…</option>
            {CATEGORIES.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold" style={{ color: "var(--text-muted)" }}>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={200}
            placeholder="What's your thread about?"
            className="px-4 py-3 rounded text-sm outline-none"
            style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold" style={{ color: "var(--text-muted)" }}>Body</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            rows={8}
            placeholder="Write your post…"
            className="px-4 py-3 rounded text-sm outline-none resize-none"
            style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
          />
        </div>

        {error && <p className="text-sm" style={{ color: "var(--red)" }}>{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="self-start px-8 py-3 font-semibold text-sm rounded transition-colors"
          style={{ background: "var(--red)", color: "var(--text)" }}
        >
          {loading ? "Posting…" : "Post Thread"}
        </button>
      </form>
    </main>
  );
}

export default function NewThreadPage() {
  return (
    <Suspense>
      <NewThreadForm />
    </Suspense>
  );
}
