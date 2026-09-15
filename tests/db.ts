/**
 * Direct database access for integration tests.
 *
 * The suite talks to the app over HTTP like a browser would, but some setups
 * have no HTTP path on purpose: nobody can make themselves an admin through
 * the API. For those the test reaches into the same database the app under
 * test is using (DATABASE_URL, exactly as CI sets it).
 */
import { PrismaClient, type Role } from "@prisma/client";

export const db = new PrismaClient();

export async function setRole(email: string, role: Role) {
  return db.user.update({ where: { email }, data: { role } });
}

export async function setBanned(email: string, banned: boolean) {
  return db.user.update({ where: { email }, data: { banned } });
}

export async function userByEmail(email: string) {
  return db.user.findUniqueOrThrow({ where: { email } });
}

/** Every category slug and gym name the suite creates starts with these. */
export const TEST_SLUG_PREFIX = "qa-";
export const TEST_GYM_PREFIX = "qa-gym ";

/** Deletes users, posts, categories and gyms created by the test suite. */
export async function cleanupTestData() {
  const users = await db.user.findMany({
    where: { email: { endsWith: "@lethwei.test" } },
    select: { id: true },
  });
  const ids = users.map((u) => u.id);
  if (ids.length) {
    await db.reply.deleteMany({
      where: { OR: [{ userId: { in: ids } }, { thread: { userId: { in: ids } } }] },
    });
    await db.thread.deleteMany({ where: { userId: { in: ids } } });
  }
  await db.thread.deleteMany({ where: { category: { slug: { startsWith: TEST_SLUG_PREFIX } } } });
  await db.category.deleteMany({ where: { slug: { startsWith: TEST_SLUG_PREFIX } } });
  await db.gym.deleteMany({ where: { name: { startsWith: TEST_GYM_PREFIX } } });
  if (ids.length) await db.user.deleteMany({ where: { id: { in: ids } } });
}
