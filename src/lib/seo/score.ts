import type { SeoScoreCheck, SeoScoreInput, SeoScoreResult } from "@/lib/seo/types";

/**
 * Transparent, rule-based internal SEO checklist score (0–100).
 *
 * IMPORTANT: This is NOT a Google ranking factor. It is an editorial quality
 * checklist for admins — useful for spotting incomplete metadata only.
 */

const TITLE_MIN = 30;
const TITLE_MAX = 60;
const DESC_MIN = 70;
const DESC_MAX = 160;

function hasText(value: string | null | undefined): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function lengthInRange(value: string, min: number, max: number): boolean {
  const len = value.trim().length;
  return len >= min && len <= max;
}

export function computeSeoScore(page: SeoScoreInput): SeoScoreResult {
  const title = page.title?.trim() ?? "";
  const description = page.meta_description?.trim() ?? "";
  const focusKeyword = page.focus_keyword?.trim() ?? "";
  const canonical = page.canonical_url?.trim() ?? "";
  const ogImage = page.og_image?.trim() ?? "";

  const robotsIndex = page.robots_index ?? true;
  const includeInSitemap = page.include_in_sitemap ?? true;

  const titlePresent = hasText(title);
  const titleLengthOk = titlePresent && lengthInRange(title, TITLE_MIN, TITLE_MAX);
  const descPresent = hasText(description);
  const descLengthOk =
    descPresent && lengthInRange(description, DESC_MIN, DESC_MAX);
  const keywordPresent = hasText(focusKeyword);
  const keywordInTitle =
    keywordPresent &&
    titlePresent &&
    title.toLowerCase().includes(focusKeyword.toLowerCase());
  const canonicalPresent = hasText(canonical);
  const ogImagePresent = hasText(ogImage);
  const robotsSitemapConsistent =
    (robotsIndex && includeInSitemap) || (!robotsIndex && !includeInSitemap);

  const checks: SeoScoreCheck[] = [
    {
      id: "title_present",
      label: "Title tag is present",
      pass: titlePresent,
      weight: 15,
    },
    {
      id: "title_length",
      label: `Title length is ${TITLE_MIN}–${TITLE_MAX} characters`,
      pass: titleLengthOk,
      weight: 10,
    },
    {
      id: "description_present",
      label: "Meta description is present",
      pass: descPresent,
      weight: 15,
    },
    {
      id: "description_length",
      label: `Meta description length is ${DESC_MIN}–${DESC_MAX} characters`,
      pass: descLengthOk,
      weight: 10,
    },
    {
      id: "focus_keyword",
      label: "Focus keyword is set",
      pass: keywordPresent,
      weight: 10,
    },
    {
      id: "keyword_in_title",
      label: "Focus keyword appears in the title",
      pass: keywordInTitle,
      weight: 10,
    },
    {
      id: "canonical",
      label: "Canonical URL is set",
      pass: canonicalPresent,
      weight: 10,
    },
    {
      id: "og_image",
      label: "Open Graph image is set",
      pass: ogImagePresent,
      weight: 10,
    },
    {
      id: "robots_sitemap",
      label: "Robots index and sitemap inclusion are consistent",
      pass: robotsSitemapConsistent,
      weight: 10,
    },
  ];

  const totalWeight = checks.reduce((sum, check) => sum + check.weight, 0);
  const earned = checks.reduce(
    (sum, check) => sum + (check.pass ? check.weight : 0),
    0,
  );

  const score =
    totalWeight === 0 ? 0 : Math.round((earned / totalWeight) * 100);

  return { score, checks };
}
