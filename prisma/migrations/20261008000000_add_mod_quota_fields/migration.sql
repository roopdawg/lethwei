-- Weekly moderator activity quota (see src/lib/mod-quota.ts). Compliance
-- itself is computed on-the-fly from Thread/Reply rows; these columns just
-- persist the outcome of the weekly cron job plus the moderator's standing
-- discount code.
ALTER TABLE "User" ADD COLUMN "modProbation" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "User" ADD COLUMN "modDiscountCode" TEXT;
ALTER TABLE "User" ADD COLUMN "modDiscountId" TEXT;
