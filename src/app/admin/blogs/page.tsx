import type { Metadata } from "next";
import { listBlogOverrides, listPages } from "@/lib/seo/actions";
import { canMutateContent, getSeoSession } from "@/lib/seo/auth";
import { pathForBlog } from "@/lib/seo/paths";
import { blogsPage } from "@/data/blogs-page";
import {
  BlogSeoPanel,
  type BlogSeoRow,
} from "@/components/admin/blog-seo-panel";
import { EmptyState } from "@/components/admin/empty-state";
import type { SeoBlogOverride, SeoPage } from "@/lib/seo/types";

export const metadata: Metadata = {
  title: "Blogs",
};

export default async function AdminBlogsPage() {
  const session = await getSeoSession();
  const [overridesResult, pagesResult] = await Promise.all([
    listBlogOverrides(),
    listPages({ page_type: "blog" }),
  ]);

  if (!overridesResult.ok && !pagesResult.ok) {
    return (
      <div>
        <header className="admin-page-header">
          <div>
            <p className="admin-eyebrow">Content</p>
            <h1>Blogs</h1>
          </div>
        </header>
        <EmptyState
          title="Could not load blog SEO data"
          description={overridesResult.ok ? pagesResult.error : overridesResult.error}
        />
      </div>
    );
  }

  const overrides = overridesResult.ok ? overridesResult.data : [];
  const pages = pagesResult.ok ? pagesResult.data : [];
  const overrideBySlug = new Map<string, SeoBlogOverride>(
    overrides.map((row) => [row.slug, row]),
  );
  const pageByPath = new Map<string, SeoPage>(
    pages.map((row) => [row.path, row]),
  );

  const rows: BlogSeoRow[] = blogsPage.posts.map((post) => {
    const path = pathForBlog(post.slug);
    return {
      slug: post.slug,
      codeTitle: post.title,
      path,
      override: overrideBySlug.get(post.slug) ?? null,
      page: pageByPath.get(path) ?? null,
    };
  });

  return (
    <div>
      <header className="admin-page-header">
        <div>
          <p className="admin-eyebrow">Content</p>
          <h1>Blogs</h1>
          <p>
            Override blog SEO fields (title, meta, OG) without changing public
            blog URLs or migrating post bodies into the database.
          </p>
        </div>
        <span className="admin-status-pill admin-status-pill--muted">
          {rows.length} posts from code
        </span>
      </header>

      {!overridesResult.ok ? (
        <p className="admin-flash admin-flash--warn">
          Blog overrides unavailable: {overridesResult.error}. Showing code posts
          with any matching seo_pages rows.
        </p>
      ) : null}

      <BlogSeoPanel
        rows={rows}
        canEdit={canMutateContent(session?.role)}
      />
    </div>
  );
}
