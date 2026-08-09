import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
    // Integration tests hit a real server and a real database; running them
    // in parallel makes ordering and cleanup unpredictable.
    fileParallelism: false,
    testTimeout: 30_000,
    hookTimeout: 30_000,
    reporters: "verbose",
  },
});
