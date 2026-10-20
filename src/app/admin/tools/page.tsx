import type { Metadata } from "next";
import {
  getSettings,
  listPages,
  listRedirects,
} from "@/lib/seo/actions";
import {
  canManageSettings,
  canMutateContent,
  getSeoSession,
} from "@/lib/seo/auth";
import { ToolsPanel } from "@/components/admin/tools-panel";
import { EmptyState } from "@/components/admin/empty-state";

export const metadata: Metadata = {
  title: "Tools",
};

export default async function AdminToolsPage() {
  const session = await getSeoSession();
  const [redirectsResult, pagesResult, settingsResult] = await Promise.all([
    listRedirects(),
    listPages(),
    getSettings(),
  ]);

  const hardFail =
    !redirectsResult.ok && !pagesResult.ok && !settingsResult.ok;

  return (
    <div>
      <header className="admin-page-header">
        <div>
          <p className="admin-eyebrow">Utilities</p>
          <h1>Tools</h1>
          <p>
            Redirects, robots, sitemap inclusion, meta templates, bulk CSV, and
            structured data helpers.
          </p>
        </div>
      </header>

      {hardFail ? (
        <EmptyState
          title="Tools unavailable"
          description={
            redirectsResult.ok
              ? pagesResult.ok
                ? settingsResult.error
                : pagesResult.error
              : redirectsResult.error
          }
        />
      ) : (
        <ToolsPanel
          redirects={redirectsResult.ok ? redirectsResult.data : []}
          pages={pagesResult.ok ? pagesResult.data : []}
          settings={settingsResult.ok ? settingsResult.data : null}
          canEdit={canMutateContent(session?.role)}
          canManageSettings={canManageSettings(session?.role)}
        />
      )}
    </div>
  );
}
