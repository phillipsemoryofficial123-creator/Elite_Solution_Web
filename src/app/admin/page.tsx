import type { Metadata } from "next";
import Link from "next/link";
import { DataBadge } from "@/components/admin/data-badge";
import { EmptyState } from "@/components/admin/empty-state";
import { StatusPill } from "@/components/admin/status-pill";
import { getSeoSession } from "@/lib/seo/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import type {
  SeoAudit,
  SeoAuditIssue,
  SeoGoogleConnection,
  SeoGoogleSnapshot,
} from "@/lib/seo/types";

export const metadata: Metadata = {
  title: "Dashboard",
};

const GSC_METRICS = [
  { label: "Clicks", key: "clicks" },
  { label: "Impressions", key: "impressions" },
  { label: "Avg. CTR", key: "ctr" },
  { label: "Avg. Position", key: "position" },
] as const;

type GscMetricKey = (typeof GSC_METRICS)[number]["key"];

function readNumber(
  payload: Record<string, unknown>,
  key: GscMetricKey,
): number | null {
  const direct = payload[key];
  if (typeof direct === "number" && Number.isFinite(direct)) return direct;

  const totals = payload.totals;
  if (totals && typeof totals === "object" && !Array.isArray(totals)) {
    const nested = (totals as Record<string, unknown>)[key];
    if (typeof nested === "number" && Number.isFinite(nested)) return nested;
  }

  return null;
}

function formatMetric(key: GscMetricKey, value: number | null): string {
  if (value == null) return "—";
  if (key === "ctr") {
    const pct = value <= 1 ? value * 100 : value;
    return `${pct.toFixed(2)}%`;
  }
  if (key === "position") return value.toFixed(1);
  return Math.round(value).toLocaleString();
}

async function loadDashboardData(): Promise<
  | {
      ok: true;
      gscConnection: SeoGoogleConnection | null;
      latestSnapshot: SeoGoogleSnapshot | null;
      latestAudit: SeoAudit | null;
      openIssues: SeoAuditIssue[];
    }
  | { ok: false; error: string }
> {
  try {
    const client = createAdminClient();

    const [connRes, snapRes, auditRes] = await Promise.all([
      client
        .from("seo_google_connections")
        .select("*")
        .eq("provider", "gsc")
        .maybeSingle(),
      client
        .from("seo_google_snapshots")
        .select("*")
        .eq("provider", "gsc")
        .order("metric_date", { ascending: false })
        .limit(1)
        .maybeSingle(),
      client
        .from("seo_audits")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

    if (connRes.error) return { ok: false, error: connRes.error.message };
    if (snapRes.error) return { ok: false, error: snapRes.error.message };
    if (auditRes.error) return { ok: false, error: auditRes.error.message };

    const latestAudit = (auditRes.data as SeoAudit | null) ?? null;
    let openIssues: SeoAuditIssue[] = [];

    if (latestAudit) {
      const issuesRes = await client
        .from("seo_audit_issues")
        .select("*")
        .eq("audit_id", latestAudit.id)
        .in("severity", ["critical", "high"])
        .order("created_at", { ascending: false })
        .limit(8);
      if (!issuesRes.error && issuesRes.data) {
        openIssues = issuesRes.data as SeoAuditIssue[];
      }
    }

    return {
      ok: true,
      gscConnection: (connRes.data as SeoGoogleConnection | null) ?? null,
      latestSnapshot: (snapRes.data as SeoGoogleSnapshot | null) ?? null,
      latestAudit,
      openIssues,
    };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "Supabase admin client unavailable.",
    };
  }
}

export default async function AdminDashboardPage() {
  const session = await getSeoSession();
  const data = await loadDashboardData();

  const gscConnected =
    data.ok && data.gscConnection?.status === "connected";
  const payload =
    data.ok && data.latestSnapshot?.payload
      ? data.latestSnapshot.payload
      : null;

  const recommendations: string[] = [];
  if (!data.ok) {
    recommendations.push(
      "Dashboard could not load live data. Check Supabase keys and refresh.",
    );
  } else {
    if (!gscConnected) {
      recommendations.push(
        "Connect Google Search Console under Integrations to show live metrics.",
      );
    } else if (!data.latestSnapshot) {
      recommendations.push(
        "GSC is connected but no snapshots exist yet — run a sync when Phase 7 jobs are available.",
      );
    }
    if (!data.latestAudit) {
      recommendations.push("Run a site audit from Audits to crawl for technical SEO issues.");
    } else if (data.openIssues.length > 0) {
      recommendations.push(
        `Review ${data.openIssues.length} critical/high issue(s) from the latest audit.`,
      );
    }
    if (data.gscConnection?.status === "error") {
      recommendations.push(
        `Fix GSC connection error: ${data.gscConnection.last_error ?? "unknown"}.`,
      );
    }
  }

  return (
    <div>
      <header className="admin-page-header">
        <div>
          <p className="admin-eyebrow">Overview</p>
          <h1>Dashboard</h1>
          <p>
            Welcome{session?.email ? `, ${session.email}` : ""}. Metrics appear
            only from stored Google snapshots — never invented.
          </p>
        </div>
      </header>

      {!data.ok ? (
        <EmptyState
          title="Live data is disconnected"
          description="The dashboard is available. Connect Supabase or refresh to load stored metrics."
        />
      ) : null}

      <section className="admin-section" aria-labelledby="gsc-heading">
        <div className="admin-card__header" style={{ marginBottom: 12 }}>
          <h2 id="gsc-heading">Search Console</h2>
          <DataBadge status={gscConnected ? "live" : "disconnected"} />
        </div>
        <div className="admin-grid admin-grid--4">
          {GSC_METRICS.map((metric) => {
            const value =
              gscConnected && payload
                ? readNumber(payload, metric.key)
                : null;
            return (
              <article key={metric.key} className="admin-card">
                <p className="admin-card__label">{metric.label}</p>
                <p className="admin-card__value">
                  {gscConnected ? formatMetric(metric.key, value) : "—"}
                </p>
                <p className="admin-card__meta">
                  <DataBadge
                    status={gscConnected ? "live" : "disconnected"}
                  />
                  {gscConnected && data.ok && data.latestSnapshot ? (
                    <span style={{ marginLeft: 8 }}>
                      {data.latestSnapshot.metric_date}
                    </span>
                  ) : null}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="admin-section" aria-labelledby="audit-heading">
        <h2 id="audit-heading">Latest audit</h2>
        <div className="admin-card">
          <div className="admin-card__header">
            <p className="admin-card__label" style={{ margin: 0 }}>
              Site crawl
            </p>
            {data.ok && data.latestAudit ? (
              <StatusPill status={data.latestAudit.status} />
            ) : (
              <DataBadge status="disconnected" />
            )}
          </div>
          {!data.ok || !data.latestAudit ? (
            <p className="admin-card__meta">
              No audits yet. Run a crawl from Audits.
            </p>
          ) : (
            <p className="admin-card__meta">
              {data.latestAudit.finished_at
                ? `Finished ${new Date(data.latestAudit.finished_at).toLocaleString()}`
                : `Created ${new Date(data.latestAudit.created_at).toLocaleString()}`}
            </p>
          )}
          <div className="admin-grid admin-grid--3" style={{ marginTop: 16 }}>
            <div>
              <p className="admin-card__label">Pages crawled</p>
              <p className="admin-card__value" style={{ fontSize: 22 }}>
                {data.ok && data.latestAudit
                  ? data.latestAudit.pages_crawled
                  : "—"}
              </p>
            </div>
            <div>
              <p className="admin-card__label">Issues found</p>
              <p className="admin-card__value" style={{ fontSize: 22 }}>
                {data.ok && data.latestAudit
                  ? data.latestAudit.issues_found
                  : "—"}
              </p>
            </div>
            <div>
              <p className="admin-card__label">Status</p>
              <p className="admin-card__value" style={{ fontSize: 22 }}>
                {data.ok && data.latestAudit
                  ? data.latestAudit.status
                  : "Idle"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="admin-section" aria-labelledby="actions-heading">
        <h2 id="actions-heading">Recommended actions</h2>
        <div className="admin-card">
          {recommendations.length === 0 ? (
            <p className="admin-card__meta">No open recommendations.</p>
          ) : (
            <ul className="admin-list">
              {recommendations.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
          {data.ok && data.openIssues.length > 0 ? (
            <ul className="admin-list" style={{ marginTop: 14 }}>
              {data.openIssues.map((issue) => (
                <li key={issue.id}>
                  <strong>{issue.severity}</strong> · {issue.code} · {issue.url}
                  <div className="admin-card__meta">{issue.message}</div>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </section>

      <section className="admin-section" aria-labelledby="quick-heading">
        <h2 id="quick-heading">Modules</h2>
        <div className="admin-grid admin-grid--3">
          {[
            { title: "Pages", href: "/admin/pages", blurb: "Meta, canonicals, scores" },
            { title: "Tools", href: "/admin/tools", blurb: "Redirects, robots, CSV" },
            { title: "Integrations", href: "/admin/integrations", blurb: "GSC / GA4" },
          ].map((item) => (
            <Link key={item.href} href={item.href} className="admin-card">
              <p className="admin-card__label">{item.title}</p>
              <p className="admin-card__meta">{item.blurb}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
