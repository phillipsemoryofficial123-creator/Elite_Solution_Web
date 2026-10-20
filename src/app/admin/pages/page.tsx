import type { Metadata } from "next";
import { listPages } from "@/lib/seo/actions";
import { canMutateContent, getSeoSession } from "@/lib/seo/auth";
import { PagesTable } from "@/components/admin/pages-table";
import { EmptyState } from "@/components/admin/empty-state";

export const metadata: Metadata = {
  title: "Pages",
};

export default async function AdminPagesPage() {
  const session = await getSeoSession();
  const result = await listPages({ sort: "path", direction: "asc" });

  return (
    <div>
      <header className="admin-page-header">
        <div>
          <p className="admin-eyebrow">Content</p>
          <h1>Pages</h1>
          <p>
            Manage SEO fields for static and service pages — titles, meta
            descriptions, canonicals, and scores.
          </p>
        </div>
        {canMutateContent(session?.role) ? (
          <span className="admin-status-pill admin-status-pill--muted">
            {result.ok ? `${result.data.length} pages` : "Unavailable"}
          </span>
        ) : null}
      </header>

      {!result.ok ? (
        <EmptyState
          title="Could not load pages"
          description={result.error}
        />
      ) : result.data.length === 0 ? (
        <EmptyState
          title="No pages in seo_pages"
          description="Seed known paths into Supabase, then refresh. Public routes stay unchanged while you edit SEO overrides."
        />
      ) : (
        <PagesTable pages={result.data} />
      )}
    </div>
  );
}
