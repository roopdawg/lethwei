"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { secondaryButtonClass, secondaryButtonStyle } from "@/lib/button-styles";

const inputStyle = {
  background: "var(--surface-2)",
  border: "1px solid var(--border)",
  color: "var(--text)",
};

export function CategoryRow({
  id,
  name,
  slug,
  description,
  icon,
  order,
}: {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  order: number;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name, description, icon, order: String(order) });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function save() {
    setPending(true);
    setError("");
    const res = await fetch(`/api/admin/categories/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        description: form.description,
        icon: form.icon,
        order: Number(form.order),
      }),
    });
    setPending(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to save.");
      return;
    }
    setEditing(false);
    router.refresh();
  }

  async function remove() {
    if (!window.confirm("Delete this category? This cannot be undone.")) return;
    setPending(true);
    setError("");
    const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    setPending(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to delete.");
      return;
    }
    router.refresh();
  }

  if (editing) {
    return (
      <div className="flex flex-col gap-2 p-4" style={{ background: "var(--surface)" }}>
        <div className="flex flex-wrap gap-2">
          <input
            value={form.icon}
            onChange={(e) => setForm({ ...form, icon: e.target.value })}
            className="w-16 px-2 py-2 rounded text-sm outline-none text-center"
            style={inputStyle}
          />
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="flex-1 min-w-[10rem] px-3 py-2 rounded text-sm outline-none"
            style={inputStyle}
          />
          <input
            value={form.order}
            onChange={(e) => setForm({ ...form, order: e.target.value })}
            type="number"
            className="w-20 px-3 py-2 rounded text-sm outline-none"
            style={inputStyle}
          />
        </div>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={2}
          className="px-3 py-2 rounded text-sm outline-none resize-none"
          style={inputStyle}
        />
        {error && <p className="text-xs" style={{ color: "var(--red)" }}>{error}</p>}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={save}
            disabled={pending}
            className={secondaryButtonClass}
            style={secondaryButtonStyle}
          >
            {pending ? "Saving…" : "Save"}
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            disabled={pending}
            className="px-4 py-2 text-xs font-semibold rounded transition-colors"
            style={{ background: "var(--surface-2)", color: "var(--text-muted)" }}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 p-4" style={{ background: "var(--surface)" }}>
      <span className="text-2xl">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>{name}</p>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>{description}</p>
        <p className="text-xs" style={{ color: "var(--text-dim)" }}>/{slug} · order {order}</p>
        {error && <p className="text-xs mt-1" style={{ color: "var(--red)" }}>{error}</p>}
      </div>
      <button
        type="button"
        onClick={() => setEditing(true)}
        className={secondaryButtonClass}
        style={secondaryButtonStyle}
      >
        Edit
      </button>
      <button
        type="button"
        onClick={remove}
        disabled={pending}
        className="px-4 py-2 text-xs font-semibold rounded transition-colors"
        style={{ background: "var(--red)", color: "var(--text)" }}
      >
        {pending ? "Deleting…" : "Delete"}
      </button>
    </div>
  );
}
