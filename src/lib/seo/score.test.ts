import { describe, expect, it } from "vitest";
import { computeSeoScore } from "@/lib/seo/score";

describe("computeSeoScore", () => {
  it("scores incomplete pages low", () => {
    const result = computeSeoScore({
      title: null,
      meta_description: null,
      focus_keyword: null,
      canonical_url: null,
      og_image: null,
      robots_index: true,
      include_in_sitemap: true,
    });
    expect(result.score).toBeLessThan(40);
    expect(result.checks.some((c) => !c.pass)).toBe(true);
  });

  it("scores a complete page higher", () => {
    const result = computeSeoScore({
      title: "Accounting services for growing teams in Illinois",
      meta_description:
        "Elite Solutions USA provides bookkeeping, tax, and payroll support so owners always know where the business stands financially today.",
      focus_keyword: "accounting services",
      canonical_url: "https://www.elitesolutionusa.com/services/financial/accounting-and-bookkeeping",
      og_image: "https://www.elitesolutionusa.com/image.png",
      robots_index: true,
      include_in_sitemap: true,
    });
    expect(result.score).toBeGreaterThan(70);
  });
});
