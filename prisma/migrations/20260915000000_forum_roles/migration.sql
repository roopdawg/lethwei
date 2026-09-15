-- Roles become an enum. Existing rows all hold the string "member" (the
-- column default was never written to by any code path), so the cast is safe.
CREATE TYPE "Role" AS ENUM ('member', 'moderator', 'admin');

ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role" USING ("role"::"Role");
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'member';

ALTER TABLE "User" ADD COLUMN "banned" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "Thread" ADD COLUMN "locked" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Thread" ADD COLUMN "editedAt" TIMESTAMP(3);

ALTER TABLE "Reply" ADD COLUMN "editedAt" TIMESTAMP(3);
