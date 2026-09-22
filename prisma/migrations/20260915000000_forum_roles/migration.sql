-- Roles become an enum. No code path ever wrote the old string column, so
-- every row should hold "member"; normalise anyway so a stray value cannot
-- fail the cast and leave the migration half-applied.
UPDATE "User" SET "role" = 'member' WHERE "role" NOT IN ('member', 'moderator', 'admin');

CREATE TYPE "Role" AS ENUM ('member', 'moderator', 'admin');

ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role" USING ("role"::"Role");
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'member';

ALTER TABLE "User" ADD COLUMN "banned" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "Thread" ADD COLUMN "locked" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Thread" ADD COLUMN "editedAt" TIMESTAMP(3);

ALTER TABLE "Reply" ADD COLUMN "editedAt" TIMESTAMP(3);
