/**
 * Forum permission rules. Pure functions, no I/O, so they are unit-testable
 * and every API route and page shares one definition of who may do what.
 *
 *   member     — post, reply, edit and delete their own posts
 *   moderator  — everything a member can, plus any post: edit, delete, pin,
 *                lock; approve gym submissions
 *   admin      — everything a moderator can, plus users (ban, change role)
 *                and categories
 *
 * A banned user keeps their account and can sign in, but can no longer post,
 * reply, or edit. Their existing posts stay up unless a moderator removes them.
 */
import type { Role } from "@prisma/client";

export type { Role };

export type Actor = { id: string; role: Role; banned: boolean };
export type Post = { userId: string };
export type ThreadState = { locked: boolean };

const RANK: Record<Role, number> = { member: 0, moderator: 1, admin: 2 };

export const ROLES: Role[] = ["member", "moderator", "admin"];

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && (ROLES as string[]).includes(value);
}

export function isModerator(actor: Actor | null | undefined): boolean {
  return !!actor && !actor.banned && RANK[actor.role] >= RANK.moderator;
}

export function isAdmin(actor: Actor | null | undefined): boolean {
  return !!actor && !actor.banned && actor.role === "admin";
}

function isAuthor(actor: Actor, post: Post): boolean {
  return actor.id === post.userId;
}

/** Start a new thread. */
export function canPost(actor: Actor | null | undefined): boolean {
  return !!actor && !actor.banned;
}

/** Reply in a thread. Locked threads only accept staff replies. */
export function canReply(actor: Actor | null | undefined, thread: ThreadState): boolean {
  if (!actor || actor.banned) return false;
  if (thread.locked) return isModerator(actor);
  return true;
}

/** Edit a thread or reply. Authors lose the right once the thread is locked. */
export function canEditPost(
  actor: Actor | null | undefined,
  post: Post,
  thread: ThreadState
): boolean {
  if (!actor || actor.banned) return false;
  if (isModerator(actor)) return true;
  return isAuthor(actor, post) && !thread.locked;
}

/** Delete a thread or reply. Authors may always remove their own work. */
export function canDeletePost(actor: Actor | null | undefined, post: Post): boolean {
  if (!actor || actor.banned) return false;
  return isModerator(actor) || isAuthor(actor, post);
}

export function canPinThread(actor: Actor | null | undefined): boolean {
  return isModerator(actor);
}

export function canLockThread(actor: Actor | null | undefined): boolean {
  return isModerator(actor);
}

export function canApproveGym(actor: Actor | null | undefined): boolean {
  return isModerator(actor);
}

export function canManageCategories(actor: Actor | null | undefined): boolean {
  return isAdmin(actor);
}

/** Admins ban members and moderators, never other admins, never themselves. */
export function canBanUser(actor: Actor | null | undefined, target: Actor): boolean {
  if (!isAdmin(actor)) return false;
  if (actor!.id === target.id) return false;
  return target.role !== "admin";
}

/** Admins set any role on anyone but themselves. */
export function canChangeRole(
  actor: Actor | null | undefined,
  target: Actor,
  newRole: Role
): boolean {
  if (!isAdmin(actor)) return false;
  if (actor!.id === target.id) return false;
  return isRole(newRole);
}

/** Whether the /admin area is visible at all. Moderators see the gym queue. */
export function canSeeAdminArea(actor: Actor | null | undefined): boolean {
  return isModerator(actor);
}
