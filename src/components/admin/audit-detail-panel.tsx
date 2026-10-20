"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  exportIssuesCsv,
  updateIssueResolution,
} from "@/lib/seo/audit-actions";
import type {
  SeoAudit,
  SeoAuditIssue,
  SeoAuditIssueSeverity,
  SeoIssueResolution,
} from "@/lib/seo/types";
import { EmptyState } from "@/components/admin/empty-state";
import { StatusPill } from "@/components/admin/status-pill";

type AuditDetailPanelProps = {
  audit: SeoAudit;
  issues: SeoAuditIssue[];
  canEdit: boolean;
};

const SEVERITIES: Array<SeoAuditIssueSeverity | "all"> = [
  "all",
  "critical",
  "high",
  "medium",
  "low",
  "info",
];

const RESOLUTIONS: Array<SeoIssueResolution | "all"> = [
  "all",
  "open",
  "acknowledged",
  "resolved",
  "ignored",
];

function severityClass(severity: SeoAuditIssueSeverity): string {
  switch (severity) {
    case "critical":
      return "admin-severity admin-severity--critical";
    case "high":
      return "admin-severity admin-severity--high";
    case "medium":
      return "admin-severity admin-severity--medium";
    case "low":
      return "admin-severity admin-severity--low";
    default:
      return "admin-severity admin-severity--info";
  }
}

function formatWhen(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString();
}

export function AuditDetailPanel({
  audit,
  issues,
  canEdit,
}: AuditDetailPanelProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [severity, setSeverity] = useState<SeoAuditIssueSeverity | "all">(
    "all",
  );
  const [resolution, setResolution] = useState<SeoIssueResolution | "all">(
    "all",
  );
  const [code, setCode] = useState("");
  const [search, setSearch] = useState("");

  const codes = useMemo(() => {
    return Array.from(new Set(issues.map((i) => i.code))).sort();
  }, [issues]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return issues.filter((issue) => {
      if (severity !== "all" && issue.severity !== severity) return false;
      if (resolution !== "all" && issue.resolution !== resolution) return false;
      if (code && issue.code !== code) return false;
      if (!q) return true;
      const haystack = [issue.url, issue.message, issue.code]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [issues, severity, resolution, code, search]);

  const bySeverity = useMemo(() => {
    const summary = audit.summary as
      | { by_severity?: Record<string, number> }
      | null;
    return summary?.by_severity ?? null;
  }, [audit.summary]);

  function handleResolution(issueId: string, next: SeoIssueResolution) {
    if (!canEdit || pending) return;
    setError(null);
    setMessage(null);
    startTransition(async () => {
      const result = await updateIssueResolution(issueId, next);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setMessage(`Updated resolution to ${next}.`);
      router.refresh();
    });
  }

  function handleExport() {
    setError(null);
    setMessage(null);
    startTransition(async () => {
      const result = await exportIssuesCsv(audit.id);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      const blob = new Blob([result.data], {
        type: "text/csv;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `seo-audit-${audit.id}-issues.csv`;
      a.click();
      URL.revokeObjectURL(url);
      setMessage("CSV downloaded.");
    });
  }

  return (
    <div>
      <header className="admin-page-header">
        <div>
          <p className="admin-eyebrow">
            <Link href="/admin/audits">Audits</Link> / detail
          </p>
          <h1>Audit results</h1>
          <p>
            Observed issues only — labeled from the live crawl. Status:{" "}
            <StatusPill status={audit.status} />
          </p>
        </div>
        <button
          type="button"
          className="admin-btn admin-btn--blue"
          disabled={pending}
          onClick={handleExport}
        >
          Export CSV
        </button>
      </header>

      {error ? <p className="admin-flash admin-flash--error">{error}</p> : null}
      {message ? <p className="admin-flash admin-flash--ok">{message}</p> : null}

      <article className="admin-card" style={{ marginBottom: 20 }}>
        <div className="admin-grid admin-grid--4">
          <div>
            <p className="admin-card__label">Started</p>
            <p className="admin-card__meta">
              {formatWhen(audit.started_at ?? audit.created_at)}
            </p>
          </div>
          <div>
            <p className="admin-card__label">Finished</p>
            <p className="admin-card__meta">{formatWhen(audit.finished_at)}</p>
          </div>
          <div>
            <p className="admin-card__label">Pages crawled</p>
            <p className="admin-card__value" style={{ fontSize: 22 }}>
              {audit.pages_crawled}
            </p>
          </div>
          <div>
            <p className="admin-card__label">Issues found</p>
            <p className="admin-card__value" style={{ fontSize: 22 }}>
              {audit.issues_found}
            </p>
          </div>
        </div>
        {bySeverity ? (
          <p className="admin-card__meta" style={{ marginTop: 12 }}>
            Severity counts — critical: {bySeverity.critical ?? 0}, high:{" "}
            {bySeverity.high ?? 0}, medium: {bySeverity.medium ?? 0}, low:{" "}
            {bySeverity.low ?? 0}, info: {bySeverity.info ?? 0}
          </p>
        ) : null}
        {audit.error ? (
          <p className="admin-flash admin-flash--error" style={{ marginTop: 12 }}>
            {audit.error}
          </p>
        ) : null}
      </article>

      <div
        className="admin-toolbar"
        style={{ marginBottom: 16, display: "flex", flexWrap: "wrap", gap: 12 }}
      >
        <div className="admin-field" style={{ margin: 0 }}>
          <label htmlFor="audit-filter-severity">Severity</label>
          <select
            id="audit-filter-severity"
            value={severity}
            onChange={(e) =>
              setSeverity(e.target.value as SeoAuditIssueSeverity | "all")
            }
          >
            {SEVERITIES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="admin-field" style={{ margin: 0 }}>
          <label htmlFor="audit-filter-resolution">Resolution</label>
          <select
            id="audit-filter-resolution"
            value={resolution}
            onChange={(e) =>
              setResolution(e.target.value as SeoIssueResolution | "all")
            }
          >
            {RESOLUTIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <div className="admin-field" style={{ margin: 0 }}>
          <label htmlFor="audit-filter-code">Code</label>
          <select
            id="audit-filter-code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          >
            <option value="">all</option>
            {codes.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="admin-field" style={{ margin: 0, flex: 1, minWidth: 180 }}>
          <label htmlFor="audit-filter-search">Search</label>
          <input
            id="audit-filter-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="URL, message, code…"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No issues match"
          description={
            issues.length === 0
              ? "This audit recorded no issues."
              : "Try clearing filters."
          }
        />
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Severity</th>
                <th>Code</th>
                <th>URL</th>
                <th>Message</th>
                <th>Resolution</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((issue) => (
                <tr key={issue.id}>
                  <td>
                    <span className={severityClass(issue.severity)}>
                      {issue.severity}
                    </span>
                  </td>
                  <td>
                    <code style={{ fontSize: 12 }}>{issue.code}</code>
                  </td>
                  <td style={{ maxWidth: 220, wordBreak: "break-all" }}>
                    <a href={issue.url} target="_blank" rel="noreferrer">
                      {issue.url}
                    </a>
                  </td>
                  <td style={{ maxWidth: 320 }}>{issue.message}</td>
                  <td>
                    {canEdit ? (
                      <select
                        value={issue.resolution}
                        disabled={pending}
                        aria-label={`Resolution for ${issue.code}`}
                        onChange={(e) =>
                          handleResolution(
                            issue.id,
                            e.target.value as SeoIssueResolution,
                          )
                        }
                      >
                        {RESOLUTIONS.filter((r) => r !== "all").map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    ) : (
                      issue.resolution
                    )}
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
