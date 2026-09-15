/**
 * Tiny fetch wrapper shared by ThreadControls and ReplyControls.
 *
 * Every moderation/editing endpoint returns `{ error: string }` with a
 * non-2xx status on failure, and a JSON body on success. This centralises
 * that parsing so each button handler doesn't repeat it.
 */
export type ApiResult<T = unknown> = { ok: true; data: T } | { ok: false; error: string };

export async function apiRequest<T = unknown>(
  path: string,
  method: "PATCH" | "DELETE" | "POST",
  body?: unknown
): Promise<ApiResult<T>> {
  const res = await fetch(path, {
    method,
    headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  let data: unknown = null;
  try {
    data = await res.json();
  } catch {
    // No body, or not JSON — fall through to the generic error below.
  }

  if (!res.ok) {
    const error =
      data && typeof data === "object" && "error" in data && typeof (data as { error: unknown }).error === "string"
        ? (data as { error: string }).error
        : "Something went wrong.";
    return { ok: false, error };
  }

  return { ok: true, data: data as T };
}
