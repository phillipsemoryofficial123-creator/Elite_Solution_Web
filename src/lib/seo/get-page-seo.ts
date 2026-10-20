import { unstable_cache } from "next/cache";
import { createClient as createPublicClient } from "@/lib/supabase/public";
import type { SeoPage, SeoRedirect, SeoSiteSettings } from "@/lib/seo/types";

/** Cache tag used by public SEO fetches. Invalidate with revalidateTag(SEO_CACHE_TAG, "max"). */
export const SEO_CACHE_TAG = "seo";

const REVALIDATE_SECONDS = 300;

async function fetchPublishedPageSeo(path: string): Promise<SeoPage | null> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("seo_pages")
      .select("*")
      .eq("path", path)
      .eq("status", "published")
      .maybeSingle();

    if (error) return null;
    return (data as SeoPage | null) ?? null;
  } catch {
    return null;
  }
}

async function fetchSiteSettings(): Promise<SeoSiteSettings | null> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("seo_site_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();

    if (error) return null;
    return (data as SeoSiteSettings | null) ?? null;
  } catch {
    return null;
  }
}

async function fetchEnabledRedirects(): Promise<SeoRedirect[]> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("seo_redirects")
      .select("*")
      .eq("enabled", true)
      .order("from_path", { ascending: true });

    if (error || !data) return [];
    return data as SeoRedirect[];
  } catch {
    return [];
  }
}

/**
 * Published SEO row for a public path.
 * Cached and tagged with `seo` for on-demand revalidation after publish.
 * Returns null on miss or any DB/config error (callers keep code defaults).
 */
export async function getPublishedPageSeo(
  path: string,
): Promise<SeoPage | null> {
  const cached = unstable_cache(
    async () => fetchPublishedPageSeo(path),
    ["seo-page", path],
    { revalidate: REVALIDATE_SECONDS, tags: [SEO_CACHE_TAG] },
  );
  return cached();
}

export async function getSiteSettings(): Promise<SeoSiteSettings | null> {
  const cached = unstable_cache(
    async () => fetchSiteSettings(),
    ["seo-site-settings"],
    { revalidate: REVALIDATE_SECONDS, tags: [SEO_CACHE_TAG] },
  );
  return cached();
}

export async function getEnabledRedirects(): Promise<SeoRedirect[]> {
  const cached = unstable_cache(
    async () => fetchEnabledRedirects(),
    ["seo-redirects-enabled"],
    { revalidate: REVALIDATE_SECONDS, tags: [SEO_CACHE_TAG] },
  );
  return cached();
}
