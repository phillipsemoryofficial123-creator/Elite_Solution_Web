"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveBlogOverride } from "@/lib/seo/actions";
import type { SeoBlogOverride, SeoPage, SeoPublishStatus } from "@/lib/seo/types";
import { StatusPill } from "@/components/admin/status-pill";
import { EmptyState } from "@/components/admin/empty-state";

export type BlogSeoRow = {
  slug: string;
  codeTitle: string;
  path: string;
  override: SeoBlogOverride | null;
  page: SeoPage | null;
};

type BlogSeoPanelProps = {
  rows: BlogSeoRow[];
  canEdit: boolean;
};

export function BlogSeoPanel({ rows, canEdit }: BlogSeoPanelProps) {
  const router = useRouter();
  const [selected, setSelected] = useState(rows[0]?.slug ?? "");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const active = useMemo(
    () => rows.find((row) => row.slug === selected) ?? rows[0] ?? null,
    [rows, selected],
  );

  const [form, setForm] = useState(() => formFromRow(active));

  function selectSlug(slug: string) {
    setSelected(slug);
    const row = rows.find((r) => r.slug === slug) ?? null;
    setForm(formFromRow(row));
    setError(null);
    setMessage(null);
  }

  function handleSave() {
    if (!active || !canEdit) return;
    setError(null);
    setMessage(null);
    startTransition(async () => {
      const result = await saveBlogOverride({
        id: active.override?.id,
        slug: active.slug,
        title: form.title || null,
        meta_description: form.meta_description || null,
        focus_keyword: form.focus_keyword || null,
        canonical_url: form.canonical_url || null,
        robots_index: form.robots_index,
        robots_follow: form.robots_follow,
        og_title: form.og_title || null,
        og_description: form.og_description || null,
        og_image: form.og_image || null,
        twitter_title: form.twitter_title || null,
        twitter_description: form.twitter_description || null,
        twitter_image: form.twitter_image || null,
        include_in_sitemap: form.include_in_sitemap,
        status: form.status,
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setMessage("Blog SEO override saved.");
      router.refresh();
    });
  }

  if (rows.length === 0) {
    return (
      <EmptyState
        title="No blog posts found"
        description="Posts are loaded from src/data/blogs-page.ts."
      />
    );
  }

  return (
    <div className="admin-grid admin-grid--2">
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Slug</th>
              <th>Title</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const status =
                row.override?.status ?? row.page?.status ?? "draft";
              return (
                <tr
                  key={row.slug}
                  className={row.slug === active?.slug ? "is-selected" : undefined}
                >
                  <td>
                    <button
                      type="button"
                      className="admin-sort-btn"
                      onClick={() => selectSlug(row.slug)}
                    >
                      {row.slug}
                    </button>
                  </td>
                  <td>{row.override?.title ?? row.codeTitle}</td>
                  <td>
                    <StatusPill status={status} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="admin-card">
        {error ? <p className="admin-flash admin-flash--error">{error}</p> : null}
        {message ? <p className="admin-flash admin-flash--ok">{message}</p> : null}
        <p className="admin-card__label">SEO fields only · {active?.path}</p>
        <p className="admin-card__meta" style={{ marginBottom: 12 }}>
          Body content stays in code. Editing here does not migrate blog HTML.
        </p>
        <form
          className="admin-form"
          style={{ maxWidth: "none" }}
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <div className="admin-field">
            <label htmlFor="blog-title">Title</label>
            <input
              id="blog-title"
              value={form.title}
              disabled={!canEdit || pending}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />
          </div>
          <div className="admin-field">
            <label htmlFor="blog-desc">Meta description</label>
            <textarea
              id="blog-desc"
              rows={3}
              value={form.meta_description}
              disabled={!canEdit || pending}
              onChange={(e) =>
                setForm((f) => ({ ...f, meta_description: e.target.value }))
              }
            />
          </div>
          <div className="admin-field">
            <label htmlFor="blog-kw">Focus keyword</label>
            <input
              id="blog-kw"
              value={form.focus_keyword}
              disabled={!canEdit || pending}
              onChange={(e) =>
                setForm((f) => ({ ...f, focus_keyword: e.target.value }))
              }
            />
          </div>
          <div className="admin-field">
            <label htmlFor="blog-canonical">Canonical URL</label>
            <input
              id="blog-canonical"
              value={form.canonical_url}
              disabled={!canEdit || pending}
              onChange={(e) =>
                setForm((f) => ({ ...f, canonical_url: e.target.value }))
              }
            />
          </div>
          <div className="admin-field">
            <label htmlFor="blog-og-title">OG title</label>
            <input
              id="blog-og-title"
              value={form.og_title}
              disabled={!canEdit || pending}
              onChange={(e) =>
                setForm((f) => ({ ...f, og_title: e.target.value }))
              }
            />
          </div>
          <div className="admin-field">
            <label htmlFor="blog-og-desc">OG description</label>
            <textarea
              id="blog-og-desc"
              rows={2}
              value={form.og_description}
              disabled={!canEdit || pending}
              onChange={(e) =>
                setForm((f) => ({ ...f, og_description: e.target.value }))
              }
            />
          </div>
          <div className="admin-field">
            <label htmlFor="blog-og-image">OG image</label>
            <input
              id="blog-og-image"
              value={form.og_image}
              disabled={!canEdit || pending}
              onChange={(e) =>
                setForm((f) => ({ ...f, og_image: e.target.value }))
              }
            />
          </div>
          <div className="admin-field">
            <label htmlFor="blog-status">Status</label>
            <select
              id="blog-status"
              value={form.status}
              disabled={!canEdit || pending}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  status: e.target.value as SeoPublishStatus,
                }))
              }
            >
              <option value="draft">draft</option>
              <option value="published">published</option>
              <option value="scheduled">scheduled</option>
              <option value="unpublished">unpublished</option>
            </select>
          </div>
          <label className="admin-check">
            <input
              type="checkbox"
              checked={form.robots_index}
              disabled={!canEdit || pending}
              onChange={(e) =>
                setForm((f) => ({ ...f, robots_index: e.target.checked }))
              }
            />
            Robots index
          </label>
          <label className="admin-check">
            <input
              type="checkbox"
              checked={form.include_in_sitemap}
              disabled={!canEdit || pending}
              onChange={(e) =>
                setForm((f) => ({ ...f, include_in_sitemap: e.target.checked }))
              }
            />
            Include in sitemap
          </label>
          {canEdit ? (
            <button
              type="submit"
              className="admin-btn admin-btn--primary"
              disabled={pending}
            >
              {pending ? "Saving…" : "Save override"}
            </button>
          ) : (
            <p className="admin-card__meta">View-only role.</p>
          )}
        </form>
      </div>
    </div>
  );
}

function formFromRow(row: BlogSeoRow | null | undefined) {
  const source = row?.override;
  const page = row?.page;
  return {
    title: source?.title ?? page?.title ?? row?.codeTitle ?? "",
    meta_description:
      source?.meta_description ?? page?.meta_description ?? "",
    focus_keyword: source?.focus_keyword ?? page?.focus_keyword ?? "",
    canonical_url: source?.canonical_url ?? page?.canonical_url ?? "",
    robots_index: source?.robots_index ?? page?.robots_index ?? true,
    robots_follow: source?.robots_follow ?? page?.robots_follow ?? true,
    og_title: source?.og_title ?? page?.og_title ?? "",
    og_description: source?.og_description ?? page?.og_description ?? "",
    og_image: source?.og_image ?? page?.og_image ?? "",
    twitter_title: source?.twitter_title ?? page?.twitter_title ?? "",
    twitter_description:
      source?.twitter_description ?? page?.twitter_description ?? "",
    twitter_image: source?.twitter_image ?? page?.twitter_image ?? "",
    include_in_sitemap:
      source?.include_in_sitemap ?? page?.include_in_sitemap ?? true,
    status: (source?.status ?? page?.status ?? "draft") as SeoPublishStatus,
  };
}
