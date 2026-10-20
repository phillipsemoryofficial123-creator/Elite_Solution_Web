import type { Metadata } from "next";
import type { SeoPage } from "@/lib/seo/types";

type SeoMetadataFields = Partial<
  Pick<
    SeoPage,
    | "title"
    | "meta_description"
    | "canonical_url"
    | "robots_index"
    | "robots_follow"
    | "og_title"
    | "og_description"
    | "og_image"
    | "twitter_title"
    | "twitter_description"
    | "twitter_image"
  >
>;

function nonEmpty(value: string | null | undefined): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

/**
 * Merges published SEO overrides onto page-level Metadata defaults.
 * Missing/null DB fields leave the default untouched.
 */
export function buildMetadataFromSeo(
  defaults: Metadata,
  seo: SeoMetadataFields | null | undefined,
): Metadata {
  if (!seo) return defaults;

  const title = nonEmpty(seo.title);
  const description = nonEmpty(seo.meta_description);
  const canonical = nonEmpty(seo.canonical_url);

  const ogTitle = nonEmpty(seo.og_title) ?? title;
  const ogDescription = nonEmpty(seo.og_description) ?? description;
  const ogImage = nonEmpty(seo.og_image);

  const twitterTitle = nonEmpty(seo.twitter_title) ?? ogTitle;
  const twitterDescription =
    nonEmpty(seo.twitter_description) ?? ogDescription;
  const twitterImage = nonEmpty(seo.twitter_image) ?? ogImage;

  const hasRobotOverrides =
    typeof seo.robots_index === "boolean" ||
    typeof seo.robots_follow === "boolean";

  const next: Metadata = {
    ...defaults,
  };

  if (title) {
    next.title = title;
  }

  if (description) {
    next.description = description;
  }

  if (canonical) {
    next.alternates = {
      ...defaults.alternates,
      canonical,
    };
  }

  if (hasRobotOverrides) {
    next.robots = {
      ...(typeof defaults.robots === "object" && defaults.robots !== null
        ? defaults.robots
        : {}),
      index: seo.robots_index ?? true,
      follow: seo.robots_follow ?? true,
    };
  }

  const defaultOg =
    typeof defaults.openGraph === "object" && defaults.openGraph !== null
      ? defaults.openGraph
      : {};

  if (ogTitle || ogDescription || ogImage) {
    next.openGraph = {
      ...defaultOg,
      ...(ogTitle ? { title: ogTitle } : {}),
      ...(ogDescription ? { description: ogDescription } : {}),
      ...(ogImage
        ? {
            images: [
              {
                url: ogImage,
              },
            ],
          }
        : {}),
    };
  }

  const defaultTwitter =
    typeof defaults.twitter === "object" && defaults.twitter !== null
      ? defaults.twitter
      : {};

  if (twitterTitle || twitterDescription || twitterImage) {
    next.twitter = {
      ...defaultTwitter,
      ...(twitterTitle ? { title: twitterTitle } : {}),
      ...(twitterDescription ? { description: twitterDescription } : {}),
      ...(twitterImage ? { images: [twitterImage] } : {}),
    };
  }

  return next;
}
