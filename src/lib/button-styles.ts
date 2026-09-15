/**
 * The two button treatments the site already uses, so every new control
 * matches the existing ones instead of inventing a third.
 *
 *   primary   — solid red, used for the main action of a form (Post Reply,
 *               Save, and destructive actions like Delete and Ban)
 *   secondary — surface-2 fill with the standard border, used for everything
 *               else (Edit, Cancel, Pin, Lock, Approve)
 */
import type { CSSProperties } from "react";

export const primaryButtonClass = "px-6 py-2.5 text-sm font-semibold rounded transition-colors";
export const primaryButtonStyle: CSSProperties = { background: "var(--red)", color: "var(--text)" };

export const secondaryButtonClass = "px-4 py-2 text-xs font-semibold rounded transition-colors";
export const secondaryButtonStyle: CSSProperties = {
  background: "var(--surface-2)",
  border: "1px solid var(--border)",
  color: "var(--text)",
};
