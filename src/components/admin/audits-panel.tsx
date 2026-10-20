"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { startAudit } from "@/lib/seo/audit-actions";
import type { SeoAudit } from "@/lib/seo/types";
import { DataBadge } from "@/components/admin/data-badge";
import { EmptyState } from "@/components/admin/empty-state";
import { StatusPill } from "@/components/admin/status-pill";

type AuditsPanelProps = {
  audits: SeoAudit[];
  canRun: boolean;
};

function formatWhen(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString();
}

function summaryCounts(audit: SeoAudit): string {
  const summary = audit.summary;
  if (!summary || typeof summary !== "object") return "—";
  const by = (summary as { by_severity?: Record<string, number> }).by_severity;
  if (!by) return "—";
  const parts = ["critical", "high", "medium", "low", "info"]
    .map((key) => {
      const n = by[key] ?? 0;
      return n > 0 ? `${key}: ${n}` : null;
    })
    .filter(Boolean);
  return parts.length > 0 ? parts.join(" · ") : "none";
}

export function AuditsPanel({ audits, canRun }: AuditsPanelProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const latest = audits[0] ?? null;

  function handleRun() {
    if (!canRun || pending) return;
    setError(null);
    setMessage(null);
    startTransition(async () => {
      const result = await startAudit();
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setMessage(
        `Audit ${result.data.status}: ${result.data.pages_crawled} pages, ${result.data.issues_found} issues.`,
      );
      router.refresh();
      if (result.data.id) {
        router.push(`/admin/audits/${result.data.id}`);
      }
    });
  }

  return (
    <div>
      <header className="admin-page-header">
        <div>
          <p className="admin-eyebrow">Quality</p>
          <h1>Audits</h1>
          <p>
            Crawl the live site for observed SEO issues — missing titles, broken
            links, heading problems, and more. Issues are never invented.
          </p>
        </div>
        <button
          type="button"
          className="admin-btn admin-btn--primary"
          disabled={!canRun || pending}
          onClick={handleRun}
        >
          {pending ? "Running audit…" : "Run audit"}
        </button>
      </header>

      {error ? <p className="admin-flash admin-flash--error">{error}</p> : null}
      {message ? <p className="admin-flash admin-flash--ok">{message}</p> : null}
      {!canRun ? (
        <p className="admin-flash admin-flash--warn">
          Viewers can browse audit history. Editors and above can run audits.
        </p>
      ) : null}

      <article className="admin-card" style={{ marginBottom: 20 }}>
        <div className="admin-card__header">
          <p className="admin-card__label" style={{ margin: 0 }}>
            Latest run
          </p>
          {latest ? (
            <StatusPill status={latest.status} />
          ) : (
            <DataBadge status="disconnected" />
          )}
        </div>
        {!latest ? (
          <p className="admin-card__meta">
            No audit history yet. Run an audit to crawl the site within configured
            limits.
          </p>
        ) : (
          <>
            <p className="admin-card__meta">
              Started {formatWhen(latest.started_at)} · Finished{" "}
              {formatWhen(latest.finished_at)} · Triggered by{" "}
              {latest.triggered_by ?? "—"}
            </p>
            <div className="admin-grid admin-grid--3" style={{ marginTop: 16 }}>
              <div>
                <p className="admin-card__label">Pages crawled</p>
                <p className="admin-card__value" style={{ fontSize: 22 }}>
                  {latest.pages_crawled}
                </p>
              </div>
              <div>
                <p className="admin-card__label">Issues found</p>
                <p className="admin-card__value" style={{ fontSize: 22 }}>
                  {latest.issues_found}
                </p>
              </div>
              <div>
                <p className="admin-card__label">By severity</p>
                <p className="admin-card__meta" style={{ marginTop: 8 }}>
                  {summaryCounts(latest)}
                </p>
              </div>
            </div>
            <p style={{ marginTop: 12 }}>
              <Link
                href={`/admin/audits/${latest.id}`}
                className="admin-btn admin-btn--ghost"
              >
                View issues
              </Link>
            </p>
          </>
        )}
      </article>

      {audits.length === 0 ? (
        <EmptyState
          title="No audits recorded"
          description="Results appear here after a successful crawl."
        />
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Started</th>
                <th>Status</th>
                <th>Pages</th>
                <th>Issues</th>
                <th>Severity mix</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {audits.map((audit) => (
                <tr key={audit.id}>
                  <td>{formatWhen(audit.started_at ?? audit.created_at)}</td>
                  <td>
                    <StatusPill status={audit.status} />
                  </td>
                  <td>{audit.pages_crawled}</td>
                  <td>{audit.issues_found}</td>
                  <td style={{ color: "var(--admin-muted)", fontSize: 13 }}>
                    {summaryCounts(audit)}
                  </td>
                  <td>
                    <Link href={`/admin/audits/${audit.id}`}>Open</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
