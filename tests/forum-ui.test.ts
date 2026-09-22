import { describe, it, expect } from "vitest";
import { Session } from "./helpers";
import { db, setRole, setBanned } from "./db";

const CATEGORY = "training";

async function postThread(s: Session, title: string) {
  const res = await s.json("/api/forum/threads", {
    title,
    body: "Posted by the forum-ui suite.",
    categorySlug: CATEGORY,
  });
  return { res, threadId: res.ok ? (await res.json()).threadId : null };
}

/** Sign back in so the session JWT picks up a role/banned change made directly in the DB. */
async function refreshSession(s: Session, email: string, password: string) {
  await s.signIn(email, password);
}

describe("thread edit/delete controls", () => {
  it("shows Edit and Delete to the thread's author", async () => {
    const author = new Session();
    await author.signUpAndIn();
    const { threadId } = await postThread(author, `author controls ${Date.now()}`);

    const html = await author.text(`/forum/${CATEGORY}/${threadId}`);
    expect(html).toContain('data-testid="thread-edit-button"');
    expect(html).toContain('data-testid="thread-delete-button"');
  });

  it("hides Edit and Delete from a different member", async () => {
    const author = new Session();
    await author.signUpAndIn();
    const { threadId } = await postThread(author, `stranger controls ${Date.now()}`);

    const stranger = new Session();
    await stranger.signUpAndIn();

    const html = await stranger.text(`/forum/${CATEGORY}/${threadId}`);
    expect(html).not.toContain('data-testid="thread-edit-button"');
    expect(html).not.toContain('data-testid="thread-delete-button"');
  });
});

describe("moderator controls", () => {
  it("shows Pin and Lock to a moderator", async () => {
    const author = new Session();
    await author.signUpAndIn();
    const { threadId } = await postThread(author, `mod pin/lock ${Date.now()}`);

    const mod = new Session();
    const modUser = await mod.signUpAndIn();
    await setRole(modUser.email, "moderator");
    await refreshSession(mod, modUser.email, modUser.password);

    const html = await mod.text(`/forum/${CATEGORY}/${threadId}`);
    expect(html).toContain('data-testid="thread-pin-button"');
    expect(html).toContain('data-testid="thread-lock-button"');
  });

  it("hides Pin and Lock from an ordinary member", async () => {
    const author = new Session();
    await author.signUpAndIn();
    const { threadId } = await postThread(author, `member no pin/lock ${Date.now()}`);

    const member = new Session();
    await member.signUpAndIn();

    const html = await member.text(`/forum/${CATEGORY}/${threadId}`);
    expect(html).not.toContain('data-testid="thread-pin-button"');
    expect(html).not.toContain('data-testid="thread-lock-button"');
  });
});

describe("locked thread", () => {
  it("shows the Locked badge on the thread page and the category page, hides the reply form for a member, but still shows it for a moderator", async () => {
    const author = new Session();
    await author.signUpAndIn();
    const title = `locked thread ${Date.now()}`;
    const { threadId } = await postThread(author, title);

    await db.thread.update({ where: { id: threadId }, data: { locked: true } });

    // Locked badge on the thread page.
    const threadHtml = await author.text(`/forum/${CATEGORY}/${threadId}`);
    expect(threadHtml).toContain('data-testid="thread-locked-badge"');
    expect(threadHtml).toContain("Locked");

    // Locked badge on the category page's thread list.
    const categoryHtml = await author.text(`/forum/${CATEGORY}`);
    expect(categoryHtml).toContain('data-testid="thread-locked-badge"');

    // A member is refused the reply form and shown the locked notice.
    const member = new Session();
    await member.signUpAndIn();
    const memberHtml = await member.text(`/forum/${CATEGORY}/${threadId}`);
    expect(memberHtml).toContain('data-testid="thread-locked-notice"');
    expect(memberHtml).toContain("This thread is locked");
    expect(memberHtml).not.toContain('data-testid="reply-form"');

    // A moderator can still reply on a locked thread.
    const mod = new Session();
    const modUser = await mod.signUpAndIn();
    await setRole(modUser.email, "moderator");
    await refreshSession(mod, modUser.email, modUser.password);
    const modHtml = await mod.text(`/forum/${CATEGORY}/${threadId}`);
    expect(modHtml).not.toContain('data-testid="thread-locked-notice"');
    expect(modHtml).toContain('data-testid="reply-form"');
  });
});

describe("banned users", () => {
  it("sees the can't-post notice on the new thread page", async () => {
    const s = new Session();
    const user = await s.signUpAndIn();
    await setBanned(user.email, true);
    await refreshSession(s, user.email, user.password);

    const html = await s.text("/forum/new-thread");
    expect(html).toContain('data-testid="cant-post-notice"');
  });

  it("sees the can't-post notice on a thread page instead of the reply form", async () => {
    const author = new Session();
    await author.signUpAndIn();
    const { threadId } = await postThread(author, `banned reply target ${Date.now()}`);

    const banned = new Session();
    const bannedUser = await banned.signUpAndIn();
    await setBanned(bannedUser.email, true);
    await refreshSession(banned, bannedUser.email, bannedUser.password);

    const html = await banned.text(`/forum/${CATEGORY}/${threadId}`);
    expect(html).toContain('data-testid="cant-post-notice"');
  });
});

describe("navbar admin link", () => {
  it("shows the Admin link for a moderator", async () => {
    const mod = new Session();
    const modUser = await mod.signUpAndIn();
    await setRole(modUser.email, "moderator");
    await refreshSession(mod, modUser.email, modUser.password);

    const html = await mod.text("/forum");
    expect(html).toContain('data-testid="navbar-admin-link"');
  });

  it("hides the Admin link for a member", async () => {
    const member = new Session();
    await member.signUpAndIn();

    const html = await member.text("/forum");
    expect(html).not.toContain('data-testid="navbar-admin-link"');
  });
});
