import { describe, expect, it } from "vitest";
import { buildMetadataFromSeo } from "@/lib/seo/build-metadata";

describe("buildMetadataFromSeo", () => {
  it("returns defaults when seo is null", () => {
    const defaults = { title: "About", description: "Default desc" };
    expect(buildMetadataFromSeo(defaults, null)).toEqual(defaults);
  });

  it("overrides title and description from published SEO", () => {
    const merged = buildMetadataFromSeo(
      { title: "About", description: "Default desc" },
      {
        title: "Custom About Title",
        meta_description: "Custom description for search.",
        robots_index: false,
        robots_follow: true,
        canonical_url: "https://www.elitesolutionusa.com/about",
      },
    );
    expect(merged.title).toBe("Custom About Title");
    expect(merged.description).toBe("Custom description for search.");
    expect(merged.alternates?.canonical).toBe(
      "https://www.elitesolutionusa.com/about",
    );
    expect(merged.robots).toMatchObject({ index: false, follow: true });
  });
});
