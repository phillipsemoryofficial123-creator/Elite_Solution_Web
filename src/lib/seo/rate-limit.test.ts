import { describe, expect, it, beforeEach } from "vitest";
import { __resetRateLimitForTests, rateLimit } from "@/lib/seo/rate-limit";

describe("rateLimit", () => {
  beforeEach(() => {
    __resetRateLimitForTests();
  });

  it("allows requests under the limit", () => {
    expect(rateLimit("a", 2, 60_000).ok).toBe(true);
    expect(rateLimit("a", 2, 60_000).ok).toBe(true);
  });

  it("blocks when over the limit", () => {
    rateLimit("b", 1, 60_000);
    const blocked = rateLimit("b", 1, 60_000);
    expect(blocked.ok).toBe(false);
    expect(blocked.remaining).toBe(0);
  });
});
