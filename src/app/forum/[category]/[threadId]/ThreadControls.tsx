"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "./api";

type Props = {
  threadId: string;
  categorySlug: string;
  title: string;
  body: string;
  authorUsername: string;
  createdAtLabel: string;
  locked: boolean;
  pinned: boolean;
  edited: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canPin: boolean;
  canLock: boolean;
};

const primaryButton =
  "px-6 py-2.5 text-sm font-semibold rounded transition-colors";
const secondaryButton =
  "px-4 py-2 text-xs font-semibold rounded transition-colors";

export default function ThreadControls({
  threadId,
  categorySlug,
  title,
  body,
  authorUsername,
  createdAtLabel,
  locked,
  pinned,
  edited,
  canEdit,
  canDelete,
  canPin,
  canLock,
}: Props) {
  const router = useRouter();

  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editBody, setEditBody] = useState(body);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const [deleting, setDeleting] = useState(false);
  const [pinning, setPinning] = useState(false);
  const [locking, setLocking] = useState(false);
  const [actionError, setActionError] = useState("");

  function startEdit() {
    setEditTitle(title);
    setEditBody(body);
    setSaveError("");
    setEditing(true);
  }

  function cancelEdit() {
    setEditTitle(title);
    setEditBody(body);
    setSaveError("");
    setEditing(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaveError("");

    const result = await apiRequest(`/api/forum/threads/${threadId}`, "PATCH", {
      title: editTitle,
      body: editBody,
    });

    setSaving(false);
    if (!result.ok) {
      setSaveError(result.error);
      return;
    }
    setEditing(false);
    router.refresh();
  }

  async function handleDelete() {
    if (!window.confirm("Delete this thread? This cannot be undone.")) return;
    setDeleting(true);
    setActionError("");

    const result = await apiRequest(`/api/forum/threads/${threadId}`, "DELETE");

    setDeleting(false);
    if (!result.ok) {
      setActionError(result.error);
      return;
    }
    router.push(`/forum/${categorySlug}`);
  }

  async function handleTogglePin() {
    setPinning(true);
    setActionError("");

    const result = await apiRequest(`/api/forum/threads/${threadId}/pin`, "POST", {
      pinned: !pinned,
    });

    setPinning(false);
    if (!result.ok) {
      setActionError(result.error);
      return;
    }
    router.refresh();
  }

  async function handleToggleLock() {
    setLocking(true);
    setActionError("");

    const result = await apiRequest(`/api/forum/threads/${threadId}/lock`, "POST", {
      locked: !locked,
    });

    setLocking(false);
    if (!result.ok) {
      setActionError(result.error);
      return;
    }
    router.refresh();
  }

  const hasControls = canEdit || canDelete || canPin || canLock;

  return (
    <>
      <div className="flex items-start gap-3 flex-wrap mb-2">
        <h1
          className="font-[family-name:var(--font-oswald)] text-3xl"
          style={{ color: "var(--text)" }}
        >
          {title}
        </h1>
        {locked && (
          <span
            data-testid="thread-locked-badge"
            className="text-xs px-2 py-0.5 rounded font-semibold mt-2"
            style={{ background: "var(--red)", color: "var(--text)" }}
          >
            Locked
          </span>
        )}
      </div>
      <p className="text-xs mb-6" style={{ color: "var(--text-muted)" }}>
        by {authorUsername} · {createdAtLabel}
        {edited && (
          <span data-testid="thread-edited"> · edited</span>
        )}
      </p>

      {editing ? (
        <form onSubmit={handleSave} data-testid="thread-edit-form" className="flex flex-col gap-3 mb-6">
          <input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            required
            maxLength={200}
            className="px-4 py-3 rounded text-sm outline-none"
            style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
          />
          <textarea
            value={editBody}
            onChange={(e) => setEditBody(e.target.value)}
            required
            rows={8}
            className="px-4 py-3 rounded text-sm outline-none resize-none"
            style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
          />
          {saveError && <p className="text-sm" style={{ color: "var(--red)" }}>{saveError}</p>}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className={primaryButton}
              style={{ background: "var(--red)", color: "var(--text)" }}
            >
              {saving ? "Saving…" : "Save"}
            </button>
            <button
              type="button"
              onClick={cancelEdit}
              className={primaryButton}
              style={{ background: "var(--surface-2)", color: "var(--text-muted)", border: "1px solid var(--border)" }}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="text-sm leading-relaxed whitespace-pre-wrap mb-4" style={{ color: "var(--text)" }}>
          {body}
        </div>
      )}

      {hasControls && !editing && (
        <div className="flex flex-wrap gap-2 pt-4 mt-2" style={{ borderTop: "1px solid var(--border)" }}>
          {canEdit && (
            <button
              type="button"
              data-testid="thread-edit-button"
              onClick={startEdit}
              className={secondaryButton}
              style={{ background: "var(--surface-2)", color: "var(--text)", border: "1px solid var(--border)" }}
            >
              Edit
            </button>
          )}
          {canDelete && (
            <button
              type="button"
              data-testid="thread-delete-button"
              onClick={handleDelete}
              disabled={deleting}
              className={secondaryButton}
              style={{ background: "var(--red)", color: "var(--text)" }}
            >
              {deleting ? "Deleting…" : "Delete"}
            </button>
          )}
          {canPin && (
            <button
              type="button"
              data-testid="thread-pin-button"
              onClick={handleTogglePin}
              disabled={pinning}
              className={secondaryButton}
              style={{ background: "var(--surface-2)", color: "var(--text)", border: "1px solid var(--border)" }}
            >
              {pinning ? "…" : pinned ? "Unpin" : "Pin"}
            </button>
          )}
          {canLock && (
            <button
              type="button"
              data-testid="thread-lock-button"
              onClick={handleToggleLock}
              disabled={locking}
              className={secondaryButton}
              style={{ background: "var(--surface-2)", color: "var(--text)", border: "1px solid var(--border)" }}
            >
              {locking ? "…" : locked ? "Unlock" : "Lock"}
            </button>
          )}
        </div>
      )}
      {actionError && (
        <p data-testid="thread-action-error" className="text-sm mt-2" style={{ color: "var(--red)" }}>
          {actionError}
        </p>
      )}
    </>
  );
}
