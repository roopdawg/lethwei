"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ReplyForm({ threadId }: { threadId: string }) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch(`/api/forum/threads/${threadId}/replies`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body }),
    });

    setLoading(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to post reply.");
      return;
    }
    setBody("");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <h3 className="font-[family-name:var(--font-oswald)] text-lg uppercase" style={{ color: "var(--text-muted)" }}>
        Post a Reply
      </h3>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={5}
        required
        placeholder="Write your reply…"
        className="px-4 py-3 rounded text-sm outline-none resize-none"
        style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
      />
      {error && <p className="text-sm" style={{ color: "var(--red)" }}>{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="self-start px-6 py-2.5 text-sm font-semibold rounded transition-colors"
        style={{ background: "var(--red)", color: "var(--text)" }}
      >
        {loading ? "Posting…" : "Post Reply"}
      </button>
    </form>
  );
}
