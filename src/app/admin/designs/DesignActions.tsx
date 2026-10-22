"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { primaryButtonClass, primaryButtonStyle, secondaryButtonClass, secondaryButtonStyle } from "@/lib/button-styles";

const redButton = "px-4 py-2 text-xs font-semibold rounded transition-colors";

async function post(url: string, body: unknown) {
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export function DesignActions({
  designId,
  batchLabel,
  status,
  productTypes,
  canApprove,
  hasMyVote,
  isTied,
  availableProductTypes,
}: {
  designId: string;
  batchLabel: string;
  status: string;
  productTypes: string[];
  canApprove: boolean;
  hasMyVote: boolean;
  isTied: boolean;
  availableProductTypes: { key: string; label: string }[];
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>(productTypes);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState<"approve" | "reject" | "comment" | "vote" | "tiebreak" | null>(null);
  const [error, setError] = useState("");

  function toggleType(key: string) {
    setSelected((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  }

  async function vote() {
    setLoading("vote");
    setError("");
    const res = await post(`/api/admin/designs/${designId}/vote`, {});
    setLoading(null);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Failed to vote.");
      return;
    }
    router.refresh();
  }

  async function runTiebreak() {
    setLoading("tiebreak");
    setError("");
    const res = await post(`/api/admin/designs/tiebreak`, { batchLabel });
    setLoading(null);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Tiebreak failed.");
      return;
    }
    router.refresh();
  }

  async function approve() {
    setLoading("approve");
    setError("");
    const res = await post(`/api/admin/designs/${designId}/approve`, { productTypes: selected });
    setLoading(null);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Failed to approve.");
      return;
    }
    router.refresh();
  }

  async function reject() {
    setLoading("reject");
    setError("");
    const res = await post(`/api/admin/designs/${designId}/reject`, {});
    setLoading(null);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Failed to reject.");
      return;
    }
    router.refresh();
  }

  async function submitComment() {
    if (!comment.trim()) return;
    setLoading("comment");
    setError("");
    const res = await post(`/api/admin/designs/${designId}/comments`, { body: comment.trim() });
    setLoading(null);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Failed to comment.");
      return;
    }
    setComment("");
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-3">
      {status === "pending" && (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={vote}
            disabled={loading !== null || hasMyVote}
            className={secondaryButtonClass}
            style={hasMyVote ? { ...secondaryButtonStyle, borderColor: "var(--gold)", color: "var(--gold)" } : secondaryButtonStyle}
          >
            {loading === "vote" ? "Voting…" : hasMyVote ? "✓ Your Pick" : "Vote for This One"}
          </button>
          {isTied && canApprove && (
            <button type="button" onClick={runTiebreak} disabled={loading !== null} className={secondaryButtonClass} style={secondaryButtonStyle}>
              {loading === "tiebreak" ? "Asking AI…" : "Run AI Tiebreak"}
            </button>
          )}
        </div>
      )}

      {status === "pending" && canApprove && (
        <div className="flex flex-wrap gap-2">
          {availableProductTypes.map((t) => (
            <label
              key={t.key}
              className="flex items-center gap-1.5 text-xs px-2 py-1 cursor-pointer"
              style={{ border: "1px solid var(--border)", color: "var(--text-muted)" }}
            >
              <input type="checkbox" checked={selected.includes(t.key)} onChange={() => toggleType(t.key)} />
              {t.label}
            </label>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Leave a comment…"
          className="flex-1 px-3 py-2 text-sm outline-none"
          style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)" }}
        />
        <button type="button" onClick={submitComment} disabled={loading !== null} className={secondaryButtonClass} style={secondaryButtonStyle}>
          {loading === "comment" ? "Posting…" : "Comment"}
        </button>
      </div>

      {status === "pending" && canApprove && (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={approve}
            disabled={loading !== null || selected.length === 0}
            className={primaryButtonClass}
            style={primaryButtonStyle}
          >
            {loading === "approve" ? "Approving…" : "Approve & Publish"}
          </button>
          <button type="button" onClick={reject} disabled={loading !== null} className={redButton} style={{ background: "var(--surface-2)", border: "1px solid var(--red)", color: "var(--red)" }}>
            {loading === "reject" ? "Rejecting…" : "Reject"}
          </button>
        </div>
      )}

      {error && <p className="text-xs" style={{ color: "var(--red)" }}>{error}</p>}
    </div>
  );
}
