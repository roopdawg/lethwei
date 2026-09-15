"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { secondaryButtonClass, secondaryButtonStyle } from "@/lib/button-styles";

const redButton = "px-4 py-2 text-xs font-semibold rounded transition-colors";

async function post(url: string, body: unknown) {
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

/** Approve or remove a pending gym submission. */
export function PendingGymActions({ gymId }: { gymId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState<"approve" | "remove" | null>(null);
  const [error, setError] = useState("");

  async function approve() {
    setLoading("approve");
    setError("");
    const res = await post(`/api/admin/gyms/${gymId}/approve`, { approved: true });
    setLoading(null);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to approve.");
      return;
    }
    router.refresh();
  }

  async function remove() {
    if (!window.confirm("Remove this gym listing? This cannot be undone.")) return;
    setLoading("remove");
    setError("");
    const res = await fetch(`/api/admin/gyms/${gymId}`, { method: "DELETE" });
    setLoading(null);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to remove.");
      return;
    }
    router.refresh();
  }

  return (
    <div className="flex flex-col items-end gap-1.5">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={approve}
          disabled={loading !== null}
          className={secondaryButtonClass}
          style={secondaryButtonStyle}
        >
          {loading === "approve" ? "Approving…" : "Approve"}
        </button>
        <button
          type="button"
          onClick={remove}
          disabled={loading !== null}
          className={redButton}
          style={{ background: "var(--red)", color: "var(--text)" }}
        >
          {loading === "remove" ? "Removing…" : "Remove"}
        </button>
      </div>
      {error && <p className="text-xs" style={{ color: "var(--red)" }}>{error}</p>}
    </div>
  );
}

/** Revoke approval from an already-approved gym. */
export function RevokeGymAction({ gymId }: { gymId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function revoke() {
    setLoading(true);
    setError("");
    const res = await post(`/api/admin/gyms/${gymId}/approve`, { approved: false });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to revoke.");
      return;
    }
    router.refresh();
  }

  return (
    <div className="flex flex-col items-end gap-1.5">
      <button
        type="button"
        onClick={revoke}
        disabled={loading}
        className={redButton}
        style={{ background: "var(--red)", color: "var(--text)" }}
      >
        {loading ? "Revoking…" : "Revoke"}
      </button>
      {error && <p className="text-xs" style={{ color: "var(--red)" }}>{error}</p>}
    </div>
  );
}
