"use client";

import { useState } from "react";
import Link from "next/link";

export default function SubmitGymPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/gyms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        city: form.get("city"),
        state: form.get("state"),
        country: form.get("country"),
        website: form.get("website"),
        instagram: form.get("instagram"),
        description: form.get("description"),
      }),
    });

    setLoading(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Submission failed.");
      return;
    }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--bg)" }}>
        <div className="text-center max-w-md">
          <p className="text-4xl mb-4">🥊</p>
          <h1 className="font-[family-name:var(--font-oswald)] text-3xl uppercase mb-3" style={{ color: "var(--text)" }}>
            Submission Received
          </h1>
          <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
            We'll review and approve your gym listing. Thanks for growing the network.
          </p>
          <Link href="/gyms" style={{ color: "var(--gold)" }} className="text-sm">← Back to Gyms</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-xl mx-auto px-4 sm:px-6 py-24">
      <Link href="/gyms" className="text-sm mb-6 inline-block" style={{ color: "var(--text-muted)" }}>
        ← Gyms
      </Link>
      <h1 className="font-[family-name:var(--font-oswald)] text-4xl uppercase mb-2" style={{ color: "var(--text)" }}>
        Submit a Gym
      </h1>
      <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
        Know a gym that trains Lethwei? Add it to the directory. All submissions are reviewed before listing.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {[
          { name: "name", label: "Gym Name", required: true, placeholder: "e.g. Iron Skull Gym" },
          { name: "city", label: "City", required: true, placeholder: "e.g. Los Angeles" },
          { name: "state", label: "State / Province", required: true, placeholder: "e.g. CA" },
          { name: "country", label: "Country", required: false, placeholder: "USA" },
          { name: "website", label: "Website", required: false, placeholder: "https://…" },
          { name: "instagram", label: "Instagram", required: false, placeholder: "@gymhandle" },
        ].map((field) => (
          <div key={field.name} className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold" style={{ color: "var(--text-muted)" }}>
              {field.label} {field.required && <span style={{ color: "var(--red)" }}>*</span>}
            </label>
            <input
              name={field.name}
              required={field.required}
              placeholder={field.placeholder}
              className="px-4 py-3 rounded text-sm outline-none"
              style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
            />
          </div>
        ))}

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold" style={{ color: "var(--text-muted)" }}>Description</label>
          <textarea
            name="description"
            rows={4}
            placeholder="Tell us about the gym — classes, coaches, style…"
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
          {loading ? "Submitting…" : "Submit Gym"}
        </button>
      </form>
    </main>
  );
}
