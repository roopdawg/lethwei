import { describe, it, expect } from "vitest";
import { Session } from "./helpers";
import { setBanned, setRole, userByEmail } from "./db";

const CATEGORY = "training";

async function postThread(s: Session, title = `mod thread ${Date.now()}${Math.random()}`) {
  const res = await s.json("/api/forum/threads", {
    title,
    body: "Posted by the moderation suite.",
    categorySlug: CATEGORY,
  });
  if (!res.ok) throw new Error(`thread create failed: ${res.status}`);
  const { threadId } = await res.json();
  return threadId as string;
}

async function postReply(s: Session, threadId: string, body = "a reply") {
  const res = await s.json(`/api/forum/threads/${threadId}/replies`, { body });
  if (!res.ok) throw new Error(`reply create failed: ${res.status}`);
  const { replyId } = await res.json();
  return replyId as string;
}

async function moderatorSession() {
  const s = new Session();
  const user = await s.signUpAndIn();
  await setRole(user.email, "moderator");
  return { s, user };
}

describe("moderation: anonymous access", () => {
  it("401s every new route for a signed-out visitor", async () => {
    const author = new Session();
    await author.signUpAndIn();
    const threadId = await postThread(author);
    const replyId = await postReply(author, threadId);

    const anon = new Session();
    expect((await anon.json(`/api/forum/threads/${threadId}`, { title: "x" }, { method: "PATCH" })).status).toBe(401);
    expect((await anon.fetch(`/api/forum/threads/${threadId}`, { method: "DELETE" })).status).toBe(401);
    expect((await anon.json(`/api/forum/threads/${threadId}/pin`, { pinned: true })).status).toBe(401);
    expect((await anon.json(`/api/forum/threads/${threadId}/lock`, { locked: true })).status).toBe(401);
    expect((await anon.json(`/api/forum/replies/${replyId}`, { body: "x" }, { method: "PATCH" })).status).toBe(401);
    expect((await anon.fetch(`/api/forum/replies/${replyId}`, { method: "DELETE" })).status).toBe(401);
  });
});

describe("moderation: author rights on their own thread", () => {
  it("lets the author edit their own thread", async () => {
    const author = new Session();
    await author.signUpAndIn();
    const threadId = await postThread(author);

    const res = await author.json(`/api/forum/threads/${threadId}`, { title: "edited title" }, { method: "PATCH" });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });

  it("lets the author delete their own thread", async () => {
    const author = new Session();
    await author.signUpAndIn();
    const threadId = await postThread(author);

    const res = await author.fetch(`/api/forum/threads/${threadId}`, { method: "DELETE" });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });

    // gone for good
    const followUp = await author.json(`/api/forum/threads/${threadId}`, { title: "x" }, { method: "PATCH" });
    expect(followUp.status).toBe(404);
  });

  it("refuses another member editing or deleting the thread", async () => {
    const author = new Session();
    await author.signUpAndIn();
    const threadId = await postThread(author);

    const other = new Session();
    await other.signUpAndIn();

    const editRes = await other.json(`/api/forum/threads/${threadId}`, { title: "hijack" }, { method: "PATCH" });
    expect(editRes.status).toBe(403);

    const deleteRes = await other.fetch(`/api/forum/threads/${threadId}`, { method: "DELETE" });
    expect(deleteRes.status).toBe(403);
  });
});

describe("moderation: author rights on their own reply", () => {
  it("lets the author edit and delete their own reply", async () => {
    const author = new Session();
    await author.signUpAndIn();
    const threadId = await postThread(author);
    const replyId = await postReply(author, threadId);

    const editRes = await author.json(`/api/forum/replies/${replyId}`, { body: "edited reply" }, { method: "PATCH" });
    expect(editRes.status).toBe(200);
    expect(await editRes.json()).toEqual({ ok: true });

    const deleteRes = await author.fetch(`/api/forum/replies/${replyId}`, { method: "DELETE" });
    expect(deleteRes.status).toBe(200);
    expect(await deleteRes.json()).toEqual({ ok: true });
  });

  it("refuses another member editing or deleting the reply", async () => {
    const author = new Session();
    await author.signUpAndIn();
    const threadId = await postThread(author);
    const replyId = await postReply(author, threadId);

    const other = new Session();
    await other.signUpAndIn();

    const editRes = await other.json(`/api/forum/replies/${replyId}`, { body: "hijack" }, { method: "PATCH" });
    expect(editRes.status).toBe(403);

    const deleteRes = await other.fetch(`/api/forum/replies/${replyId}`, { method: "DELETE" });
    expect(deleteRes.status).toBe(403);
  });
});

describe("moderation: moderator overrides", () => {
  it("lets a moderator edit and delete someone else's thread", async () => {
    const author = new Session();
    await author.signUpAndIn();
    const threadId = await postThread(author);

    const { s: mod } = await moderatorSession();

    const editRes = await mod.json(`/api/forum/threads/${threadId}`, { body: "moderator edit" }, { method: "PATCH" });
    expect(editRes.status).toBe(200);

    const deleteRes = await mod.fetch(`/api/forum/threads/${threadId}`, { method: "DELETE" });
    expect(deleteRes.status).toBe(200);
  });

  it("lets a moderator edit and delete someone else's reply", async () => {
    const author = new Session();
    await author.signUpAndIn();
    const threadId = await postThread(author);
    const replyId = await postReply(author, threadId);

    const { s: mod } = await moderatorSession();

    const editRes = await mod.json(`/api/forum/replies/${replyId}`, { body: "moderator edit" }, { method: "PATCH" });
    expect(editRes.status).toBe(200);

    const deleteRes = await mod.fetch(`/api/forum/replies/${replyId}`, { method: "DELETE" });
    expect(deleteRes.status).toBe(200);
  });
});

describe("moderation: banned users", () => {
  it("refuses a banned user starting a new thread", async () => {
    const s = new Session();
    const user = await s.signUpAndIn();
    await setBanned(user.email, true);

    const res = await s.json("/api/forum/threads", {
      title: "banned thread",
      body: "should not post",
      categorySlug: CATEGORY,
    });
    expect(res.status).toBe(403);
    expect(await res.json()).toEqual({ error: "Banned" });
  });

  it("refuses a banned user replying", async () => {
    const author = new Session();
    await author.signUpAndIn();
    const threadId = await postThread(author);

    const s = new Session();
    const user = await s.signUpAndIn();
    await setBanned(user.email, true);

    const res = await s.json(`/api/forum/threads/${threadId}/replies`, { body: "banned reply" });
    expect(res.status).toBe(403);
    expect(await res.json()).toEqual({ error: "Banned" });
  });

  it("refuses a banned user editing their own (previously posted) thread", async () => {
    const s = new Session();
    const user = await s.signUpAndIn();
    const threadId = await postThread(s);

    await setBanned(user.email, true);

    const res = await s.json(`/api/forum/threads/${threadId}`, { title: "edit while banned" }, { method: "PATCH" });
    expect(res.status).toBe(403);
  });
});

describe("moderation: locked threads", () => {
  it("refuses a member reply on a locked thread and allows a moderator reply", async () => {
    const author = new Session();
    await author.signUpAndIn();
    const threadId = await postThread(author);

    const { s: mod } = await moderatorSession();
    const lockRes = await mod.json(`/api/forum/threads/${threadId}/lock`, { locked: true });
    expect(lockRes.status).toBe(200);
    expect(await lockRes.json()).toEqual({ locked: true });

    const other = new Session();
    await other.signUpAndIn();
    const memberReply = await other.json(`/api/forum/threads/${threadId}/replies`, { body: "nope" });
    expect(memberReply.status).toBe(403);
    expect(await memberReply.json()).toEqual({ error: "Thread locked" });

    const modReply = await mod.json(`/api/forum/threads/${threadId}/replies`, { body: "staff can still reply" });
    expect(modReply.status).toBe(201);
  });

  it("refuses the author editing a locked thread but still allows a moderator", async () => {
    const author = new Session();
    await author.signUpAndIn();
    const threadId = await postThread(author);

    const { s: mod } = await moderatorSession();
    await mod.json(`/api/forum/threads/${threadId}/lock`, { locked: true });

    const authorEdit = await author.json(`/api/forum/threads/${threadId}`, { title: "locked edit" }, { method: "PATCH" });
    expect(authorEdit.status).toBe(403);

    const modEdit = await mod.json(`/api/forum/threads/${threadId}`, { title: "mod locked edit" }, { method: "PATCH" });
    expect(modEdit.status).toBe(200);
  });
});

describe("moderation: pin and lock permissions", () => {
  it("refuses a member pinning or locking a thread", async () => {
    const author = new Session();
    await author.signUpAndIn();
    const threadId = await postThread(author);

    const pinRes = await author.json(`/api/forum/threads/${threadId}/pin`, { pinned: true });
    expect(pinRes.status).toBe(403);

    const lockRes = await author.json(`/api/forum/threads/${threadId}/lock`, { locked: true });
    expect(lockRes.status).toBe(403);
  });

  it("lets a moderator pin and lock a thread", async () => {
    const author = new Session();
    await author.signUpAndIn();
    const threadId = await postThread(author);

    const { s: mod } = await moderatorSession();

    const pinRes = await mod.json(`/api/forum/threads/${threadId}/pin`, { pinned: true });
    expect(pinRes.status).toBe(200);
    expect(await pinRes.json()).toEqual({ pinned: true });

    const lockRes = await mod.json(`/api/forum/threads/${threadId}/lock`, { locked: true });
    expect(lockRes.status).toBe(200);
    expect(await lockRes.json()).toEqual({ locked: true });
  });
});

describe("moderation: unknown ids", () => {
  it("404s PATCH and DELETE on an unknown thread", async () => {
    const { s: mod } = await moderatorSession();
    expect((await mod.json("/api/forum/threads/does-not-exist", { title: "x" }, { method: "PATCH" })).status).toBe(404);
    expect((await mod.fetch("/api/forum/threads/does-not-exist", { method: "DELETE" })).status).toBe(404);
    expect((await mod.json("/api/forum/threads/does-not-exist/pin", { pinned: true })).status).toBe(404);
    expect((await mod.json("/api/forum/threads/does-not-exist/lock", { locked: true })).status).toBe(404);
  });

  it("404s PATCH and DELETE on an unknown reply", async () => {
    const { s: mod } = await moderatorSession();
    expect((await mod.json("/api/forum/replies/does-not-exist", { body: "x" }, { method: "PATCH" })).status).toBe(404);
    expect((await mod.fetch("/api/forum/replies/does-not-exist", { method: "DELETE" })).status).toBe(404);
  });
});

describe("moderation: bad bodies", () => {
  it("400s a thread edit with neither field set", async () => {
    const author = new Session();
    await author.signUpAndIn();
    const threadId = await postThread(author);

    const res = await author.json(`/api/forum/threads/${threadId}`, {}, { method: "PATCH" });
    expect(res.status).toBe(400);
  });

  it("400s a thread edit with only whitespace fields", async () => {
    const author = new Session();
    await author.signUpAndIn();
    const threadId = await postThread(author);

    const res = await author.json(`/api/forum/threads/${threadId}`, { title: "   ", body: "" }, { method: "PATCH" });
    expect(res.status).toBe(400);
  });

  it("400s a reply edit with an empty body", async () => {
    const author = new Session();
    await author.signUpAndIn();
    const threadId = await postThread(author);
    const replyId = await postReply(author, threadId);

    const res = await author.json(`/api/forum/replies/${replyId}`, { body: "   " }, { method: "PATCH" });
    expect(res.status).toBe(400);
  });

  it("400s pin and lock with a non-boolean value", async () => {
    const author = new Session();
    await author.signUpAndIn();
    const threadId = await postThread(author);
    const { s: mod } = await moderatorSession();

    const pinRes = await mod.json(`/api/forum/threads/${threadId}/pin`, { pinned: "yes" });
    expect(pinRes.status).toBe(400);

    const lockRes = await mod.json(`/api/forum/threads/${threadId}/lock`, { locked: "yes" });
    expect(lockRes.status).toBe(400);
  });
});

describe("moderation: sanity on db helpers", () => {
  it("setRole and setBanned actually change the live row", async () => {
    const s = new Session();
    const user = await s.signUpAndIn();
    await setRole(user.email, "moderator");
    await setBanned(user.email, true);
    const row = await userByEmail(user.email);
    expect(row.role).toBe("moderator");
    expect(row.banned).toBe(true);
  });
});
