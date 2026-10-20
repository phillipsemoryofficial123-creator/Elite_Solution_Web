"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  addRanking,
  deleteCompetitor,
  deleteKeyword,
  saveCompetitor,
  saveKeyword,
  type CannibalizationGroup,
} from "@/lib/seo/keyword-actions";
import type {
  SeoCompetitor,
  SeoKeyword,
  SeoKeywordRanking,
} from "@/lib/seo/types";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { DataBadge } from "@/components/admin/data-badge";
import { EmptyState } from "@/components/admin/empty-state";

type KeywordsPanelProps = {
  keywords: SeoKeyword[];
  rankings: SeoKeywordRanking[];
  competitors: SeoCompetitor[];
  cannibalization: CannibalizationGroup[];
  canEdit: boolean;
};

const emptyKeywordForm = {
  id: "" as string | undefined,
  keyword: "",
  intent: "",
  keyword_group: "",
  tags: "",
  target_path: "",
  notes: "",
};

const emptyRankingForm = {
  keyword_id: "",
  metric_date: new Date().toISOString().slice(0, 10),
  position: "",
  url: "",
  impressions: "",
  clicks: "",
  ctr: "",
};

const emptyCompetitorForm = {
  id: "" as string | undefined,
  domain: "",
  label: "",
  notes: "",
};

function parseOptionalNumber(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : null;
}

export function KeywordsPanel({
  keywords,
  rankings,
  competitors,
  cannibalization,
  canEdit,
}: KeywordsPanelProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [keywordForm, setKeywordForm] = useState(emptyKeywordForm);
  const [rankingForm, setRankingForm] = useState(emptyRankingForm);
  const [competitorForm, setCompetitorForm] = useState(emptyCompetitorForm);
  const [deleteKeywordId, setDeleteKeywordId] = useState<string | null>(null);
  const [deleteCompetitorId, setDeleteCompetitorId] = useState<string | null>(
    null,
  );
  const [search, setSearch] = useState("");

  const keywordNameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const row of keywords) map.set(row.id, row.keyword);
    return map;
  }, [keywords]);

  const latestByKeyword = useMemo(() => {
    const map = new Map<string, SeoKeywordRanking>();
    for (const row of rankings) {
      if (!map.has(row.keyword_id)) map.set(row.keyword_id, row);
    }
    return map;
  }, [rankings]);

  const filteredKeywords = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return keywords;
    return keywords.filter((row) =>
      [
        row.keyword,
        row.intent,
        row.keyword_group,
        row.target_path,
        ...(row.tags ?? []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [keywords, search]);

  const withRankings = keywords.filter((k) => latestByKeyword.has(k.id)).length;
  const avgPosition = (() => {
    const positions = [...latestByKeyword.values()]
      .map((r) => r.position)
      .filter((p): p is number => typeof p === "number" && Number.isFinite(p));
    if (positions.length === 0) return null;
    return positions.reduce((a, b) => a + b, 0) / positions.length;
  })();

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
      {error ? <p className="admin-flash admin-flash--error">{error}</p> : null}
      {message ? <p className="admin-flash admin-flash--ok">{message}</p> : null}

      <div className="admin-grid admin-grid--3" style={{ marginBottom: 20 }}>
        <article className="admin-card">
          <div className="admin-card__header">
            <p className="admin-card__label" style={{ margin: 0 }}>
              Tracked
            </p>
            <DataBadge status="live" />
          </div>
          <p className="admin-card__value">{keywords.length}</p>
        </article>
        <article className="admin-card">
          <div className="admin-card__header">
            <p className="admin-card__label" style={{ margin: 0 }}>
              With rankings
            </p>
            <DataBadge status="live" />
          </div>
          <p className="admin-card__value">{withRankings}</p>
        </article>
        <article className="admin-card">
          <div className="admin-card__header">
            <p className="admin-card__label" style={{ margin: 0 }}>
              Avg. position
            </p>
            <DataBadge
              status={avgPosition == null ? "disconnected" : "live"}
            />
          </div>
          <p className="admin-card__value">
            {avgPosition == null ? "—" : avgPosition.toFixed(1)}
          </p>
        </article>
      </div>

      <section className="admin-section" aria-labelledby="keywords-heading">
        <div className="admin-card__header" style={{ marginBottom: 12 }}>
          <h2 id="keywords-heading">Keywords</h2>
        </div>

        <div className="admin-grid admin-grid--2">
          <form
            className="admin-card admin-form"
            style={{ maxWidth: "none" }}
            onSubmit={(e) => {
              e.preventDefault();
              if (!canEdit) return;
              run(async () => {
                const result = await saveKeyword({
                  id: keywordForm.id || undefined,
                  keyword: keywordForm.keyword,
                  intent: keywordForm.intent || null,
                  keyword_group: keywordForm.keyword_group || null,
                  tags: keywordForm.tags
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean),
                  target_path: keywordForm.target_path || null,
                  notes: keywordForm.notes || null,
                });
                if (!result.ok) {
                  flash(undefined, result.error);
                  return;
                }
                setKeywordForm(emptyKeywordForm);
                flash(keywordForm.id ? "Keyword updated." : "Keyword added.");
              });
            }}
          >
            <h3 style={{ marginTop: 0 }}>
              {keywordForm.id ? "Edit keyword" : "Add keyword"}
            </h3>
            <label>
              Keyword
              <input
                required
                value={keywordForm.keyword}
                disabled={!canEdit || pending}
                onChange={(e) =>
                  setKeywordForm((f) => ({ ...f, keyword: e.target.value }))
                }
              />
            </label>
            <div className="admin-grid admin-grid--2">
              <label>
                Intent
                <input
                  value={keywordForm.intent}
                  disabled={!canEdit || pending}
                  placeholder="informational / commercial"
                  onChange={(e) =>
                    setKeywordForm((f) => ({ ...f, intent: e.target.value }))
                  }
                />
              </label>
              <label>
                Group
                <input
                  value={keywordForm.keyword_group}
                  disabled={!canEdit || pending}
                  onChange={(e) =>
                    setKeywordForm((f) => ({
                      ...f,
                      keyword_group: e.target.value,
                    }))
                  }
                />
              </label>
            </div>
            <label>
              Tags (comma-separated)
              <input
                value={keywordForm.tags}
                disabled={!canEdit || pending}
                onChange={(e) =>
                  setKeywordForm((f) => ({ ...f, tags: e.target.value }))
                }
              />
            </label>
            <label>
              Target path
              <input
                value={keywordForm.target_path}
                disabled={!canEdit || pending}
                placeholder="/services/example"
                onChange={(e) =>
                  setKeywordForm((f) => ({
                    ...f,
                    target_path: e.target.value,
                  }))
                }
              />
            </label>
            <label>
              Notes
              <textarea
                rows={3}
                value={keywordForm.notes}
                disabled={!canEdit || pending}
                onChange={(e) =>
                  setKeywordForm((f) => ({ ...f, notes: e.target.value }))
                }
              />
            </label>
            <p className="admin-card__meta">
              Search volume and difficulty are not tracked here — they require
              an external SERP API (not connected).
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button
                type="submit"
                className="admin-btn admin-btn--primary"
                disabled={!canEdit || pending}
              >
                {keywordForm.id ? "Save changes" : "Add keyword"}
              </button>
              {keywordForm.id ? (
                <button
                  type="button"
                  className="admin-btn admin-btn--ghost"
                  disabled={pending}
                  onClick={() => setKeywordForm(emptyKeywordForm)}
                >
                  Cancel edit
                </button>
              ) : null}
            </div>
          </form>

          <div>
            <div className="admin-toolbar">
              <input
                className="admin-toolbar__search"
                placeholder="Search keywords…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {filteredKeywords.length === 0 ? (
              <EmptyState
                title="No keywords yet"
                description="Add target keywords with intent, group, and target path. Rankings are manual until GSC sync is connected."
              />
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Keyword</th>
                      <th>Group</th>
                      <th>Target</th>
                      <th>Latest pos.</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {filteredKeywords.map((row) => {
                      const latest = latestByKeyword.get(row.id);
                      return (
                        <tr key={row.id}>
                          <td>
                            <strong>{row.keyword}</strong>
                            {row.intent ? (
                              <div className="admin-card__meta">{row.intent}</div>
                            ) : null}
                            {row.tags?.length ? (
                              <div className="admin-card__meta">
                                {row.tags.join(", ")}
                              </div>
                            ) : null}
                          </td>
                          <td>{row.keyword_group ?? "—"}</td>
                          <td>{row.target_path ?? "—"}</td>
                          <td>
                            {latest?.position != null
                              ? Number(latest.position).toFixed(1)
                              : "—"}
                            {latest ? (
                              <div className="admin-card__meta">
                                {latest.metric_date} · {latest.source}
                              </div>
                            ) : null}
                          </td>
                          <td>
                            <div
                              style={{
                                display: "flex",
                                gap: 6,
                                justifyContent: "flex-end",
                              }}
                            >
                              <button
                                type="button"
                                className="admin-btn admin-btn--ghost"
                                disabled={!canEdit || pending}
                                onClick={() => {
                                  setKeywordForm({
                                    id: row.id,
                                    keyword: row.keyword,
                                    intent: row.intent ?? "",
                                    keyword_group: row.keyword_group ?? "",
                                    tags: (row.tags ?? []).join(", "),
                                    target_path: row.target_path ?? "",
                                    notes: row.notes ?? "",
                                  });
                                  setRankingForm((f) => ({
                                    ...f,
                                    keyword_id: row.id,
                                  }));
                                }}
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                className="admin-btn admin-btn--danger"
                                disabled={!canEdit || pending}
                                onClick={() => setDeleteKeywordId(row.id)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="admin-section" aria-labelledby="rankings-heading">
        <h2 id="rankings-heading">Manual ranking history</h2>
        <div className="admin-grid admin-grid--2">
          <form
            className="admin-card admin-form"
            style={{ maxWidth: "none" }}
            onSubmit={(e) => {
              e.preventDefault();
              if (!canEdit) return;
              run(async () => {
                const position = parseOptionalNumber(rankingForm.position);
                const impressions = parseOptionalNumber(
                  rankingForm.impressions,
                );
                const clicks = parseOptionalNumber(rankingForm.clicks);
                let ctr = parseOptionalNumber(rankingForm.ctr);
                if (ctr != null && ctr > 1) ctr = ctr / 100;

                const result = await addRanking({
                  keyword_id: rankingForm.keyword_id,
                  metric_date: rankingForm.metric_date,
                  position,
                  url: rankingForm.url || null,
                  impressions:
                    impressions == null ? null : Math.round(impressions),
                  clicks: clicks == null ? null : Math.round(clicks),
                  ctr,
                });
                if (!result.ok) {
                  flash(undefined, result.error);
                  return;
                }
                setRankingForm((f) => ({
                  ...emptyRankingForm,
                  keyword_id: f.keyword_id,
                }));
                flash("Ranking saved (manual).");
              });
            }}
          >
            <label>
              Keyword
              <select
                required
                value={rankingForm.keyword_id}
                disabled={!canEdit || pending || keywords.length === 0}
                onChange={(e) =>
                  setRankingForm((f) => ({
                    ...f,
                    keyword_id: e.target.value,
                  }))
                }
              >
                <option value="">Select keyword…</option>
                {keywords.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.keyword}
                  </option>
                ))}
              </select>
            </label>
            <div className="admin-grid admin-grid--2">
              <label>
                Date
                <input
                  type="date"
                  required
                  value={rankingForm.metric_date}
                  disabled={!canEdit || pending}
                  onChange={(e) =>
                    setRankingForm((f) => ({
                      ...f,
                      metric_date: e.target.value,
                    }))
                  }
                />
              </label>
              <label>
                Position
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={rankingForm.position}
                  disabled={!canEdit || pending}
                  onChange={(e) =>
                    setRankingForm((f) => ({
                      ...f,
                      position: e.target.value,
                    }))
                  }
                />
              </label>
            </div>
            <label>
              Ranking URL
              <input
                value={rankingForm.url}
                disabled={!canEdit || pending}
                placeholder="https://www.elitesolutionusa.com/..."
                onChange={(e) =>
                  setRankingForm((f) => ({ ...f, url: e.target.value }))
                }
              />
            </label>
            <div className="admin-grid admin-grid--3">
              <label>
                Impressions (optional)
                <input
                  type="number"
                  min="0"
                  value={rankingForm.impressions}
                  disabled={!canEdit || pending}
                  onChange={(e) =>
                    setRankingForm((f) => ({
                      ...f,
                      impressions: e.target.value,
                    }))
                  }
                />
              </label>
              <label>
                Clicks (optional)
                <input
                  type="number"
                  min="0"
                  value={rankingForm.clicks}
                  disabled={!canEdit || pending}
                  onChange={(e) =>
                    setRankingForm((f) => ({ ...f, clicks: e.target.value }))
                  }
                />
              </label>
              <label>
                CTR (optional)
                <input
                  type="number"
                  step="0.0001"
                  min="0"
                  value={rankingForm.ctr}
                  disabled={!canEdit || pending}
                  placeholder="0.05 or 5"
                  onChange={(e) =>
                    setRankingForm((f) => ({ ...f, ctr: e.target.value }))
                  }
                />
              </label>
            </div>
            <p className="admin-card__meta">
              Source is always <strong>manual</strong>. Volume and difficulty are
              never invented.
            </p>
            <button
              type="submit"
              className="admin-btn admin-btn--primary"
              disabled={!canEdit || pending || keywords.length === 0}
            >
              Add ranking
            </button>
          </form>

          <div className="admin-card">
            <h3 style={{ marginTop: 0 }}>Recent rankings</h3>
            {rankings.length === 0 ? (
              <p className="admin-card__meta">No ranking rows yet.</p>
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Keyword</th>
                      <th>Pos.</th>
                      <th>Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rankings.slice(0, 20).map((row) => (
                      <tr key={row.id}>
                        <td>{row.metric_date}</td>
                        <td>
                          {keywordNameById.get(row.keyword_id) ?? row.keyword_id}
                        </td>
                        <td>
                          {row.position == null
                            ? "—"
                            : Number(row.position).toFixed(1)}
                        </td>
                        <td>{row.source}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="admin-section" aria-labelledby="canni-heading">
        <h2 id="canni-heading">Cannibalization report</h2>
        <div className="admin-card">
          <p className="admin-card__meta">
            Published pages that share the same focus keyword. Resolve by
            differentiating targets or consolidating content.
          </p>
          {cannibalization.length === 0 ? (
            <p className="admin-card__meta" style={{ marginTop: 12 }}>
              No focus-keyword collisions among published pages.
            </p>
          ) : (
            <ul className="admin-list" style={{ marginTop: 12 }}>
              {cannibalization.map((group) => (
                <li key={group.focus_keyword}>
                  <strong>{group.focus_keyword}</strong>
                  <div className="admin-card__meta">
                    {group.pages
                      .map((p) => `${p.path}${p.title ? ` (${p.title})` : ""}`)
                      .join(" · ")}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="admin-section" aria-labelledby="comp-heading">
        <h2 id="comp-heading">Competitors</h2>
        <p className="admin-card__meta" style={{ marginBottom: 12 }}>
          Volume, difficulty, and competitor rankings require an external SERP
          API (not connected)
        </p>
        <div className="admin-grid admin-grid--2">
          <form
            className="admin-card admin-form"
            style={{ maxWidth: "none" }}
            onSubmit={(e) => {
              e.preventDefault();
              if (!canEdit) return;
              run(async () => {
                const result = await saveCompetitor({
                  id: competitorForm.id || undefined,
                  domain: competitorForm.domain,
                  label: competitorForm.label || null,
                  notes: competitorForm.notes || null,
                });
                if (!result.ok) {
                  flash(undefined, result.error);
                  return;
                }
                setCompetitorForm(emptyCompetitorForm);
                flash(
                  competitorForm.id
                    ? "Competitor updated."
                    : "Competitor added.",
                );
              });
            }}
          >
            <label>
              Domain
              <input
                required
                value={competitorForm.domain}
                disabled={!canEdit || pending}
                placeholder="competitor.com"
                onChange={(e) =>
                  setCompetitorForm((f) => ({ ...f, domain: e.target.value }))
                }
              />
            </label>
            <label>
              Label
              <input
                value={competitorForm.label}
                disabled={!canEdit || pending}
                onChange={(e) =>
                  setCompetitorForm((f) => ({ ...f, label: e.target.value }))
                }
              />
            </label>
            <label>
              Notes
              <textarea
                rows={3}
                value={competitorForm.notes}
                disabled={!canEdit || pending}
                onChange={(e) =>
                  setCompetitorForm((f) => ({ ...f, notes: e.target.value }))
                }
              />
            </label>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                type="submit"
                className="admin-btn admin-btn--primary"
                disabled={!canEdit || pending}
              >
                {competitorForm.id ? "Save competitor" : "Add competitor"}
              </button>
              {competitorForm.id ? (
                <button
                  type="button"
                  className="admin-btn admin-btn--ghost"
                  onClick={() => setCompetitorForm(emptyCompetitorForm)}
                >
                  Cancel
                </button>
              ) : null}
            </div>
          </form>

          <div className="admin-card">
            {competitors.length === 0 ? (
              <EmptyState
                title="No competitors"
                description="Store competitor domains for labeling. Rank tracking needs an external SERP API."
              />
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Domain</th>
                      <th>Label</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {competitors.map((row) => (
                      <tr key={row.id}>
                        <td>
                          <strong>{row.domain}</strong>
                          {row.notes ? (
                            <div className="admin-card__meta">{row.notes}</div>
                          ) : null}
                        </td>
                        <td>{row.label ?? "—"}</td>
                        <td>
                          <div
                            style={{
                              display: "flex",
                              gap: 6,
                              justifyContent: "flex-end",
                            }}
                          >
                            <button
                              type="button"
                              className="admin-btn admin-btn--ghost"
                              disabled={!canEdit || pending}
                              onClick={() =>
                                setCompetitorForm({
                                  id: row.id,
                                  domain: row.domain,
                                  label: row.label ?? "",
                                  notes: row.notes ?? "",
                                })
                              }
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="admin-btn admin-btn--danger"
                              disabled={!canEdit || pending}
                              onClick={() => setDeleteCompetitorId(row.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>

      <ConfirmDialog
        open={deleteKeywordId != null}
        title="Delete keyword?"
        description="This also removes its ranking history."
        confirmLabel="Delete"
        danger
        busy={pending}
        onCancel={() => setDeleteKeywordId(null)}
        onConfirm={() => {
          if (!deleteKeywordId) return;
          run(async () => {
            const result = await deleteKeyword(deleteKeywordId);
            setDeleteKeywordId(null);
            if (!result.ok) {
              flash(undefined, result.error);
              return;
            }
            flash("Keyword deleted.");
          });
        }}
      />

      <ConfirmDialog
        open={deleteCompetitorId != null}
        title="Delete competitor?"
        confirmLabel="Delete"
        danger
        busy={pending}
        onCancel={() => setDeleteCompetitorId(null)}
        onConfirm={() => {
          if (!deleteCompetitorId) return;
          run(async () => {
            const result = await deleteCompetitor(deleteCompetitorId);
            setDeleteCompetitorId(null);
            if (!result.ok) {
              flash(undefined, result.error);
              return;
            }
            flash("Competitor deleted.");
          });
        }}
      />
    </div>
  );
}
