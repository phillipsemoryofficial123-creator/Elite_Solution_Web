import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPage } from "@/lib/seo/actions";
import { canMutateContent, getSeoSession } from "@/lib/seo/auth";
import { PageEditor } from "@/components/admin/page-editor";
import { EmptyState } from "@/components/admin/empty-state";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Edit page SEO",
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminPageDetailPage({ params }: PageProps) {
  const { id } = await params;
  const session = await getSeoSession();
  const result = await getPage(id);

  if (!result.ok) {
    if (result.error === "Page not found.") notFound();
    return (
      <div>
        <header className="admin-page-header">
          <div>
            <p className="admin-eyebrow">Content</p>
            <h1>Page SEO</h1>
          </div>
          <Link href="/admin/pages" className="admin-btn admin-btn--ghost">
            Back to pages
          </Link>
        </header>
        <EmptyState title="Unable to load page" description={result.error} />
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <Link href="/admin/pages" className="admin-btn admin-btn--ghost">
          ← Pages
        </Link>
      </div>
      <PageEditor
        page={result.data.page}
        revisions={result.data.revisions}
        siteOrigin={site.website}
        canEdit={canMutateContent(session?.role)}
      />
    </div>
  );
}
