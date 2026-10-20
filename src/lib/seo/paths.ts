import { blogsPage } from "@/data/blogs-page";
import { serviceGroups, services } from "@/data/services";

export type ServicePathGroup = "financial" | "non-financial";

const STATIC_SEO_PATHS = [
  "/",
  "/about",
  "/services",
  "/portfolio",
  "/pricing",
  "/careers",
  "/csr",
  "/blogs",
  "/contact",
] as const;

export function pathForBlog(slug: string): string {
  return `/blogs/${slug}`;
}

export function pathForService(
  group: ServicePathGroup | string,
  slug: string,
): string {
  return `/services/${group}/${slug}`;
}

function groupSlugForService(groupId: "fin" | "non"): ServicePathGroup {
  const meta = serviceGroups.find((g) => g.id === groupId);
  if (!meta) {
    throw new Error(`Unknown service group: ${groupId}`);
  }
  return meta.slug;
}

const servicePaths = services.map((service) =>
  pathForService(groupSlugForService(service.group), service.slug),
);

const blogPaths = blogsPage.posts.map((post) => pathForBlog(post.slug));

/**
 * All known public SEO paths derived from static routes + services + blogs.
 * Used for seeding and as sitemap fallback when the DB is empty/unreachable.
 */
export const KNOWN_SEO_PATHS: readonly string[] = Array.from(
  new Set<string>([...STATIC_SEO_PATHS, ...servicePaths, ...blogPaths]),
);
