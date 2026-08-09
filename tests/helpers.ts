/**
 * Test helpers.
 *
 * These are integration tests, not unit tests, and that is deliberate. Every
 * real bug this project has had lived between the pieces rather than inside
 * one: NextAuth refusing the Host header in production, /forum rendering
 * signed-out CTAs to signed-in users, a product's front and back images
 * pointing at the same file. Unit tests would have caught none of them.
 *
 * Point them at any running instance:
 *   TEST_BASE_URL=http://localhost:3000 npm test
 *   TEST_BASE_URL=https://lethwei-web-production.up.railway.app npm run test:smoke
 */

// NOT `BASE_URL` — that is a reserved Vite built-in holding the app's base
// public path, and Vitest injects it into process.env as "/". A shell
// `BASE_URL=...` prefix gets clobbered, every URL becomes "//shop", and the
// whole suite fails with an unhelpful Invalid URL.
export function baseUrl(): string {
  const env = (globalThis as { process?: { env?: Record<string, string> } }).process?.env ?? {};
  return env.TEST_BASE_URL || "http://localhost:3000";
}

/** Marks every account this suite creates so cleanup can find them. */
export const TEST_EMAIL_DOMAIN = "lethwei.test";

export function uniqueUser() {
  const n = `${Date.now()}${Math.floor(Math.random() * 1e4)}`;
  return {
    email: `qa+${n}@${TEST_EMAIL_DOMAIN}`,
    username: `qa${n}`.slice(0, 24),
    password: "TestPass123!",
  };
}

/** A cookie jar, because auth is the thing most worth testing here. */
export class Session {
  private cookies = new Map<string, string>();

  private store(res: Response) {
    for (const raw of res.headers.getSetCookie?.() ?? []) {
      const [pair] = raw.split(";");
      const idx = pair.indexOf("=");
      if (idx > 0) this.cookies.set(pair.slice(0, idx).trim(), pair.slice(idx + 1).trim());
    }
  }

  get cookieHeader() {
    return [...this.cookies].map(([k, v]) => `${k}=${v}`).join("; ");
  }

  async fetch(path: string, init: RequestInit = {}) {
    const res = await fetch(`${baseUrl()}${path}`, {
      ...init,
      redirect: "manual",
      headers: {
        ...(init.headers ?? {}),
        ...(this.cookies.size ? { cookie: this.cookieHeader } : {}),
      },
    });
    this.store(res);
    return res;
  }

  json(path: string, body: unknown, init: RequestInit = {}) {
    return this.fetch(path, {
      ...init,
      method: init.method ?? "POST",
      headers: { "content-type": "application/json", ...(init.headers ?? {}) },
      body: JSON.stringify(body),
    });
  }

  async csrfToken() {
    const res = await this.fetch("/api/auth/csrf");
    const { csrfToken } = await res.json();
    return csrfToken as string;
  }

  /** Register + sign in, returning the credentials used. */
  async signUpAndIn() {
    const user = uniqueUser();
    const reg = await this.json("/api/auth/register", user);
    if (reg.status !== 201) throw new Error(`register failed: ${reg.status}`);
    await this.signIn(user.email, user.password);
    return user;
  }

  async signIn(email: string, password: string) {
    const csrfToken = await this.csrfToken();
    return this.fetch("/api/auth/callback/credentials", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ csrfToken, email, password, redirect: "false" }).toString(),
    });
  }

  async currentUser(): Promise<{ email: string; name: string } | null> {
    const res = await this.fetch("/api/auth/session");
    const body = await res.json().catch(() => null);
    return body?.user ?? null;
  }

  text(path: string) {
    return this.fetch(path).then((r) => r.text());
  }
}
