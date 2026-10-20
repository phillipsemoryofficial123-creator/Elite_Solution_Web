"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  publishPage,
  savePage,
  schedulePage,
  unpublishPage,
} from "@/lib/seo/actions";
import { computeSeoScore } from "@/lib/seo/score";
import type { SeoPage, SeoPageRevision, SeoPublishStatus } from "@/lib/seo/types";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { OgPreview, SerpPreview } from "@/components/admin/serp-preview";
import { StatusPill } from "@/components/admin/status-pill";

type PageEditorProps = {
  page: SeoPage;
  revisions: SeoPageRevision[];
  siteOrigin?: string;
  canEdit: boolean;
};

type FormState = {
  title: string;
  meta_description: string;
  focus_keyword: string;
  canonical_url: string;
  robots_index: boolean;
  robots_follow: boolean;
  og_title: string;
  og_description: string;
  og_image: string;
  og_type: string;
  twitter_card: string;
  twitter_title: string;
  twitter_description: string;
  twitter_image: string;
  json_ld_text: string;
  include_in_sitemap: boolean;
  status: SeoPublishStatus;
  scheduled_at_local: string;
};

function toLocalInput(iso: string | null): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function fromLocalInput(local: string): string | null {
  if (!local.trim()) return null;
  const date = new Date(local);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

function pageToForm(page: SeoPage): FormState {
  return {
    title: page.title ?? "",
    meta_description: page.meta_description ?? "",
    focus_keyword: page.focus_keyword ?? "",
    canonical_url: page.canonical_url ?? "",
    robots_index: page.robots_index,
    robots_follow: page.robots_follow,
    og_title: page.og_title ?? "",
    og_description: page.og_description ?? "",
    og_image: page.og_image ?? "",
    og_type: page.og_type ?? "website",
    twitter_card: page.twitter_card ?? "summary_large_image",
    twitter_title: page.twitter_title ?? "",
    twitter_description: page.twitter_description ?? "",
    twitter_image: page.twitter_image ?? "",
    json_ld_text: page.json_ld ? JSON.stringify(page.json_ld, null, 2) : "",
    include_in_sitemap: page.include_in_sitemap,
    status: page.status,
    scheduled_at_local: toLocalInput(page.scheduled_at),
  };
}

export function PageEditor({
  page,
  revisions,
  siteOrigin,
  canEdit,
}: PageEditorProps) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(() => pageToForm(page));
  const [baseline, setBaseline] = useState(() => JSON.stringify(pageToForm(page)));
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<"publish" | "unpublish" | null>(null);
  const [pending, startTransition] = useTransition();

  const dirty = JSON.stringify(form) !== baseline;

  useEffect(() => {
    const next = pageToForm(page);
    setForm(next);
    setBaseline(JSON.stringify(next));
  }, [page]);

  useEffect(() => {
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!dirty) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  const score = useMemo(
    () =>
      computeSeoScore({
        title: form.title,
        meta_description: form.meta_description,
        focus_keyword: form.focus_keyword,
        canonical_url: form.canonical_url,
        og_image: form.og_image,
        robots_index: form.robots_index,
        robots_follow: form.robots_follow,
        include_in_sitemap: form.include_in_sitemap,
      }),
    [form],
  );

  const validationMessages = useMemo(() => {
    const notes: string[] = [];
    const titleLen = form.title.trim().length;
    const descLen = form.meta_description.trim().length;
    if (!form.title.trim()) notes.push("Title is required for a strong SERP snippet.");
    else if (titleLen < 30 || titleLen > 60) {
      notes.push(`Title length is ${titleLen} (aim for 30–60).`);
    }
    if (!form.meta_description.trim()) {
      notes.push("Meta description is missing.");
    } else if (descLen < 70 || descLen > 160) {
      notes.push(`Meta description length is ${descLen} (aim for 70–160).`);
    }
    if (form.focus_keyword.trim() && !form.title.toLowerCase().includes(form.focus_keyword.trim().toLowerCase())) {
      notes.push("Focus keyword does not appear in the title.");
    }
    if (form.robots_index !== form.include_in_sitemap) {
      notes.push("Robots index and sitemap inclusion are inconsistent.");
    }
    if (form.json_ld_text.trim()) {
      try {
        JSON.parse(form.json_ld_text);
      } catch {
        notes.push("JSON-LD is not valid JSON.");
      }
    }
    return notes;
  }, [form]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function run(action: () => Promise<void>) {
    setError(null);
    setMessage(null);
    startTransition(async () => {
      try {
        await action();
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unexpected error");
      }
    });
  }

  function handleSave() {
    run(async () => {
      let jsonLd: SeoPage["json_ld"] = null;
      if (form.json_ld_text.trim()) {
        try {
          jsonLd = JSON.parse(form.json_ld_text) as SeoPage["json_ld"];
        } catch {
          setError("JSON-LD must be valid JSON.");
          return;
        }
      }

      const result = await savePage({
        id: page.id,
        path: page.path,
        page_type: page.page_type,
        title: form.title || null,
        meta_description: form.meta_description || null,
        focus_keyword: form.focus_keyword || null,
        canonical_url: form.canonical_url || null,
        robots_index: form.robots_index,
        robots_follow: form.robots_follow,
        og_title: form.og_title || null,
        og_description: form.og_description || null,
        og_image: form.og_image || null,
        og_type: form.og_type || null,
        twitter_card: form.twitter_card || null,
        twitter_title: form.twitter_title || null,
        twitter_description: form.twitter_description || null,
        twitter_image: form.twitter_image || null,
        json_ld: jsonLd,
        include_in_sitemap: form.include_in_sitemap,
        status: form.status,
        scheduled_at: fromLocalInput(form.scheduled_at_local),
      });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      const next = pageToForm(result.data);
      setForm(next);
      setBaseline(JSON.stringify(next));
      setMessage(`Saved · internal SEO score ${result.data.seo_score ?? "—"}`);
    });
  }

  function handlePublish() {
    run(async () => {
      const saveFirst = dirty;
      if (saveFirst) {
        const saved = await savePage({
          id: page.id,
          path: page.path,
          title: form.title || null,
          meta_description: form.meta_description || null,
          focus_keyword: form.focus_keyword || null,
          canonical_url: form.canonical_url || null,
          robots_index: form.robots_index,
          robots_follow: form.robots_follow,
          og_title: form.og_title || null,
          og_description: form.og_description || null,
          og_image: form.og_image || null,
          og_type: form.og_type || null,
          twitter_card: form.twitter_card || null,
          twitter_title: form.twitter_title || null,
          twitter_description: form.twitter_description || null,
          twitter_image: form.twitter_image || null,
          include_in_sitemap: form.include_in_sitemap,
        });
        if (!saved.ok) {
          setError(saved.error);
          return;
        }
      }
      const result = await publishPage(page.id);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setConfirm(null);
      setMessage("Published. Public cache revalidated.");
      setBaseline(JSON.stringify(pageToForm(result.data)));
      setForm(pageToForm(result.data));
    });
  }

  function handleUnpublish() {
    run(async () => {
      const result = await unpublishPage(page.id);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setConfirm(null);
      setMessage("Unpublished.");
      setForm(pageToForm(result.data));
      setBaseline(JSON.stringify(pageToForm(result.data)));
    });
  }

  function handleSchedule() {
    const scheduledAt = fromLocalInput(form.scheduled_at_local);
    if (!scheduledAt) {
      setError("Pick a schedule date/time first.");
      return;
    }
    run(async () => {
      const result = await schedulePage({
        id: page.id,
        scheduled_at: scheduledAt,
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setMessage(`Scheduled for ${new Date(scheduledAt).toLocaleString()}.`);
      setForm(pageToForm(result.data));
      setBaseline(JSON.stringify(pageToForm(result.data)));
    });
  }

  return (
    <div className="admin-page-editor">
      <div className="admin-page-header">
        <div>
          <p className="admin-eyebrow">{page.page_type}</p>
          <h1>{page.path}</h1>
          <p>
            Internal SEO score {score.score}/100 (checklist only — not a Google
            ranking factor).
          </p>
        </div>
        <div className="admin-page-editor__actions">
          <StatusPill status={form.status} />
          {dirty ? (
            <span className="admin-status-pill admin-status-pill--warn">
              Unsaved changes
            </span>
          ) : null}
        </div>
      </div>

      {error ? <p className="admin-flash admin-flash--error">{error}</p> : null}
      {message ? <p className="admin-flash admin-flash--ok">{message}</p> : null}

      <div className="admin-grid admin-grid--2">
        <div className="admin-card">
          <form
            className="admin-form"
            style={{ maxWidth: "none" }}
            onSubmit={(event) => {
              event.preventDefault();
              if (canEdit) handleSave();
            }}
          >
            <div className="admin-field">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                value={form.title}
                disabled={!canEdit || pending}
                onChange={(e) => update("title", e.target.value)}
              />
            </div>
            <div className="admin-field">
              <label htmlFor="meta_description">Meta description</label>
              <textarea
                id="meta_description"
                rows={3}
                value={form.meta_description}
                disabled={!canEdit || pending}
                onChange={(e) => update("meta_description", e.target.value)}
              />
            </div>
            <div className="admin-field">
              <label htmlFor="focus_keyword">Focus keyword</label>
              <input
                id="focus_keyword"
                value={form.focus_keyword}
                disabled={!canEdit || pending}
                onChange={(e) => update("focus_keyword", e.target.value)}
              />
            </div>
            <div className="admin-field">
              <label htmlFor="canonical_url">Canonical URL</label>
              <input
                id="canonical_url"
                value={form.canonical_url}
                disabled={!canEdit || pending}
                onChange={(e) => update("canonical_url", e.target.value)}
              />
            </div>

            <div className="admin-grid admin-grid--2">
              <label className="admin-check">
                <input
                  type="checkbox"
                  checked={form.robots_index}
                  disabled={!canEdit || pending}
                  onChange={(e) => update("robots_index", e.target.checked)}
                />
                Robots index
              </label>
              <label className="admin-check">
                <input
                  type="checkbox"
                  checked={form.robots_follow}
                  disabled={!canEdit || pending}
                  onChange={(e) => update("robots_follow", e.target.checked)}
                />
                Robots follow
              </label>
              <label className="admin-check">
                <input
                  type="checkbox"
                  checked={form.include_in_sitemap}
                  disabled={!canEdit || pending}
                  onChange={(e) => update("include_in_sitemap", e.target.checked)}
                />
                Include in sitemap
              </label>
            </div>

            <div className="admin-field">
              <label htmlFor="og_title">OG title</label>
              <input
                id="og_title"
                value={form.og_title}
                disabled={!canEdit || pending}
                onChange={(e) => update("og_title", e.target.value)}
              />
            </div>
            <div className="admin-field">
              <label htmlFor="og_description">OG description</label>
              <textarea
                id="og_description"
                rows={2}
                value={form.og_description}
                disabled={!canEdit || pending}
                onChange={(e) => update("og_description", e.target.value)}
              />
            </div>
            <div className="admin-field">
              <label htmlFor="og_image">OG image URL</label>
              <input
                id="og_image"
                value={form.og_image}
                disabled={!canEdit || pending}
                onChange={(e) => update("og_image", e.target.value)}
              />
            </div>
            <div className="admin-field">
              <label htmlFor="og_type">OG type</label>
              <input
                id="og_type"
                value={form.og_type}
                disabled={!canEdit || pending}
                onChange={(e) => update("og_type", e.target.value)}
              />
            </div>

            <div className="admin-field">
              <label htmlFor="twitter_card">Twitter card</label>
              <input
                id="twitter_card"
                value={form.twitter_card}
                disabled={!canEdit || pending}
                onChange={(e) => update("twitter_card", e.target.value)}
              />
            </div>
            <div className="admin-field">
              <label htmlFor="twitter_title">Twitter title</label>
              <input
                id="twitter_title"
                value={form.twitter_title}
                disabled={!canEdit || pending}
                onChange={(e) => update("twitter_title", e.target.value)}
              />
            </div>
            <div className="admin-field">
              <label htmlFor="twitter_description">Twitter description</label>
              <textarea
                id="twitter_description"
                rows={2}
                value={form.twitter_description}
                disabled={!canEdit || pending}
                onChange={(e) => update("twitter_description", e.target.value)}
              />
            </div>
            <div className="admin-field">
              <label htmlFor="twitter_image">Twitter image URL</label>
              <input
                id="twitter_image"
                value={form.twitter_image}
                disabled={!canEdit || pending}
                onChange={(e) => update("twitter_image", e.target.value)}
              />
            </div>

            <div className="admin-field">
              <label htmlFor="json_ld">Structured data (JSON-LD)</label>
              <textarea
                id="json_ld"
                rows={8}
                value={form.json_ld_text}
                disabled={!canEdit || pending}
                onChange={(e) => update("json_ld_text", e.target.value)}
                spellCheck={false}
              />
            </div>

            <div className="admin-field">
              <label htmlFor="scheduled_at">Schedule publish at</label>
              <input
                id="scheduled_at"
                type="datetime-local"
                value={form.scheduled_at_local}
                disabled={!canEdit || pending}
                onChange={(e) => update("scheduled_at_local", e.target.value)}
              />
            </div>

            {canEdit ? (
              <div className="admin-page-editor__actions">
                <button
                  type="submit"
                  className="admin-btn admin-btn--primary"
                  disabled={pending || !dirty}
                >
                  {pending ? "Saving…" : "Save"}
                </button>
                <button
                  type="button"
                  className="admin-btn admin-btn--blue"
                  disabled={pending}
                  onClick={() => setConfirm("publish")}
                >
                  Publish
                </button>
                <button
                  type="button"
                  className="admin-btn admin-btn--ghost"
                  disabled={pending}
                  onClick={handleSchedule}
                >
                  Schedule
                </button>
                <button
                  type="button"
                  className="admin-btn admin-btn--danger"
                  disabled={pending}
                  onClick={() => setConfirm("unpublish")}
                >
                  Unpublish
                </button>
              </div>
            ) : (
              <p className="admin-card__meta">View-only role.</p>
            )}
          </form>
        </div>

        <div className="admin-stack">
          <div className="admin-card">
            <SerpPreview
              title={form.title || form.og_title}
              description={form.meta_description || form.og_description}
              path={page.path}
              siteOrigin={siteOrigin}
            />
          </div>
          <div className="admin-card">
            <OgPreview
              title={form.og_title || form.title}
              description={form.og_description || form.meta_description}
              image={form.og_image}
              path={page.path}
            />
          </div>
          <div className="admin-card">
            <div className="admin-card__header">
              <p className="admin-card__label" style={{ margin: 0 }}>
                Validation
              </p>
              <span className="admin-status-pill admin-status-pill--muted">
                Score {score.score}
              </span>
            </div>
            {validationMessages.length === 0 ? (
              <p className="admin-card__meta">No checklist warnings.</p>
            ) : (
              <ul className="admin-list">
                {validationMessages.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            )}
            <ul className="admin-list" style={{ marginTop: 12 }}>
              {score.checks.map((check) => (
                <li key={check.id}>
                  {check.pass ? "✓" : "○"} {check.label}
                </li>
              ))}
            </ul>
          </div>
          <div className="admin-card">
            <p className="admin-card__label">Revision history</p>
            {revisions.length === 0 ? (
              <p className="admin-card__meta">No revisions yet.</p>
            ) : (
              <ul className="admin-list">
                {revisions.map((rev) => (
                  <li key={rev.id}>
                    <strong>{new Date(rev.created_at).toLocaleString()}</strong>
                    {rev.actor_id ? (
                      <span> · {rev.actor_id.slice(0, 8)}…</span>
                    ) : null}
                    {typeof rev.snapshot?.seo_score === "number" ? (
                      <span> · score {rev.snapshot.seo_score}</span>
                    ) : null}
                    {typeof rev.snapshot?.status === "string" ? (
                      <span> · {rev.snapshot.status}</span>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirm === "publish"}
        title="Publish this page SEO?"
        description="Published fields override public metadata for this path. Cache will revalidate."
        confirmLabel="Publish"
        busy={pending}
        onCancel={() => setConfirm(null)}
        onConfirm={handlePublish}
      />
      <ConfirmDialog
        open={confirm === "unpublish"}
        title="Unpublish this page SEO?"
        description="Public pages will fall back to code defaults until you publish again."
        confirmLabel="Unpublish"
        danger
        busy={pending}
        onCancel={() => setConfirm(null)}
        onConfirm={handleUnpublish}
      />
    </div>
  );
}
