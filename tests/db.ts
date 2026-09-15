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
