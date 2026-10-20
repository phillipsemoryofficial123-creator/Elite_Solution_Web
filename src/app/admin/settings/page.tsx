import type { Metadata } from "next";
import { getSettings } from "@/lib/seo/actions";
import { canManageSettings, getSeoSession } from "@/lib/seo/auth";
import { SettingsForm } from "@/components/admin/settings-form";
import { EmptyState } from "@/components/admin/empty-state";

export const metadata: Metadata = {
  title: "Settings",
};

export default async function AdminSettingsPage() {
  const session = await getSeoSession();
  const canManage = canManageSettings(session?.role);
  const result = await getSettings();

  return (
    <div>
      <header className="admin-page-header">
        <div>
          <p className="admin-eyebrow">Site</p>
          <h1>Settings</h1>
          <p>
            Site-wide SEO defaults — robots.txt, sitemap options, meta templates,
            and crawl limits.
          </p>
        </div>
      </header>

      {!canManage ? (
        <div className="admin-empty" style={{ marginBottom: 16 }}>
          <h2>View only</h2>
          <p>
            Your role ({session?.role ?? "none"}) can browse settings but not
            change them. Owners and admins can edit.
          </p>
        </div>
      ) : null}

      {!result.ok ? (
        <EmptyState title="Could not load settings" description={result.error} />
      ) : (
        <SettingsForm settings={result.data} canManage={canManage} />
      )}
    </div>
  );
}
