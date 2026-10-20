"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  bulkUpdatePages,
  deleteRedirect,
  exportPagesCsv,
  importPagesCsv,
  saveRedirect,
  saveSettings,
} from "@/lib/seo/actions";
import type {
  SeoPage,
  SeoRedirect,
  SeoRedirectStatusCode,
  SeoSiteSettings,
} from "@/lib/seo/types";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { EmptyState } from "@/components/admin/empty-state";
import { StatusPill } from "@/components/admin/status-pill";

type ToolsPanelProps = {
  redirects: SeoRedirect[];
  pages: SeoPage[];
  settings: SeoSiteSettings | null;
  canEdit: boolean;
  canManageSettings: boolean;
};

type TabId =
  | "redirects"
  | "robots"
  | "sitemap"
  | "templates"
  | "csv"
  | "jsonld";

const TABS: Array<{ id: TabId; label: string }> = [
  { id: "redirects", label: "Redirects" },
  { id: "robots", label: "Robots.txt" },
  { id: "sitemap", label: "Sitemap" },
  { id: "templates", label: "Meta templates" },
  { id: "csv", label: "Bulk CSV" },
  { id: "jsonld", label: "Structured data" },
];

export function ToolsPanel({
  redirects,
  pages,
  settings,
  canEdit,
  canManageSettings,
}: ToolsPanelProps) {
  const router = useRouter();
  const [tab, setTab] = useState<TabId>("redirects");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [redirectForm, setRedirectForm] = useState({
    id: "" as string | undefined,
    from_path: "",
    to_url: "",
    status_code: 301 as SeoRedirectStatusCode,
    enabled: true,
  });

  const [robotsTxt, setRobotsTxt] = useState(settings?.robots_txt ?? "");
  const [templatesText, setTemplatesText] = useState(
    JSON.stringify(settings?.meta_templates ?? {}, null, 2),
  );
  const [jsonHelper, setJsonHelper] = useState(
    '{\n  "@context": "https://schema.org",\n  "@type": "Organization",\n  "name": "Elite Solutions USA"\n}',
  );
  const [csvText, setCsvText] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const robotsWarn = /disallow:\s*\/\s*$/im.test(robotsTxt);
  const sitemapRows = useMemo(
    () =>
      pages.map((page) => ({
        path: page.path,
        included: page.include_in_sitemap && page.robots_index,
        status: page.status,
        score: page.seo_score,
      })),
    [pages],
  );

  function flash(okMsg?: string, errMsg?: string) {
    setMessage(okMsg ?? null);
    setError(errMsg ?? null);
  }

  function run(fn: () => Promise<void>) {
    startTransition(async () => {
      try {
        await fn();
        router.refresh();
      } catch (err) {
        flash(undefined, err instanceof Error ? err.message : "Unexpected error");
      }
    });
  }

  return (
    <div>
      <div className="admin-tabs" role="tablist" aria-label="SEO tools">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            className={`admin-tab${tab === item.id ? " is-active" : ""}`}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {error ? <p className="admin-flash admin-flash--error">{error}</p> : null}
      {message ? <p className="admin-flash admin-flash--ok">{message}</p> : null}

      {tab === "redirects" ? (
        <section className="admin-section">
          <h2>Redirects</h2>
          <div className="admin-grid admin-grid--2">
            <form
              className="admin-card admin-form"
              style={{ maxWidth: "none" }}
              onSubmit={(e) => {
                e.preventDefault();
                if (!canEdit) return;
                run(async () => {
                  const result = await saveRedirect({
                    id: redirectForm.id || undefined,
                    from_path: redirectForm.from_path,
                    to_url: redirectForm.to_url,
                    status_code: redirectForm.status_code,
                    enabled: redirectForm.enabled,
                  });
                  if (!result.ok) {
                    flash(undefined, result.error);
                    return;
                  }
                  setRedirectForm({
                    id: undefined,
                    from_path: "",
                    to_url: "",
                    status_code: 301,
                    enabled: true,
                  });
                  flash("Redirect saved.");
                });
              }}
            >
              <div className="admin-field">
                <label htmlFor="from_path">From path</label>
                <input
                  id="from_path"
                  value={redirectForm.from_path}
                  disabled={!canEdit || pending}
                  onChange={(e) =>
                    setRedirectForm((f) => ({ ...f, from_path: e.target.value }))
                  }
                  placeholder="/old-path"
                />
              </div>
              <div className="admin-field">
                <label htmlFor="to_url">To URL / path</label>
                <input
                  id="to_url"
                  value={redirectForm.to_url}
                  disabled={!canEdit || pending}
                  onChange={(e) =>
                    setRedirectForm((f) => ({ ...f, to_url: e.target.value }))
                  }
                  placeholder="/new-path"
                />
              </div>
              <div className="admin-field">
                <label htmlFor="status_code">Status</label>
                <select
                  id="status_code"
                  value={redirectForm.status_code}
                  disabled={!canEdit || pending}
                  onChange={(e) =>
                    setRedirectForm((f) => ({
                      ...f,
                      status_code: Number(e.target.value) as SeoRedirectStatusCode,
                    }))
                  }
                >
                  <option value={301}>301</option>
                  <option value={302}>302</option>
                  <option value={307}>307</option>
                  <option value={308}>308</option>
                </select>
              </div>
              <label className="admin-check">
                <input
                  type="checkbox"
                  checked={redirectForm.enabled}
                  disabled={!canEdit || pending}
                  onChange={(e) =>
                    setRedirectForm((f) => ({ ...f, enabled: e.target.checked }))
                  }
                />
                Enabled
              </label>
              {canEdit ? (
                <button
                  type="submit"
                  className="admin-btn admin-btn--primary"
                  disabled={pending}
                >
                  {redirectForm.id ? "Update redirect" : "Add redirect"}
                </button>
              ) : null}
            </form>

            <div className="admin-table-wrap">
              {redirects.length === 0 ? (
                <EmptyState
                  title="No redirects"
                  description="Add a from → to rule. Loop prevention runs on save."
                />
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>From</th>
                      <th>To</th>
                      <th>Code</th>
                      <th>On</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {redirects.map((row) => (
                      <tr key={row.id}>
                        <td>{row.from_path}</td>
                        <td>{row.to_url}</td>
                        <td>{row.status_code}</td>
                        <td>
                          <StatusPill
                            status={row.enabled ? "published" : "unpublished"}
                          />
                        </td>
                        <td>
                          <div className="admin-page-editor__actions">
                            <button
                              type="button"
                              className="admin-btn admin-btn--ghost"
                              disabled={!canEdit || pending}
                              onClick={() =>
                                setRedirectForm({
                                  id: row.id,
                                  from_path: row.from_path,
                                  to_url: row.to_url,
                                  status_code: row.status_code,
                                  enabled: row.enabled,
                                })
                              }
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="admin-btn admin-btn--danger"
                              disabled={!canEdit || pending}
                              onClick={() => setDeleteId(row.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </section>
      ) : null}

      {tab === "robots" ? (
        <section className="admin-section">
          <h2>robots.txt</h2>
          {robotsWarn ? (
            <p className="admin-flash admin-flash--warn">
              Warning: this robots.txt contains <code>Disallow: /</code>, which
              blocks all crawlers.
            </p>
          ) : null}
          <div className="admin-card">
            <div className="admin-field">
              <label htmlFor="robots">File contents</label>
              <textarea
                id="robots"
                rows={12}
                value={robotsTxt}
                disabled={!canManageSettings || pending}
                onChange={(e) => setRobotsTxt(e.target.value)}
                spellCheck={false}
              />
            </div>
            {canManageSettings ? (
              <button
                type="button"
                className="admin-btn admin-btn--primary"
                disabled={pending}
                onClick={() =>
                  run(async () => {
                    const result = await saveSettings({ robots_txt: robotsTxt });
                    if (!result.ok) {
                      flash(undefined, result.error);
                      return;
                    }
                    flash("robots.txt saved.");
                  })
                }
              >
                Save robots.txt
              </button>
            ) : (
              <p className="admin-card__meta">Owners/admins can edit robots.</p>
            )}
          </div>
        </section>
      ) : null}

      {tab === "sitemap" ? (
        <section className="admin-section">
          <h2>Sitemap inclusion</h2>
          <p className="admin-card__meta" style={{ marginBottom: 12 }}>
            Included when status is published, robots_index is true, and
            include_in_sitemap is true (enforced by public sitemap.ts).
          </p>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Path</th>
                  <th>Likely included</th>
                  <th>Status</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {sitemapRows.map((row) => (
                  <tr key={row.path}>
                    <td>{row.path}</td>
                    <td>{row.included && row.status === "published" ? "Yes" : "No"}</td>
                    <td>
                      <StatusPill status={row.status} />
                    </td>
                    <td>{row.score ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {tab === "templates" ? (
        <section className="admin-section">
          <h2>Meta templates</h2>
          <div className="admin-card">
            <div className="admin-field">
              <label htmlFor="templates">meta_templates JSON</label>
              <textarea
                id="templates"
                rows={14}
                value={templatesText}
                disabled={!canManageSettings || pending}
                onChange={(e) => setTemplatesText(e.target.value)}
                spellCheck={false}
              />
            </div>
            {canManageSettings ? (
              <button
                type="button"
                className="admin-btn admin-btn--primary"
                disabled={pending}
                onClick={() =>
                  run(async () => {
                    let parsed: Record<string, unknown>;
                    try {
                      parsed = JSON.parse(templatesText) as Record<string, unknown>;
                    } catch {
                      flash(undefined, "Templates must be valid JSON.");
                      return;
                    }
                    const result = await saveSettings({ meta_templates: parsed });
                    if (!result.ok) {
                      flash(undefined, result.error);
                      return;
                    }
                    flash("Meta templates saved.");
                  })
                }
              >
                Save templates
              </button>
            ) : null}
          </div>
        </section>
      ) : null}

      {tab === "csv" ? (
        <section className="admin-section">
          <h2>Bulk CSV import / export</h2>
          <div className="admin-grid admin-grid--2">
            <div className="admin-card">
              <p className="admin-card__label">Export</p>
              <button
                type="button"
                className="admin-btn admin-btn--blue"
                disabled={pending}
                onClick={() =>
                  run(async () => {
                    const result = await exportPagesCsv();
                    if (!result.ok) {
                      flash(undefined, result.error);
                      return;
                    }
                    const blob = new Blob([result.data], {
                      type: "text/csv;charset=utf-8",
                    });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "seo-pages.csv";
                    a.click();
                    URL.revokeObjectURL(url);
                    flash("CSV exported.");
                  })
                }
              >
                Download pages CSV
              </button>
            </div>
            <div className="admin-card">
              <p className="admin-card__label">Import</p>
              <div className="admin-field">
                <label htmlFor="csv">Paste CSV</label>
                <textarea
                  id="csv"
                  rows={10}
                  value={csvText}
                  disabled={!canEdit || pending}
                  onChange={(e) => setCsvText(e.target.value)}
                  spellCheck={false}
                />
              </div>
              {canEdit ? (
                <button
                  type="button"
                  className="admin-btn admin-btn--primary"
                  disabled={pending || !csvText.trim()}
                  onClick={() =>
                    run(async () => {
                      const result = await importPagesCsv(csvText);
                      if (!result.ok) {
                        flash(undefined, result.error);
                        return;
                      }
                      flash(
                        `Imported ${result.data.imported} row(s)${
                          result.data.errors.length
                            ? ` · ${result.data.errors.length} error(s)`
                            : ""
                        }.`,
                      );
                      if (result.data.errors.length) {
                        setError(result.data.errors.slice(0, 5).join(" · "));
                      }
                    })
                  }
                >
                  Import CSV
                </button>
              ) : null}
            </div>
          </div>

          <div className="admin-card" style={{ marginTop: 16 }}>
            <p className="admin-card__label">Bulk patch selected pages</p>
            <div className="admin-field">
              <label htmlFor="bulk-ids">Page IDs (comma-separated)</label>
              <textarea
                id="bulk-ids"
                rows={3}
                value={selectedIds.join(",")}
                disabled={!canEdit || pending}
                onChange={(e) =>
                  setSelectedIds(
                    e.target.value
                      .split(",")
                      .map((v) => v.trim())
                      .filter(Boolean),
                  )
                }
              />
            </div>
            {canEdit ? (
              <button
                type="button"
                className="admin-btn admin-btn--ghost"
                disabled={pending || selectedIds.length === 0}
                onClick={() =>
                  run(async () => {
                    const result = await bulkUpdatePages({
                      ids: selectedIds,
                      patch: { include_in_sitemap: true },
                    });
                    if (!result.ok) {
                      flash(undefined, result.error);
                      return;
                    }
                    flash(`Updated ${result.data.updated} page(s).`);
                  })
                }
              >
                Set include_in_sitemap = true
              </button>
            ) : null}
          </div>
        </section>
      ) : null}

      {tab === "jsonld" ? (
        <section className="admin-section">
          <h2>Structured data helper</h2>
          <div className="admin-card">
            <p className="admin-card__meta" style={{ marginBottom: 12 }}>
              Validate JSON locally, then paste into a page editor JSON-LD field.
              This helper does not write to the database by itself.
            </p>
            <div className="admin-field">
              <label htmlFor="jsonld">JSON-LD</label>
              <textarea
                id="jsonld"
                rows={16}
                value={jsonHelper}
                onChange={(e) => setJsonHelper(e.target.value)}
                spellCheck={false}
              />
            </div>
            <button
              type="button"
              className="admin-btn admin-btn--primary"
              onClick={() => {
                try {
                  const parsed = JSON.parse(jsonHelper) as unknown;
                  setJsonHelper(JSON.stringify(parsed, null, 2));
                  flash("JSON is valid and reformatted.");
                } catch (err) {
                  flash(
                    undefined,
                    err instanceof Error ? err.message : "Invalid JSON",
                  );
                }
              }}
            >
              Validate & format
            </button>
          </div>
        </section>
      ) : null}

      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete redirect?"
        description="This cannot be undone."
        confirmLabel="Delete"
        danger
        busy={pending}
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          if (!deleteId) return;
          run(async () => {
            const result = await deleteRedirect(deleteId);
            if (!result.ok) {
              flash(undefined, result.error);
              return;
            }
            setDeleteId(null);
            flash("Redirect deleted.");
          });
        }}
      />
    </div>
  );
}
