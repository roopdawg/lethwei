import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPreviousCompletedWeek, isWeekCompliant } from "@/lib/mod-quota";
import {
  activateDiscountCode,
  createModDiscountCode,
  deactivateDiscountCode,
} from "@/lib/shopify-admin-discounts";

/**
 * Weekly moderator activity quota check. Meant to be hit once a week by an
 * external scheduler (Railway cron, GitHub Actions, etc.), not by anything
 * inside the app — there's no human session when this runs, so it's gated
 * by a shared secret header instead of getCurrentUser()/isAdmin().
 *
 * For every `moderator`-role user, counts that user's threads and replies
 * created during the most recently completed calendar week and sets
 * modProbation accordingly. A moderator who clears the quota and doesn't
 * yet have a discount code gets one created; one who already had a code and
 * is returning from probation gets it reactivated; one who just went on
 * probation gets their existing code deactivated. The perk is one reusable
 * code per moderator — it is never reissued.
 *
 * One moderator's Shopify failure is caught and logged per-iteration so it
 * never stops the rest of the batch from being checked.
 */
export async function POST(req: Request) {
  const secret = process.env.CRON_SECRET;
  const provided = req.headers.get("x-cron-secret");
  if (!secret || provided !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { start, end } = getPreviousCompletedWeek();

  const moderators = await prisma.user.findMany({
    where: { role: "moderator" },
    select: { id: true, modProbation: true, modDiscountCode: true, modDiscountId: true },
  });

  const results: { userId: string; compliant: boolean }[] = [];

  for (const mod of moderators) {
    try {
      const [threads, replies] = await Promise.all([
        prisma.thread.count({
          where: { userId: mod.id, createdAt: { gte: start, lt: end } },
        }),
        prisma.reply.count({
          where: { userId: mod.id, createdAt: { gte: start, lt: end } },
        }),
      ]);

      const compliant = isWeekCompliant({ threads, replies });
      const wasOnProbation = mod.modProbation;
      const data: { modProbation: boolean; modDiscountCode?: string; modDiscountId?: string } = {
        modProbation: !compliant,
      };

      if (compliant && !mod.modDiscountCode) {
        const created = await createModDiscountCode(mod.id);
        if (created) {
          data.modDiscountCode = created.code;
          data.modDiscountId = created.id;
        }
      } else if (compliant && wasOnProbation && mod.modDiscountId) {
        await activateDiscountCode(mod.modDiscountId);
      } else if (!compliant && mod.modDiscountId) {
        await deactivateDiscountCode(mod.modDiscountId);
      }

      await prisma.user.update({ where: { id: mod.id }, data });
      results.push({ userId: mod.id, compliant });
    } catch (err) {
      console.error("[cron/check-mod-quotas] failed for moderator", mod.id, err);
    }
  }

  return NextResponse.json({
    weekStart: start.toISOString(),
    weekEnd: end.toISOString(),
    checked: results.length,
    results,
  });
}
