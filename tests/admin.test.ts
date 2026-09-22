import { describe, it, expect } from "vitest";
import { Session } from "./helpers";
import { db, setRole, userByEmail } from "./db";

const CATEGORY_SLUG = "training";

/** Create a gym through the public submission endpoint and look up its id. */
async function createGym(s: Session, name: string) {
  const res = await s.json("/api/gyms", {
    name,
    city: "Test City",
    state: "TC",
  });
  expect(res.status).toBe(201);
  const gym = await db.gym.findFirstOrThrow({ where: { name } });
  return gym.id;
}

/** Create a thread through the public forum endpoint. */
async function createThread(s: Session, categorySlug: string, title: string) {
  const res = await s.json("/api/forum/threads", {
    title,
    body: "Posted by the admin test suite.",
    categorySlug,
  });
  expect(res.status).toBe(201);
  const { threadId } = await res.json();
  return threadId as string;
}

async function categoryIdBySlug(slug: string) {
  const cat = await db.category.findFirstOrThrow({ where: { slug } });
  return cat.id;
}

async function makeAdmin() {
  const s = new Session();
  const user = await s.signUpAndIn();
  await setRole(user.email, "admin");
  return { s, user };
}

describe("admin authorization: anonymous", () => {
  it("gets 401 on every admin API route", async () => {
    const s = new Session();
    const catId = await categoryIdBySlug(CATEGORY_SLUG);

    const checks: Array<Promise<Response>> = [
      s.json("/api/admin/users/no-such-user/ban", { banned: true }),
      s.json("/api/admin/users/no-such-user/role", { role: "moderator" }),
      s.json("/api/admin/gyms/no-such-gym/approve", { approved: true }),
      s.fetch("/api/admin/gyms/no-such-gym", { method: "DELETE" }),
      s.json("/api/admin/categories", {
        name: "x",
        slug: `qa-anon-${Date.now()}`,
        description: "y",
      }),
      s.json(`/api/admin/categories/${catId}`, { name: "x" }, { method: "PATCH" }),
      s.fetch(`/api/admin/categories/${catId}`, { method: "DELETE" }),
    ];

    for (const check of checks) {
      const res = await check;
      expect(res.status).toBe(401);
    }
  });

  it("404s /admin", async () => {
    const res = await new Session().fetch("/admin");
    expect(res.status).toBe(404);
  });
});

describe("admin authorization: member", () => {
  it("gets 403 on every admin API route", async () => {
    const s = new Session();
    const user = await s.signUpAndIn();
    const me = await userByEmail(user.email);
    const gymId = await createGym(s, `qa-gym member ${Date.now()}`);
    const catId = await categoryIdBySlug(CATEGORY_SLUG);

    expect((await s.json(`/api/admin/users/${me.id}/ban`, { banned: true })).status).toBe(403);
    expect(
      (await s.json(`/api/admin/users/${me.id}/role`, { role: "moderator" })).status
    ).toBe(403);
    expect(
      (await s.json(`/api/admin/gyms/${gymId}/approve`, { approved: true })).status
    ).toBe(403);
    expect((await s.fetch(`/api/admin/gyms/${gymId}`, { method: "DELETE" })).status).toBe(403);
    expect(
      (
        await s.json("/api/admin/categories", {
          name: "x",
          slug: `qa-member-${Date.now()}`,
          description: "y",
        })
      ).status
    ).toBe(403);
    expect(
      (await s.json(`/api/admin/categories/${catId}`, { name: "x" }, { method: "PATCH" })).status
    ).toBe(403);
    expect((await s.fetch(`/api/admin/categories/${catId}`, { method: "DELETE" })).status).toBe(
      403
    );
  });

  it("404s /admin", async () => {
    const s = new Session();
    await s.signUpAndIn();
    const res = await s.fetch("/admin");
    expect(res.status).toBe(404);
  });
});

describe("admin authorization: moderator", () => {
  it("can approve and revoke a gym", async () => {
    const s = new Session();
    const user = await s.signUpAndIn();
    await setRole(user.email, "moderator");

    const gymId = await createGym(s, `qa-gym mod ${Date.now()}`);

    const approve = await s.json(`/api/admin/gyms/${gymId}/approve`, { approved: true });
    expect(approve.status).toBe(200);
    expect((await approve.json()).approved).toBe(true);

    const revoke = await s.json(`/api/admin/gyms/${gymId}/approve`, { approved: false });
    expect(revoke.status).toBe(200);
    expect((await revoke.json()).approved).toBe(false);
  });

  it("gets 403 on ban, role, and category routes", async () => {
    const s = new Session();
    const user = await s.signUpAndIn();
    await setRole(user.email, "moderator");
    const me = await userByEmail(user.email);
    const catId = await categoryIdBySlug(CATEGORY_SLUG);

    expect((await s.json(`/api/admin/users/${me.id}/ban`, { banned: true })).status).toBe(403);
    expect((await s.json(`/api/admin/users/${me.id}/role`, { role: "admin" })).status).toBe(403);
    expect(
      (
        await s.json("/api/admin/categories", {
          name: "x",
          slug: `qa-mod-${Date.now()}`,
          description: "y",
        })
      ).status
    ).toBe(403);
    expect(
      (await s.json(`/api/admin/categories/${catId}`, { name: "x" }, { method: "PATCH" })).status
    ).toBe(403);
    expect((await s.fetch(`/api/admin/categories/${catId}`, { method: "DELETE" })).status).toBe(
      403
    );
  });

  it("sees Gym submissions but not Users on /admin", async () => {
    const s = new Session();
    const user = await s.signUpAndIn();
    await setRole(user.email, "moderator");

    const res = await s.fetch("/admin");
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain("Gym submissions");
    expect(html).not.toContain("Users");
  });
});

describe("admin authorization: admin", () => {
  it("can ban a member", async () => {
    const { s: admin } = await makeAdmin();

    const memberSession = new Session();
    const memberUser = await memberSession.signUpAndIn();
    const member = await userByEmail(memberUser.email);

    const res = await admin.json(`/api/admin/users/${member.id}/ban`, { banned: true });
    expect(res.status).toBe(200);
    expect((await res.json()).banned).toBe(true);

    const updated = await userByEmail(memberUser.email);
    expect(updated.banned).toBe(true);
  });

  it("cannot ban another admin", async () => {
    const { s: admin } = await makeAdmin();
    const { user: admin2User } = await makeAdmin();
    const admin2 = await userByEmail(admin2User.email);

    const res = await admin.json(`/api/admin/users/${admin2.id}/ban`, { banned: true });
    expect(res.status).toBe(403);
  });

  it("cannot ban self", async () => {
    const { s: admin, user: adminUser } = await makeAdmin();
    const self = await userByEmail(adminUser.email);

    const res = await admin.json(`/api/admin/users/${self.id}/ban`, { banned: true });
    expect(res.status).toBe(403);
  });

  it("can change a member's role and cannot change own role", async () => {
    const { s: admin, user: adminUser } = await makeAdmin();
    const self = await userByEmail(adminUser.email);

    const memberSession = new Session();
    const memberUser = await memberSession.signUpAndIn();
    const member = await userByEmail(memberUser.email);

    const res = await admin.json(`/api/admin/users/${member.id}/role`, { role: "moderator" });
    expect(res.status).toBe(200);
    expect((await res.json()).role).toBe("moderator");
    const updated = await userByEmail(memberUser.email);
    expect(updated.role).toBe("moderator");

    const selfRes = await admin.json(`/api/admin/users/${self.id}/role`, { role: "member" });
    expect(selfRes.status).toBe(403);
  });
});

describe("admin categories", () => {
  it("creates, edits, and deletes a category", async () => {
    const { s: admin } = await makeAdmin();

    const slug = `qa-cat-${Date.now()}`;
    const create = await admin.json("/api/admin/categories", {
      name: "QA Category",
      slug,
      description: "Created by the automated suite.",
    });
    expect(create.status).toBe(201);
    const { id } = await create.json();
    expect(id).toBeTruthy();

    const patch = await admin.json(
      `/api/admin/categories/${id}`,
      { name: "QA Category Updated" },
      { method: "PATCH" }
    );
    expect(patch.status).toBe(200);
    const patched = await db.category.findUniqueOrThrow({ where: { id } });
    expect(patched.name).toBe("QA Category Updated");

    const del = await admin.fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    expect(del.status).toBe(200);
    const gone = await db.category.findUnique({ where: { id } });
    expect(gone).toBeNull();
  });

  it("refuses a duplicate slug", async () => {
    const { s: admin } = await makeAdmin();

    const res = await admin.json("/api/admin/categories", {
      name: "Duplicate",
      slug: CATEGORY_SLUG,
      description: "Should collide.",
    });
    expect(res.status).toBe(409);
  });

  it("refuses to delete a category that has threads", async () => {
    const { s: admin } = await makeAdmin();

    const slug = `qa-thread-cat-${Date.now()}`;
    const create = await admin.json("/api/admin/categories", {
      name: "QA Thread Category",
      slug,
      description: "Has a thread.",
    });
    const { id } = await create.json();

    const threadAuthor = new Session();
    await threadAuthor.signUpAndIn();
    await createThread(threadAuthor, slug, "keeps the category alive");

    const del = await admin.fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    expect(del.status).toBe(409);
    expect((await del.json()).error).toBe("Category has threads");
  });
});

describe("gym visibility", () => {
  it("shows approved gyms and hides pending ones on /gyms", async () => {
    const { s: admin } = await makeAdmin();

    const stamp = Date.now();
    const approvedName = `qa-gym approved ${stamp}`;
    const pendingName = `qa-gym pending ${stamp}`;

    const approvedId = await createGym(admin, approvedName);
    await createGym(admin, pendingName);

    const approveRes = await admin.json(`/api/admin/gyms/${approvedId}/approve`, {
      approved: true,
    });
    expect(approveRes.status).toBe(200);

    const html = await admin.text("/gyms");
    expect(html).toContain(approvedName);
    expect(html).not.toContain(pendingName);
  });
});
