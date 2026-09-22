/**
 * Server-side size limits for user-written text. Pure, unit-tested, and the
 * only place a maximum length is defined so the API and the forms agree.
 */
export const LIMITS = {
  threadTitle: 200,
  threadBody: 20_000,
  replyBody: 20_000,
  categoryName: 60,
  categorySlug: 60,
  categoryDescription: 300,
  categoryIcon: 8,
} as const;

/**
 * Returns the trimmed string when `value` is a non-empty string no longer
 * than `max` characters, otherwise null. Callers treat null as a 400.
 */
export function cleanText(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > max) return null;
  return trimmed;
}

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Lowercase letters, digits and single hyphens, as every seeded slug is. */
export function cleanSlug(value: unknown): string | null {
  const s = cleanText(value, LIMITS.categorySlug);
  return s && SLUG_RE.test(s) ? s : null;
}
