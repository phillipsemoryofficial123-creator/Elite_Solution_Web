import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { KNOWN_SEO_PATHS } from "@/lib/seo/paths";
import { createClient as createPublicClient } from "@/lib/supabase/public";
import type { SeoPage } from "@/lib/seo/types";

function absoluteUrl(path: string): string {
  const base = site.website.replace(/\/$/, "");
  if (path === "/") return `${base}/`;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

function fallbackSitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return KNOWN_SEO_PATHS.map((path) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}

async function fetchSitemapPages(): Promise<
  Pick<SeoPage, "path" | "updated_at" | "published_at">[] | null
> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("seo_pages")
      .select("path, updated_at, published_at")
      .eq("status", "published")
      .eq("include_in_sitemap", true)
      .eq("robots_index", true);

    if (error || !data || data.length === 0) return null;
    return data as Pick<SeoPage, "path" | "updated_at" | "published_at">[];
  } catch {
    return null;
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = await fetchSitemapPages();
  if (!pages) return fallbackSitemap();

  return pages.map((page) => ({
    url: absoluteUrl(page.path),
    lastModified: page.updated_at
      ? new Date(page.updated_at)
      : page.published_at
        ? new Date(page.published_at)
        : new Date(),
    changeFrequency: page.path === "/" ? "weekly" : "monthly",
    priority: page.path === "/" ? 1 : 0.7,
  }));
}
