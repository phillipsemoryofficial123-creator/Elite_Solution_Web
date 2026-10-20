"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  runGoogleSync,
  saveGoogleConnectionFields,
} from "@/lib/seo/google/actions";
import type {
  SeoGoogleConnectionPublic,
  SeoGoogleProvider,
} from "@/lib/seo/types";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { DataBadge } from "@/components/admin/data-badge";

type IntegrationsPanelProps = {
  oauthConfigured: boolean;
  connections: SeoGoogleConnectionPublic[];
  canManage: boolean;
  flash?: { type: "ok" | "error"; text: string } | null;
};

const PROVIDERS: Array<{
  id: SeoGoogleProvider;
  name: string;
  blurb: string;
  field: "site_url" | "property_id";
  fieldLabel: string;
  fieldHint: string;
}> = [
  {
    id: "gsc",
    name: "Google Search Console",
    blurb: "Clicks, impressions, CTR, and query reports.",
    field: "site_url",
    fieldLabel: "Site URL",
    fieldHint: "Exact Search Console property, e.g. https://www.elitesolutionusa.com/",
  },
  {
    id: "ga4",
    name: "Google Analytics 4",
    blurb: "Optional traffic context alongside Search Console.",
    field: "property_id",
    fieldLabel: "Property ID",
    fieldHint: "Numeric GA4 property ID, e.g. 123456789",
  },
];

function connectionFor(
  connections: SeoGoogleConnectionPublic[],
  provider: SeoGoogleProvider,
): SeoGoogleConnectionPublic | null {
  return connections.find((c) => c.provider === provider) ?? null;
}

function badgeStatus(
  conn: SeoGoogleConnectionPublic | null,
): "live" | "disconnected" {
  if (conn?.status === "connected" && conn.has_refresh_token) return "live";
  return "disconnected";
}

function statusLabel(conn: SeoGoogleConnectionPublic | null): string {
  if (!conn) return "Disconnected";
  if (!conn.has_refresh_token) return "Disconnected";
  return conn.status;
}

export function IntegrationsPanel({
  oauthConfigured,
  connections,
  canManage,
  flash,
}: IntegrationsPanelProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(
    flash?.type === "error" ? flash.text : null,
  );
  const [message, setMessage] = useState<string | null>(
    flash?.type === "ok" ? flash.text : null,
  );
  const [disconnectProvider, setDisconnectProvider] =
    useState<SeoGoogleProvider | null>(null);
  const [fields, setFields] = useState<
    Record<SeoGoogleProvider, { site_url: string; property_id: string }>
  >(() => {
    const gsc = connectionFor(connections, "gsc");
    const ga4 = connectionFor(connections, "ga4");
    return {
      gsc: {
        site_url: gsc?.site_url ?? "",
        property_id: gsc?.property_id ?? "",
      },
      ga4: {
        site_url: ga4?.site_url ?? "",
        property_id: ga4?.property_id ?? "",
      },
    };
  });

  function run(fn: () => Promise<void>) {
    startTransition(async () => {
      try {
        await fn();
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unexpected error");
        setMessage(null);
      }
    });
  }

  return (
    <div>
      {!oauthConfigured ? (
        <div className="admin-card" style={{ marginBottom: 16 }}>
          <p className="admin-card__label">Google OAuth not configured</p>
          <p className="admin-card__meta">
            Set <code>GOOGLE_OAUTH_CLIENT_ID</code>,{" "}
            <code>GOOGLE_OAUTH_CLIENT_SECRET</code>, and{" "}
            <code>GOOGLE_OAUTH_REDIRECT_URI</code> to enable Connect. Core SEO
            features work without these env vars.
          </p>
        </div>
      ) : null}

      {error ? <p className="admin-flash admin-flash--error">{error}</p> : null}
      {message ? <p className="admin-flash admin-flash--ok">{message}</p> : null}

      <div className="admin-grid admin-grid--2" style={{ marginTop: 8 }}>
        {PROVIDERS.map((provider) => {
          const conn = connectionFor(connections, provider.id);
          const connected = Boolean(conn?.has_refresh_token);
          const value =
            provider.field === "site_url"
              ? fields[provider.id].site_url
              : fields[provider.id].property_id;

          return (
            <article key={provider.id} className="admin-card">
              <div className="admin-card__header">
                <p className="admin-card__label" style={{ margin: 0 }}>
                  {provider.name}
                </p>
                <DataBadge status={badgeStatus(conn)} />
              </div>
              <p className="admin-card__meta">{provider.blurb}</p>
              <p className="admin-card__meta" style={{ marginTop: 8 }}>
                Status: <strong>{statusLabel(conn)}</strong>
              </p>
              <p className="admin-card__meta">
                Last sync:{" "}
                {conn?.last_sync_at
                  ? new Date(conn.last_sync_at).toLocaleString()
                  : "—"}
              </p>
              {conn?.last_error ? (
                <p className="admin-flash admin-flash--error" style={{ marginTop: 8 }}>
                  {conn.last_error}
                </p>
              ) : null}

              <label style={{ display: "block", marginTop: 14 }}>
                {provider.fieldLabel}
                <input
                  value={value}
                  disabled={!canManage || pending}
                  placeholder={provider.fieldHint}
                  onChange={(e) =>
                    setFields((prev) => ({
                      ...prev,
                      [provider.id]: {
                        ...prev[provider.id],
                        [provider.field]: e.target.value,
                      },
                    }))
                  }
                />
              </label>
              <p className="admin-card__meta">{provider.fieldHint}</p>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                  marginTop: 14,
                }}
              >
                {connected ? (
                  <>
                    <button
                      type="button"
                      className="admin-btn admin-btn--ghost"
                      disabled={!canManage || pending}
                      onClick={() => setDisconnectProvider(provider.id)}
                    >
                      Disconnect
                    </button>
                    <button
                      type="button"
                      className="admin-btn admin-btn--blue"
                      disabled={!canManage || pending}
                      onClick={() => {
                        run(async () => {
                          const save = await saveGoogleConnectionFields({
                            provider: provider.id,
                            site_url: fields[provider.id].site_url || null,
                            property_id:
                              fields[provider.id].property_id || null,
                          });
                          if (!save.ok) {
                            setError(save.error);
                            setMessage(null);
                            return;
                          }
                          const sync = await runGoogleSync(provider.id);
                          if (!sync.ok) {
                            setError(sync.error);
                            setMessage(null);
                            return;
                          }
                          if (!sync.data.ok) {
                            setError(
                              sync.data.message ??
                                `Sync skipped: ${sync.data.reason}`,
                            );
                            setMessage(null);
                            return;
                          }
                          setError(null);
                          setMessage(`${provider.name} synced.`);
                        });
                      }}
                    >
                      Sync now
                    </button>
                  </>
                ) : (
                  <a
                    className={`admin-btn admin-btn--primary${
                      !oauthConfigured || !canManage ? " is-disabled" : ""
                    }`}
                    href={
                      oauthConfigured && canManage
                        ? `/api/seo/google/start?provider=${provider.id}`
                        : undefined
                    }
                    aria-disabled={!oauthConfigured || !canManage}
                    onClick={(e) => {
                      if (!oauthConfigured || !canManage) e.preventDefault();
                    }}
                    style={
                      !oauthConfigured || !canManage
                        ? { pointerEvents: "none", opacity: 0.55 }
                        : undefined
                    }
                  >
                    Connect
                  </a>
                )}
                <button
                  type="button"
                  className="admin-btn admin-btn--ghost"
                  disabled={!canManage || pending}
                  onClick={() => {
                    run(async () => {
                      const result = await saveGoogleConnectionFields({
                        provider: provider.id,
                        site_url: fields[provider.id].site_url || null,
                        property_id: fields[provider.id].property_id || null,
                      });
                      if (!result.ok) {
                        setError(result.error);
                        setMessage(null);
                        return;
                      }
                      setError(null);
                      setMessage(`${provider.name} fields saved.`);
                    });
                  }}
                >
                  Save fields
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <p className="admin-card__meta" style={{ marginTop: 16 }}>
        Scheduled sync: <code>POST /api/seo/cron/sync</code> with{" "}
        <code>Authorization: Bearer CRON_SECRET</code>. Missing Google env vars
        return <code>not_configured</code> without breaking core SEO.
      </p>

      <ConfirmDialog
        open={disconnectProvider != null}
        title="Disconnect Google?"
        description="This clears the stored refresh token for this provider. Snapshots already saved are kept."
        confirmLabel="Disconnect"
        danger
        busy={pending}
        onCancel={() => setDisconnectProvider(null)}
        onConfirm={() => {
          if (!disconnectProvider) return;
          run(async () => {
            const response = await fetch("/api/seo/google/disconnect", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ provider: disconnectProvider }),
            });
            const body = (await response.json().catch(() => ({}))) as {
              error?: string;
            };
            setDisconnectProvider(null);
            if (!response.ok) {
              setError(body.error ?? "Disconnect failed.");
              setMessage(null);
              return;
            }
            setError(null);
            setMessage("Disconnected.");
          });
        }}
      />
    </div>
  );
}
