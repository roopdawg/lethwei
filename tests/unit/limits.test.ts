import { describe, expect, it } from "vitest";
import { LIMITS, cleanSlug, cleanText } from "../../src/lib/limits";

describe("cleanText", () => {
  it("trims and returns a valid string", () => {
    expect(cleanText("  hello  ", 10)).toBe("hello");
  });

  it("rejects non-strings instead of throwing", () => {
    expect(cleanText(123, 10)).toBeNull();
    expect(cleanText({ trim: () => "x" }, 10)).toBeNull();
    expect(cleanText(null, 10)).toBeNull();
    expect(cleanText(undefined, 10)).toBeNull();
    expect(cleanText(["a"], 10)).toBeNull();
  });

  it("rejects empty and whitespace-only strings", () => {
    expect(cleanText("", 10)).toBeNull();
    expect(cleanText("   \n\t ", 10)).toBeNull();
  });

  it("measures the limit after trimming", () => {
    expect(cleanText("  " + "a".repeat(10) + "  ", 10)).toBe("a".repeat(10));
    expect(cleanText("a".repeat(11), 10)).toBeNull();
  });

  it("caps a thread body at the configured limit", () => {
    expect(cleanText("x".repeat(LIMITS.threadBody), LIMITS.threadBody)).not.toBeNull();
    expect(cleanText("x".repeat(LIMITS.threadBody + 1), LIMITS.threadBody)).toBeNull();
  });
});

describe("cleanSlug", () => {
  it("accepts the shapes the seed uses", () => {
    for (const s of ["training", "find-training", "events", "beginners", "a1-b2"]) {
      expect(cleanSlug(s)).toBe(s);
    }
  });

  it("rejects anything that is not lowercase letters, digits and single hyphens", () => {
    for (const s of ["Training", "find training", "-lead", "trail-", "a--b", "x/y", "é", ""]) {
      expect(cleanSlug(s)).toBeNull();
    }
  });

  it("rejects over-long and non-string slugs", () => {
    expect(cleanSlug("a".repeat(LIMITS.categorySlug + 1))).toBeNull();
    expect(cleanSlug(42)).toBeNull();
  });
});
