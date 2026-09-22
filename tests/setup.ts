/**
 * Runs after every test file. Removes everything the integration suite
 * created so a shared local database does not fill up with approved
 * "qa-gym" listings and orphan "qa-" categories between runs.
 *
 * Unit tests load this too; without a database configured the cleanup is a
 * no-op rather than a failure.
 */
import { afterAll } from "vitest";
import { cleanupTestData, db } from "./db";

afterAll(async () => {
  if (!process.env.DATABASE_URL) return;
  try {
    await cleanupTestData();
  } finally {
    await db.$disconnect();
  }
});
