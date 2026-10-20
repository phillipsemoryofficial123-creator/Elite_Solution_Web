import type { Metadata } from "next";
import { IntegrationsPanel } from "@/components/admin/integrations-panel";
import { EmptyState } from "@/components/admin/empty-state";
import { canManageSettings, getSeoSession } from "@/lib/seo/auth";
import { isGoogleOAuthConfigured } from "@/lib/seo/google/oauth";
import { listPublicConnections } from "@/lib/seo/google/tokens";
import type { SeoGoogleConnectionPublic } from "@/lib/seo/types";

export const metadata: Metadata = {
  title: "Integrations",
};

type SearchParams = Promise<{
  connected?: string;
  disconnected?: string;
  error?: string;
}>;

export default async function AdminIntegrationsPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const session = await getSeoSession();
  const params = searchParams ? await searchParams : {};
  const oauthConfigured = isGoogleOAuthConfigured();

  let connections: SeoGoogleConnectionPublic[] = [];
  let loadError: string | null = null;
  try {
    connections = await listPublicConnections();
  } catch (error) {
    loadError =
      error instanceof Error
        ? error.message
        : "Could not load Google connections.";
  }

  let flash: { type: "ok" | "error"; text: string } | null = null;
  if (params.error) {
    flash = {
      type: "error",
      text:
        params.error === "not_configured"
          ? "Google OAuth env vars are not configured."
          : params.error,
    };
  } else if (params.connected) {
    flash = {
      type: "ok",
      text: `Connected ${params.connected.toUpperCase()}. Save the site URL / property ID, then sync.`,
    };
  } else if (params.disconnected) {
    flash = {
      type: "ok",
      text: `Disconnected ${params.disconnected.toUpperCase()}.`,
    };
  }

  return (
    <div>
      <header className="admin-page-header">
        <div>
          <p className="admin-eyebrow">Connections</p>
          <h1>Integrations</h1>
          <p>
            Connect Google properties so the dashboard can show live metrics.
            Until then, cards stay Disconnected — never Sample.
          </p>
        </div>
      </header>

      {loadError ? (
        <EmptyState title="Integrations unavailable" description={loadError} />
      ) : (
        <IntegrationsPanel
          oauthConfigured={oauthConfigured}
          connections={connections}
          canManage={canManageSettings(session?.role)}
          flash={flash}
        />
      )}
    </div>
  );
}
