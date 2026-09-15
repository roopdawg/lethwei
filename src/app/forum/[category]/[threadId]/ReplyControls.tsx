"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "./api";

type Props = {
  replyId: string;
  authorUsername: string;
  createdAtLabel: string;
  body: string;
  edited: boolean;
  canEdit: boolean;
  canDelete: boolean;
};

const primaryButton = "px-6 py-2.5 text-sm font-semibold rounded transition-colors";
const secondaryButton = "px-4 py-2 text-xs font-semibold rounded transition-colors";

export default function ReplyControls({
  replyId,
  authorUsername,
  createdAtLabel,
  body,
  edited,
  canEdit,
  canDelete,
}: Props) {
  const router = useRouter();

  const [editing, setEditing] = useState(false);
  const [editBody, setEditBody] = useState(body);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const [deleting, setDeleting] = useState(false);
  const [actionError, setActionError] = useState("");

  function startEdit() {
    setEditBody(body);
    setSaveError("");
    setEditing(true);
  }

  function cancelEdit() {
    setEditBody(body);
    setSaveError("");
    setEditing(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaveError("");

    const result = await apiRequest(`/api/forum/replies/${replyId}`, "PATCH", {
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
    if (!window.confirm("Delete this reply? This cannot be undone.")) return;
    setDeleting(true);
    setActionError("");

    const result = await apiRequest(`/api/forum/replies/${replyId}`, "DELETE");

    setDeleting(false);
    if (!result.ok) {
      setActionError(result.error);
      return;
    }
    router.refresh();
  }

  const hasControls = canEdit || canDelete;

  return (
    <div className="p-4 rounded" style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}>
      <p className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>
        {authorUsername} · {createdAtLabel}
        {edited && <span data-testid="reply-edited"> · edited</span>}
      </p>

      {editing ? (
        <form onSubmit={handleSave} data-testid="reply-edit-form" className="flex flex-col gap-3">
          <textarea
            value={editBody}
            onChange={(e) => setEditBody(e.target.value)}
            required
            rows={5}
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
              style={{ background: "var(--surface)", color: "var(--text-muted)", border: "1px solid var(--border)" }}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "var(--text)" }}>
          {body}
        </p>
      )}

      {hasControls && !editing && (
        <div className="flex flex-wrap gap-2 pt-3 mt-3" style={{ borderTop: "1px solid var(--border)" }}>
          {canEdit && (
            <button
              type="button"
              data-testid="reply-edit-button"
              onClick={startEdit}
              className={secondaryButton}
              style={{ background: "var(--surface)", color: "var(--text)", border: "1px solid var(--border)" }}
            >
              Edit
            </button>
          )}
          {canDelete && (
            <button
              type="button"
              data-testid="reply-delete-button"
              onClick={handleDelete}
              disabled={deleting}
              className={secondaryButton}
              style={{ background: "var(--red)", color: "var(--text)" }}
            >
              {deleting ? "Deleting…" : "Delete"}
            </button>
          )}
        </div>
      )}
      {actionError && (
        <p data-testid="reply-action-error" className="text-sm mt-2" style={{ color: "var(--red)" }}>
          {actionError}
        </p>
      )}
    </div>
  );
}
