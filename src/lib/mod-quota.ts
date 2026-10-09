/**
 * Moderator weekly activity quota. Pure functions, no I/O, so the compliance
 * rule is unit-testable on its own — the cron route is the only caller that
 * touches the database or Shopify.
 *
 * Business rule: every user with role `moderator` must, each calendar week
 * (Monday 00:00 to Sunday 23:59, UTC), start at least 2 new threads AND make
 * at least 10 total posts, where a "post" is a Thread they started or a
 * Reply they wrote. Thread creation counts toward the 10, so the minimum
 * shape is 2 threads + 8 replies = 10 posts.
 *
 * Compliance is computed on the fly from Thread/Reply row counts for the
 * week rather than kept in a running counter — there is no write path that
 * needs it incrementally, and a COUNT over an indexed (userId, createdAt) is
 * cheap at this scale.
 */

export const MOD_QUOTA = {
  minThreadsPerWeek: 2,
  minPostsPerWeek: 10,
} as const;

export type WeekActivity = { threads: number; replies: number };

/** Total posts = threads started + replies written. */
export function totalPosts(activity: WeekActivity): number {
  return activity.threads + activity.replies;
}

/** Whether one moderator's activity for one week clears both sub-quotas. */
export function isWeekCompliant(activity: WeekActivity): boolean {
  return (
    activity.threads >= MOD_QUOTA.minThreadsPerWeek &&
    totalPosts(activity) >= MOD_QUOTA.minPostsPerWeek
  );
}

export type WeekRange = { start: Date; end: Date };

/**
 * The most recently completed calendar week as of `now`, as a half-open UTC
 * range: [start, end) where `start` is a Monday 00:00:00.000 UTC and `end`
 * is the following Monday 00:00:00.000 UTC — i.e. Sunday 23:59:59.999 UTC
 * inclusive, matching "Monday 00:00 to Sunday 23:59".
 *
 * "Most recently completed" is relative to `now`: if `now` falls on a
 * Wednesday, the returned range is last week's Monday through Sunday, not
 * the week in progress.
 */
export function getPreviousCompletedWeek(now: Date = new Date()): WeekRange {
  const daysSinceMonday = (now.getUTCDay() + 6) % 7; // Mon=0, Tue=1, ..., Sun=6
  const thisMonday = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - daysSinceMonday)
  );
  const start = new Date(thisMonday.getTime() - 7 * 24 * 60 * 60 * 1000);
  return { start, end: thisMonday };
}
