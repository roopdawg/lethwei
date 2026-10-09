/**
 * Unit tests for the moderator weekly activity quota rules. No server, no
 * database: these run anywhere with `npm run test:unit`.
 */
import { describe, expect, it } from "vitest";
import {
  MOD_QUOTA,
  getPreviousCompletedWeek,
  isWeekCompliant,
  totalPosts,
} from "../../src/lib/mod-quota";

describe("totalPosts", () => {
  it("sums threads and replies", () => {
    expect(totalPosts({ threads: 2, replies: 8 })).toBe(10);
    expect(totalPosts({ threads: 0, replies: 0 })).toBe(0);
  });
});

describe("isWeekCompliant", () => {
  it("passes the exact minimum shape: 2 threads + 8 replies = 10 posts", () => {
    expect(isWeekCompliant({ threads: 2, replies: 8 })).toBe(true);
  });

  it("passes when both sub-quotas are comfortably cleared", () => {
    expect(isWeekCompliant({ threads: 5, replies: 20 })).toBe(true);
  });

  it("fails on thread count alone, even with plenty of total posts", () => {
    expect(isWeekCompliant({ threads: 1, replies: 20 })).toBe(false);
    expect(isWeekCompliant({ threads: 0, replies: 30 })).toBe(false);
  });

  it("fails on total posts alone, even with enough threads", () => {
    expect(isWeekCompliant({ threads: 2, replies: 7 })).toBe(false);
    expect(isWeekCompliant({ threads: 4, replies: 0 })).toBe(false);
  });

  it("fails a moderator with no activity at all", () => {
    expect(isWeekCompliant({ threads: 0, replies: 0 })).toBe(false);
  });

  it("counts threads toward the post total, not just the thread total", () => {
    // 3 threads + 7 replies = 10 posts, 3 >= 2 threads: compliant.
    expect(isWeekCompliant({ threads: 3, replies: 7 })).toBe(true);
  });

  it("matches the configured constants exactly", () => {
    const { minThreadsPerWeek, minPostsPerWeek } = MOD_QUOTA;
    expect(isWeekCompliant({ threads: minThreadsPerWeek, replies: minPostsPerWeek - minThreadsPerWeek })).toBe(
      true
    );
    expect(
      isWeekCompliant({ threads: minThreadsPerWeek, replies: minPostsPerWeek - minThreadsPerWeek - 1 })
    ).toBe(false);
  });
});

describe("getPreviousCompletedWeek", () => {
  it("returns last Mon-Sun when now is mid-week (Wednesday)", () => {
    // 2026-10-07 is a Wednesday.
    const now = new Date("2026-10-07T15:00:00Z");
    const { start, end } = getPreviousCompletedWeek(now);
    expect(start.toISOString()).toBe("2026-09-28T00:00:00.000Z"); // Monday
    expect(end.toISOString()).toBe("2026-10-05T00:00:00.000Z"); // following Monday
  });

  it("returns last Mon-Sun when now is exactly a Monday 00:00", () => {
    // 2026-10-05 is a Monday.
    const now = new Date("2026-10-05T00:00:00Z");
    const { start, end } = getPreviousCompletedWeek(now);
    expect(start.toISOString()).toBe("2026-09-28T00:00:00.000Z");
    expect(end.toISOString()).toBe("2026-10-05T00:00:00.000Z");
  });

  it("returns last Mon-Sun when now is a Sunday just before midnight", () => {
    // 2026-10-11 is a Sunday.
    const now = new Date("2026-10-11T23:59:59Z");
    const { start, end } = getPreviousCompletedWeek(now);
    expect(start.toISOString()).toBe("2026-09-28T00:00:00.000Z");
    expect(end.toISOString()).toBe("2026-10-05T00:00:00.000Z");
  });

  it("produces a 7-day half-open range", () => {
    const { start, end } = getPreviousCompletedWeek(new Date("2026-10-07T15:00:00Z"));
    expect(end.getTime() - start.getTime()).toBe(7 * 24 * 60 * 60 * 1000);
  });
});
