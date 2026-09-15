"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const inputStyle = {
  background: "var(--surface)",
  border: "1px solid var(--border)",
  color: "var(--text)",
};

export function AddCategoryForm() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", slug: "", description: "", icon: "", order: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        slug: form.slug,
        description: form.description,
        ...(form.icon ? { icon: form.icon } : {}),
        ...(form.order ? { order: Number(form.order) } : {}),
      }),
    });

    setLoading(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to create category.");
      return;
    }
    setForm({ name: "", slug: "", description: "", icon: "", order: "" });
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
      <h3 className="text-sm font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
        Add Category
      </h3>
      <div className="flex flex-wrap gap-2">
        <input
          value={form.icon}
          onChange={(e) => setForm({ ...form, icon: e.target.value })}
          placeholder="💬"
          className="w-16 px-2 py-2 rounded text-sm outline-none text-center"
          style={inputStyle}
        />
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Name"
          required
          className="flex-1 min-w-[10rem] px-3 py-2 rounded text-sm outline-none"
          style={inputStyle}
        />
        <input
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
          placeholder="slug"
          required
          className="flex-1 min-w-[8rem] px-3 py-2 rounded text-sm outline-none"
          style={inputStyle}
        />
        <input
          value={form.order}
          onChange={(e) => setForm({ ...form, order: e.target.value })}
          placeholder="Order"
          type="number"
          className="w-20 px-3 py-2 rounded text-sm outline-none"
          style={inputStyle}
        />
      </div>
      <textarea
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        placeholder="Description"
        required
        rows={2}
        className="px-3 py-2 rounded text-sm outline-none resize-none"
        style={inputStyle}
      />
      {error && <p className="text-sm" style={{ color: "var(--red)" }}>{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="self-start px-6 py-2.5 text-sm font-semibold rounded transition-colors"
        style={{ background: "var(--red)", color: "var(--text)" }}
      >
        {loading ? "Adding…" : "Add Category"}
      </button>
    </form>
  );
}
