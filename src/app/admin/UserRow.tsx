"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ROLES, type Role } from "@/lib/permissions";

export function UserRow({
  id,
  username,
  email,
  role,
  banned,
}: {
  id: string;
  username: string;
  email: string;
  role: Role;
  banned: boolean;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function changeRole(newRole: Role) {
    setPending(true);
    setError("");
    const res = await fetch(`/api/admin/users/${id}/role`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });
    setPending(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to change role.");
      return;
    }
    router.refresh();
  }

  async function toggleBanned() {
    setPending(true);
    setError("");
    const res = await fetch(`/api/admin/users/${id}/ban`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ banned: !banned }),
    });
    setPending(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to update ban status.");
      return;
    }
    router.refresh();
  }

  return (
    <div
      className="flex items-center gap-4 p-4"
      style={{ background: "var(--surface)" }}
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate" style={{ color: "var(--text)" }}>
          {username} {banned && <span style={{ color: "var(--red)" }}>· banned</span>}
        </p>
        <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>{email}</p>
        {error && <p className="text-xs mt-1" style={{ color: "var(--red)" }}>{error}</p>}
      </div>
      <select
        value={role}
        disabled={pending}
        onChange={(e) => changeRole(e.target.value as Role)}
        className="px-3 py-2 rounded text-sm outline-none"
        style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)" }}
      >
        {ROLES.map((r) => (
          <option key={r} value={r}>{r}</option>
        ))}
      </select>
      <button
        type="button"
        onClick={toggleBanned}
        disabled={pending}
        className="px-4 py-2 text-xs font-semibold rounded transition-colors"
        style={{ background: "var(--red)", color: "var(--text)" }}
      >
        {banned ? "Unban" : "Ban"}
      </button>
    </div>
  );
}
