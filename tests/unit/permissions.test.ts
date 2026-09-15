/**
 * Unit tests for the permission rules. No server, no database: these run
 * anywhere with `npm run test:unit`.
 */
import { describe, expect, it } from "vitest";
import {
  canApproveGym,
  canBanUser,
  canChangeRole,
  canDeletePost,
  canEditPost,
  canLockThread,
  canManageCategories,
  canPinThread,
  canPost,
  canReply,
  canSeeAdminArea,
  isAdmin,
  isModerator,
  isRole,
  type Actor,
} from "../../src/lib/permissions";

const member: Actor = { id: "u-member", role: "member", banned: false };
const other: Actor = { id: "u-other", role: "member", banned: false };
const mod: Actor = { id: "u-mod", role: "moderator", banned: false };
const admin: Actor = { id: "u-admin", role: "admin", banned: false };
const admin2: Actor = { id: "u-admin-2", role: "admin", banned: false };
const bannedMember: Actor = { id: "u-banned", role: "member", banned: true };
const bannedMod: Actor = { id: "u-banned-mod", role: "moderator", banned: true };

const open = { locked: false };
const locked = { locked: true };
const ownPost = { userId: member.id };
const othersPost = { userId: other.id };

describe("role checks", () => {
  it("recognises the three roles and nothing else", () => {
    expect(isRole("member")).toBe(true);
    expect(isRole("moderator")).toBe(true);
    expect(isRole("admin")).toBe(true);
    expect(isRole("owner")).toBe(false);
    expect(isRole("")).toBe(false);
    expect(isRole(undefined)).toBe(false);
  });

  it("ranks admin above moderator above member", () => {
    expect(isModerator(member)).toBe(false);
    expect(isModerator(mod)).toBe(true);
    expect(isModerator(admin)).toBe(true);
    expect(isAdmin(mod)).toBe(false);
    expect(isAdmin(admin)).toBe(true);
  });

  it("strips staff powers from a banned account", () => {
    expect(isModerator(bannedMod)).toBe(false);
    expect(isAdmin({ ...admin, banned: true })).toBe(false);
  });

  it("treats a missing actor as nobody", () => {
    expect(isModerator(null)).toBe(false);
    expect(isAdmin(undefined)).toBe(false);
    expect(canPost(null)).toBe(false);
    expect(canSeeAdminArea(undefined)).toBe(false);
  });
});

describe("posting and replying", () => {
  it("lets any signed-in, unbanned user post", () => {
    expect(canPost(member)).toBe(true);
    expect(canPost(mod)).toBe(true);
    expect(canPost(bannedMember)).toBe(false);
  });

  it("lets members reply in open threads only", () => {
    expect(canReply(member, open)).toBe(true);
    expect(canReply(member, locked)).toBe(false);
  });

  it("lets staff reply in locked threads", () => {
    expect(canReply(mod, locked)).toBe(true);
    expect(canReply(admin, locked)).toBe(true);
  });

  it("never lets a banned user reply", () => {
    expect(canReply(bannedMember, open)).toBe(false);
    expect(canReply(bannedMod, locked)).toBe(false);
  });
});

describe("editing", () => {
  it("lets an author edit their own post in an open thread", () => {
    expect(canEditPost(member, ownPost, open)).toBe(true);
  });

  it("stops an author editing once the thread is locked", () => {
    expect(canEditPost(member, ownPost, locked)).toBe(false);
  });

  it("stops a member editing someone else's post", () => {
    expect(canEditPost(member, othersPost, open)).toBe(false);
  });

  it("lets moderators edit anything, locked or not", () => {
    expect(canEditPost(mod, othersPost, open)).toBe(true);
    expect(canEditPost(mod, othersPost, locked)).toBe(true);
    expect(canEditPost(admin, othersPost, locked)).toBe(true);
  });

  it("stops a banned author editing their own post", () => {
    expect(canEditPost(bannedMember, { userId: bannedMember.id }, open)).toBe(false);
  });
});

describe("deleting", () => {
  it("lets an author delete their own post even in a locked thread", () => {
    expect(canDeletePost(member, ownPost)).toBe(true);
  });

  it("stops a member deleting someone else's post", () => {
    expect(canDeletePost(member, othersPost)).toBe(false);
  });

  it("lets moderators delete anything", () => {
    expect(canDeletePost(mod, othersPost)).toBe(true);
    expect(canDeletePost(admin, othersPost)).toBe(true);
  });

  it("stops a banned user deleting", () => {
    expect(canDeletePost(bannedMember, { userId: bannedMember.id })).toBe(false);
  });
});

describe("moderator powers", () => {
  it("pin, lock and gym approval need moderator or above", () => {
    for (const fn of [canPinThread, canLockThread, canApproveGym, canSeeAdminArea]) {
      expect(fn(member)).toBe(false);
      expect(fn(mod)).toBe(true);
      expect(fn(admin)).toBe(true);
      expect(fn(bannedMod)).toBe(false);
    }
  });
});

describe("admin powers", () => {
  it("categories need admin", () => {
    expect(canManageCategories(member)).toBe(false);
    expect(canManageCategories(mod)).toBe(false);
    expect(canManageCategories(admin)).toBe(true);
  });

  it("admins ban members and moderators", () => {
    expect(canBanUser(admin, member)).toBe(true);
    expect(canBanUser(admin, mod)).toBe(true);
  });

  it("admins cannot ban other admins or themselves", () => {
    expect(canBanUser(admin, admin2)).toBe(false);
    expect(canBanUser(admin, admin)).toBe(false);
  });

  it("moderators cannot ban anyone", () => {
    expect(canBanUser(mod, member)).toBe(false);
  });

  it("admins change anyone's role but their own", () => {
    expect(canChangeRole(admin, member, "moderator")).toBe(true);
    expect(canChangeRole(admin, mod, "member")).toBe(true);
    expect(canChangeRole(admin, admin2, "member")).toBe(true);
    expect(canChangeRole(admin, admin, "member")).toBe(false);
  });

  it("rejects an unknown role", () => {
    expect(canChangeRole(admin, member, "owner" as never)).toBe(false);
  });

  it("moderators cannot change roles", () => {
    expect(canChangeRole(mod, member, "moderator")).toBe(false);
  });
});
