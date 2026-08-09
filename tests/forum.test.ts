import { describe, it, expect } from "vitest";
import { Session } from "./helpers";

const CATEGORY = "training";

async function postThread(s: Session, title: string) {
  const res = await s.json("/api/forum/threads", {
    title,
    body: "Posted by the automated suite.",
    categorySlug: CATEGORY,
  });
  return { res, threadId: res.ok ? (await res.json()).threadId : null };
}

describe("forum authorisation", () => {
  it("refuses an anonymous thread", async () => {
    const { res } = await postThread(new Session(), "anon thread");
    expect(res.status).toBe(401);
  });

  it("refuses an anonymous reply", async () => {
    const author = new Session();
    await author.signUpAndIn();
    const { threadId } = await postThread(author, "reply target");
    const res = await new Session().json(`/api/forum/threads/${threadId}/replies`, {
      body: "anon reply",
    });
    expect(res.status).toBe(401);
  });

  it("lets a signed-in user post and reply", async () => {
    const s = new Session();
    await s.signUpAndIn();
    const { res, threadId } = await postThread(s, "signed-in thread");
    expect(res.ok).toBe(true);
    expect(threadId).toBeTruthy();
    const reply = await s.json(`/api/forum/threads/${threadId}/replies`, { body: "a reply" });
    expect(reply.ok).toBe(true);
  });
});

describe("forum validation", () => {
  it("refuses an empty title and body", async () => {
    const s = new Session();
    await s.signUpAndIn();
    const res = await s.json("/api/forum/threads", {
      title: "",
      body: "",
      categorySlug: CATEGORY,
    });
    expect(res.ok).toBe(false);
  });

  it("refuses an unknown category", async () => {
    const s = new Session();
    await s.signUpAndIn();
    const res = await s.json("/api/forum/threads", {
      title: "x",
      body: "y",
      categorySlug: "no-such-category",
    });
    expect(res.ok).toBe(false);
  });
});

describe("forum rendering", () => {
  it("shows a new thread and its author on the category page", async () => {
    const s = new Session();
    const user = await s.signUpAndIn();
    const title = `render check ${Date.now()}`;
    const { threadId } = await postThread(s, title);

    const list = await s.text(`/forum/${CATEGORY}`);
    expect(list).toContain(title);

    const detail = await s.text(`/forum/${CATEGORY}/${threadId}`);
    expect(detail).toContain(title);
    expect(detail).toContain(user.username);
  });

  it("404s an unknown category", async () => {
    const res = await new Session().fetch("/forum/definitely-not-a-category");
    expect(res.status).toBe(404);
  });

  // Regression: /forum never called auth(), so it rendered the hero "Sign In"
  // button and a "Create a free account" panel to people who were signed in
  // and had just posted a thread.
  it("hides signed-out CTAs from a signed-in user", async () => {
    const s = new Session();
    await s.signUpAndIn();
    const html = await s.text("/forum");
    expect(html).not.toContain("Create a free account");
    expect(html).toContain("GOT SOMETHING TO SAY");
  });

  it("shows signed-out CTAs to an anonymous visitor", async () => {
    const html = await new Session().text("/forum");
    expect(html).toContain("Create a free account");
    expect(html).not.toContain("GOT SOMETHING TO SAY");
  });
});
