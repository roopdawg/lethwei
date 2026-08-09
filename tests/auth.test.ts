import { describe, it, expect } from "vitest";
import { Session, uniqueUser } from "./helpers";

describe("registration", () => {
  it("creates an account", async () => {
    const s = new Session();
    const res = await s.json("/api/auth/register", uniqueUser());
    expect(res.status).toBe(201);
  });

  it("rejects a duplicate email", async () => {
    const s = new Session();
    const user = uniqueUser();
    expect((await s.json("/api/auth/register", user)).status).toBe(201);
    const dup = await s.json("/api/auth/register", { ...user, username: `${user.username}b` });
    expect(dup.status).toBe(409);
  });

  it("rejects a duplicate username", async () => {
    const s = new Session();
    const user = uniqueUser();
    expect((await s.json("/api/auth/register", user)).status).toBe(201);
    const dup = await s.json("/api/auth/register", { ...user, email: `x${user.email}` });
    expect(dup.status).toBe(409);
  });

  // Regression: "1" was accepted as a password in production.
  it("rejects a password shorter than 8 characters", async () => {
    const s = new Session();
    const res = await s.json("/api/auth/register", { ...uniqueUser(), password: "1" });
    expect(res.status).toBe(400);
  });

  it("rejects a malformed email", async () => {
    const s = new Session();
    const res = await s.json("/api/auth/register", { ...uniqueUser(), email: "not-an-email" });
    expect(res.status).toBe(400);
  });

  it("rejects missing fields", async () => {
    const s = new Session();
    const res = await s.json("/api/auth/register", { email: "a@b.co" });
    expect(res.status).toBe(400);
  });
});

describe("sign in", () => {
  // Regression: NextAuth needs trustHost:true off Vercel. Without it this
  // endpoint returns no token and every sign-in 500s, while registration
  // keeps returning 201 — which is exactly why it went unnoticed.
  it("issues a CSRF token", async () => {
    const s = new Session();
    const res = await s.fetch("/api/auth/csrf");
    expect(res.status).toBe(200);
    expect((await res.json()).csrfToken).toBeTruthy();
  });

  it("creates a session with the right password", async () => {
    const s = new Session();
    const user = await s.signUpAndIn();
    expect((await s.currentUser())?.email).toBe(user.email);
  });

  it("creates no session with the wrong password", async () => {
    const s = new Session();
    const user = uniqueUser();
    await s.json("/api/auth/register", user);
    await s.signIn(user.email, "definitely-not-it");
    expect(await s.currentUser()).toBeNull();
  });

  it("creates no session for an unknown account", async () => {
    const s = new Session();
    await s.signIn(`ghost+${Date.now()}@lethwei.test`, "TestPass123!");
    expect(await s.currentUser()).toBeNull();
  });

  it("has no session before signing in", async () => {
    expect(await new Session().currentUser()).toBeNull();
  });
});
