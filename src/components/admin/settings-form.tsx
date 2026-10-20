"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveSettings } from "@/lib/seo/actions";
import type { SeoSiteSettings } from "@/lib/seo/types";

type SettingsFormProps = {
  settings: SeoSiteSettings | null;
  canManage: boolean;
};

export function SettingsForm({ settings, canManage }: SettingsFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [robotsTxt, setRobotsTxt] = useState(settings?.robots_txt ?? "");
  const [maxPages, setMaxPages] = useState(
    String(settings?.crawl_limits?.max_pages ?? 500),
  );
  const [maxDepth, setMaxDepth] = useState(
    String(settings?.crawl_limits?.max_depth ?? 5),
  );
  const [rps, setRps] = useState(
    String(settings?.crawl_limits?.requests_per_second ?? 2),
  );
  const [templatesText, setTemplatesText] = useState(
    JSON.stringify(settings?.meta_templates ?? {}, null, 2),
  );
  const [sitemapText, setSitemapText] = useState(
    JSON.stringify(settings?.sitemap_defaults ?? {}, null, 2),
  );

  const robotsWarn = /disallow:\s*\/\s*$/im.test(robotsTxt);

  function handleSave() {
    if (!canManage) return;
    setError(null);
    setMessage(null);
    startTransition(async () => {
      let meta_templates: Record<string, unknown> | null = null;
      let sitemap_defaults: Record<string, unknown> | null = null;
      try {
        meta_templates = JSON.parse(templatesText) as Record<string, unknown>;
        sitemap_defaults = JSON.parse(sitemapText) as Record<string, unknown>;
      } catch {
        setError("Templates and sitemap defaults must be valid JSON.");
        return;
      }

      const result = await saveSettings({
        robots_txt: robotsTxt,
        meta_templates,
        sitemap_defaults,
        crawl_limits: {
          max_pages: Number(maxPages) || undefined,
          max_depth: Number(maxDepth) || undefined,
          requests_per_second: Number(rps) || undefined,
        },
      });

      if (!result.ok) {
        setError(result.error);
        return;
      }
      setMessage("Settings saved.");
      router.refresh();
    });
  }

  return (
    <div>
      {robotsWarn ? (
        <p className="admin-flash admin-flash--warn">
          Warning: robots.txt contains <code>Disallow: /</code>.
        </p>
      ) : null}
      {error ? <p className="admin-flash admin-flash--error">{error}</p> : null}
      {message ? <p className="admin-flash admin-flash--ok">{message}</p> : null}

      <form
        className="admin-form"
        style={{ maxWidth: 720 }}
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
      >
        <div className="admin-field">
          <label htmlFor="robots">Robots.txt</label>
          <textarea
            id="robots"
            rows={8}
            value={robotsTxt}
            disabled={!canManage || pending}
            onChange={(e) => setRobotsTxt(e.target.value)}
            spellCheck={false}
          />
        </div>
        <div className="admin-field">
          <label htmlFor="meta-templates">Meta templates (JSON)</label>
          <textarea
            id="meta-templates"
            rows={8}
            value={templatesText}
            disabled={!canManage || pending}
            onChange={(e) => setTemplatesText(e.target.value)}
            spellCheck={false}
          />
        </div>
        <div className="admin-field">
          <label htmlFor="sitemap-defaults">Sitemap defaults (JSON)</label>
          <textarea
            id="sitemap-defaults"
            rows={6}
            value={sitemapText}
            disabled={!canManage || pending}
            onChange={(e) => setSitemapText(e.target.value)}
            spellCheck={false}
          />
        </div>
        <div className="admin-field">
          <label htmlFor="max-pages">Crawl max pages</label>
          <input
            id="max-pages"
            type="number"
            value={maxPages}
            disabled={!canManage || pending}
            onChange={(e) => setMaxPages(e.target.value)}
          />
        </div>
        <div className="admin-field">
          <label htmlFor="max-depth">Crawl max depth</label>
          <input
            id="max-depth"
            type="number"
            value={maxDepth}
            disabled={!canManage || pending}
            onChange={(e) => setMaxDepth(e.target.value)}
          />
        </div>
        <div className="admin-field">
          <label htmlFor="rps">Requests per second</label>
          <input
            id="rps"
            type="number"
            step="0.1"
            value={rps}
            disabled={!canManage || pending}
            onChange={(e) => setRps(e.target.value)}
          />
        </div>
        {canManage ? (
          <button
            type="submit"
            className="admin-btn admin-btn--primary"
            disabled={pending}
          >
            {pending ? "Saving…" : "Save settings"}
          </button>
        ) : (
          <p className="admin-card__meta">View only — owners/admins can edit.</p>
        )}
      </form>
    </div>
  );
}
