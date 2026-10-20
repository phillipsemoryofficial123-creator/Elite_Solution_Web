import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  SeoAuthError,
  canMutateContent,
  requireSeoRole,
} from "@/lib/seo/auth";
import { safeEqual } from "@/lib/seo/crypto";
import { KNOWN_SEO_PATHS } from "@/lib/seo/paths";
import { site } from "@/data/site";
import type {
  SeoAudit,
  SeoAuditIssueSeverity,
  SeoIssueResolution,
} from "@/lib/seo/types";
import {
  parseHtmlDocument,
  robotsMetaHasNoindex,
} from "@/lib/seo/crawler/parse-html";
import { isPathAllowed, parseRobotsTxt } from "@/lib/seo/crawler/robots";
import {
  absoluteUrlFromPath,
  isSafeCrawlUrl,
  isSafeExternalCheckUrl,
  normalizeOrigin,
} from "@/lib/seo/crawler/url-safety";

const FETCH_TIMEOUT_MS = 15_000;
const MAX_REDIRECTS = 5;
const DEFAULT_MAX_PAGES = 100;
const DEFAULT_DELAY_MS = 500;
const DEFAULT_MAX_DEPTH = 3;
const EXTERNAL_HEAD_LIMIT = 40;

export type AuditCaller =
  | { kind: "session"; actorId: string }
  | { kind: "cron"; actorId: "cron" };

export type AuditIssueDraft = {
  severity: SeoAuditIssueSeverity;
  code: string;
  url: string;
  message: string;
  evidence?: Record<string, unknown> | null;
};

export type RunAuditResult = {
  audit: SeoAudit;
  issues: AuditIssueDraft[];
};

type QueueItem = { url: string; depth: number };

type PageRecord = {
  url: string;
  path: string;
  status: number;
  redirectChain: Array<{ url: string; status: number }>;
  title: string | null;
  metaDescription: string | null;
  canonical: string | null;
  robotsMeta: string | null;
  xRobotsTag: string | null;
  h1Count: number;
  headingOrderIssues: string[];
  imagesMissingAlt: number;
  jsonLdParseErrors: Array<{ index: number; message: string }>;
  internalLinks: string[];
  externalLinks: string[];
};

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getSiteOrigin(): string {
  const fromEnv = process.env.SEO_SITE_ORIGIN?.trim();
  return normalizeOrigin(fromEnv || site.website);
}

function pathFromUrl(url: string): string {
  try {
    const u = new URL(url);
    return `${u.pathname}${u.search}` || "/";
  } catch {
    return url;
  }
}

function normalizePath(path: string): string {
  if (!path) return "/";
  try {
    const u = new URL(path, "https://example.com");
    let p = u.pathname || "/";
    if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
    return `${p}${u.search}`;
  } catch {
    return path.startsWith("/") ? path : `/${path}`;
  }
}

export async function resolveAuditCaller(input?: {
  cronSecret?: string | null;
}): Promise<AuditCaller> {
  const expected = process.env.CRON_SECRET ?? "";
  const provided = input?.cronSecret ?? "";
  if (expected && provided && safeEqual(provided, expected)) {
    return { kind: "cron", actorId: "cron" };
  }

  const session = await requireSeoRole("owner", "admin", "editor");
  if (!canMutateContent(session.role)) {
    throw new SeoAuthError("Editors and above can run SEO audits.", 403);
  }
  return { kind: "session", actorId: session.userId };
}

async function loadCrawlSettings(client: SupabaseClient): Promise<{
  maxPages: number;
  delayMs: number;
  maxDepth: number;
  robotsTxt: string | null;
}> {
  const { data } = await client
    .from("seo_site_settings")
    .select("crawl_max_pages, crawl_delay_ms, crawl_max_depth, robots_txt")
    .limit(1)
    .maybeSingle();

  const row = data as {
    crawl_max_pages?: number | null;
    crawl_delay_ms?: number | null;
    crawl_max_depth?: number | null;
    robots_txt?: string | null;
  } | null;

  return {
    maxPages: Math.max(1, row?.crawl_max_pages ?? DEFAULT_MAX_PAGES),
    delayMs: Math.max(0, row?.crawl_delay_ms ?? DEFAULT_DELAY_MS),
    maxDepth: Math.max(0, row?.crawl_max_depth ?? DEFAULT_MAX_DEPTH),
    robotsTxt: row?.robots_txt ?? null,
  };
}

async function loadRegistryPaths(client: SupabaseClient): Promise<{
  seedPaths: string[];
  sitemapPaths: Set<string>;
}> {
  const { data } = await client
    .from("seo_pages")
    .select("path, include_in_sitemap, robots_index, status");

  const dbPaths = (data ?? []) as Array<{
    path: string;
    include_in_sitemap: boolean;
    robots_index: boolean;
    status: string;
  }>;

  const seedSet = new Set<string>();
  const sitemapPaths = new Set<string>();

  for (const path of KNOWN_SEO_PATHS) {
    seedSet.add(normalizePath(path));
    sitemapPaths.add(normalizePath(path));
  }

  for (const row of dbPaths) {
    const path = normalizePath(row.path);
    seedSet.add(path);
    if (row.include_in_sitemap) {
      sitemapPaths.add(path);
    }
  }

  return {
    seedPaths: Array.from(seedSet).sort(),
    sitemapPaths,
  };
}

async function fetchChain(
  startUrl: string,
  options?: { method?: "GET" | "HEAD" },
): Promise<{
  ok: boolean;
  finalUrl: string;
  status: number;
  headers: Headers;
  body: string;
  redirectChain: Array<{ url: string; status: number }>;
  redirectLimitExceeded: boolean;
  error?: string;
}> {
  const method = options?.method ?? "GET";
  const redirectChain: Array<{ url: string; status: number }> = [];
  let current = startUrl;
  let redirectLimitExceeded = false;

  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    try {
      const response = await fetch(current, {
        method,
        redirect: "manual",
        signal: controller.signal,
        headers: {
          "User-Agent": "EliteSolutionsSEOAuditBot/1.0 (+technical-seo-audit)",
          Accept: method === "HEAD" ? "*/*" : "text/html,application/xhtml+xml",
        },
      });

      redirectChain.push({ url: current, status: response.status });

      if (response.status >= 300 && response.status < 400) {
        const location = response.headers.get("location");
        if (!location) {
          return {
            ok: false,
            finalUrl: current,
            status: response.status,
            headers: response.headers,
            body: "",
            redirectChain,
            redirectLimitExceeded: false,
            error: "Redirect without Location header",
          };
        }
        if (hop === MAX_REDIRECTS) {
          redirectLimitExceeded = true;
          return {
            ok: false,
            finalUrl: current,
            status: response.status,
            headers: response.headers,
            body: "",
            redirectChain,
            redirectLimitExceeded,
            error: `Redirect chain exceeded ${MAX_REDIRECTS} hops`,
          };
        }
        current = new URL(location, current).href;
        continue;
      }

      const body = method === "HEAD" ? "" : await response.text();
      return {
        ok: response.status >= 200 && response.status < 400,
        finalUrl: current,
        status: response.status,
        headers: response.headers,
        body,
        redirectChain,
        redirectLimitExceeded: false,
      };
    } catch (error) {
      return {
        ok: false,
        finalUrl: current,
        status: 0,
        headers: new Headers(),
        body: "",
        redirectChain,
        redirectLimitExceeded: false,
        error: error instanceof Error ? error.message : "Fetch failed",
      };
    } finally {
      clearTimeout(timer);
    }
  }

  return {
    ok: false,
    finalUrl: current,
    status: 0,
    headers: new Headers(),
    body: "",
    redirectChain,
    redirectLimitExceeded: true,
    error: "Redirect loop guard",
  };
}

function pushIssue(issues: AuditIssueDraft[], issue: AuditIssueDraft) {
  issues.push(issue);
}

function summarizeBySeverity(
  issues: AuditIssueDraft[],
): Record<SeoAuditIssueSeverity, number> {
  const counts: Record<SeoAuditIssueSeverity, number> = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    info: 0,
  };
  for (const issue of issues) {
    counts[issue.severity] += 1;
  }
  return counts;
}

function emitPageIssues(
  page: PageRecord,
  issues: AuditIssueDraft[],
  sitemapPaths: Set<string>,
) {
  if (!page.title) {
    pushIssue(issues, {
      severity: "critical",
      code: "missing_title",
      url: page.url,
      message: "Page is missing a <title> element.",
    });
  }

  if (!page.metaDescription) {
    pushIssue(issues, {
      severity: "high",
      code: "missing_meta_description",
      url: page.url,
      message: "Page is missing a meta description.",
    });
  }

  if (page.h1Count === 0) {
    pushIssue(issues, {
      severity: "high",
      code: "missing_h1",
      url: page.url,
      message: "Page has no H1 heading.",
    });
  } else if (page.h1Count > 1) {
    pushIssue(issues, {
      severity: "medium",
      code: "multiple_h1",
      url: page.url,
      message: `Page has ${page.h1Count} H1 headings.`,
      evidence: { h1Count: page.h1Count },
    });
  }

  for (const msg of page.headingOrderIssues) {
    pushIssue(issues, {
      severity: "low",
      code: "heading_hierarchy",
      url: page.url,
      message: msg,
    });
  }

  if (page.redirectChain.length > 1) {
    pushIssue(issues, {
      severity: "medium",
      code: "redirect_chain",
      url: page.url,
      message: `Request followed a redirect chain of ${page.redirectChain.length} hops.`,
      evidence: { chain: page.redirectChain },
    });
  }

  if (!page.canonical) {
    pushIssue(issues, {
      severity: "medium",
      code: "missing_canonical",
      url: page.url,
      message: "Page is missing a canonical link.",
    });
  } else {
    try {
      const canonicalUrl = new URL(page.canonical);
      const pageUrl = new URL(page.url);
      if (canonicalUrl.origin !== pageUrl.origin) {
        pushIssue(issues, {
          severity: "high",
          code: "canonical_off_origin",
          url: page.url,
          message: "Canonical URL points to a different origin.",
          evidence: { canonical: page.canonical },
        });
      }
    } catch {
      pushIssue(issues, {
        severity: "high",
        code: "canonical_invalid",
        url: page.url,
        message: "Canonical URL could not be parsed.",
        evidence: { canonical: page.canonical },
      });
    }
  }

  const noindex =
    robotsMetaHasNoindex(page.robotsMeta) ||
    robotsMetaHasNoindex(page.xRobotsTag);
  if (noindex && sitemapPaths.has(normalizePath(page.path))) {
    pushIssue(issues, {
      severity: "critical",
      code: "noindex_sitemap_conflict",
      url: page.url,
      message:
        "Page is marked noindex but is included in the sitemap/registry set.",
      evidence: {
        robotsMeta: page.robotsMeta,
        xRobotsTag: page.xRobotsTag,
      },
    });
  }

  if (page.imagesMissingAlt > 0) {
    pushIssue(issues, {
      severity: "medium",
      code: "images_missing_alt",
      url: page.url,
      message: `${page.imagesMissingAlt} image(s) are missing an alt attribute.`,
      evidence: { count: page.imagesMissingAlt },
    });
  }

  for (const err of page.jsonLdParseErrors) {
    pushIssue(issues, {
      severity: "high",
      code: "json_ld_invalid",
      url: page.url,
      message: `JSON-LD script #${err.index} is not valid JSON.`,
      evidence: { index: err.index, parseError: err.message },
    });
  }
}

/**
 * Runs a bounded technical SEO crawl and persists results.
 * Auth: canMutateContent session OR CRON_SECRET caller.
 */
export async function runAudit(input?: {
  cronSecret?: string | null;
  checkExternalLinks?: boolean;
}): Promise<RunAuditResult> {
  const caller = await resolveAuditCaller({ cronSecret: input?.cronSecret });
  const client = createAdminClient();
  const origin = getSiteOrigin();
  const checkExternal = input?.checkExternalLinks ?? true;

  const now = new Date().toISOString();
  const { data: created, error: createError } = await client
    .from("seo_audits")
    .insert({
      status: "running",
      started_at: now,
      pages_crawled: 0,
      issues_found: 0,
      triggered_by: caller.actorId,
      summary: null,
      error: null,
    })
    .select("*")
    .single();

  if (createError || !created) {
    throw new Error(createError?.message ?? "Failed to create seo_audits row.");
  }

  const audit = created as SeoAudit;
  const issues: AuditIssueDraft[] = [];

  try {
    const settings = await loadCrawlSettings(client);
    const { seedPaths, sitemapPaths } = await loadRegistryPaths(client);

    let robotsRules = parseRobotsTxt(settings.robotsTxt ?? "").rules;
    try {
      const robotsUrl = absoluteUrlFromPath("/robots.txt", origin);
      if (isSafeCrawlUrl(robotsUrl, origin)) {
        const robotsFetch = await fetchChain(robotsUrl);
        if (robotsFetch.status === 200 && robotsFetch.body) {
          robotsRules = parseRobotsTxt(robotsFetch.body).rules;
        }
      }
    } catch {
      // Keep settings robots_txt rules if live fetch fails.
    }

    const queue: QueueItem[] = [];
    const enqueued = new Set<string>();
    const pages: PageRecord[] = [];
    const linkedTargets = new Set<string>();
    const externalCandidates = new Set<string>();

    for (const path of seedPaths) {
      const url = absoluteUrlFromPath(path, origin);
      if (!isSafeCrawlUrl(url, origin)) continue;
      if (!isPathAllowed(pathFromUrl(url), robotsRules)) continue;
      if (enqueued.has(url)) continue;
      enqueued.add(url);
      queue.push({ url, depth: 0 });
    }

    while (queue.length > 0 && pages.length < settings.maxPages) {
      const item = queue.shift();
      if (!item) break;

      if (settings.delayMs > 0 && pages.length > 0) {
        await sleep(settings.delayMs);
      }

      if (!isSafeCrawlUrl(item.url, origin)) {
        continue;
      }

      const fetched = await fetchChain(item.url);

      if (fetched.redirectLimitExceeded) {
        pushIssue(issues, {
          severity: "high",
          code: "redirect_chain_limit",
          url: item.url,
          message: `Redirect chain exceeded ${MAX_REDIRECTS} hops.`,
          evidence: { chain: fetched.redirectChain },
        });
      }

      if (fetched.status === 0) {
        pushIssue(issues, {
          severity: "critical",
          code: "fetch_error",
          url: item.url,
          message: fetched.error ?? "Failed to fetch URL.",
          evidence: { error: fetched.error ?? null },
        });
        continue;
      }

      if (fetched.status >= 400) {
        pushIssue(issues, {
          severity: fetched.status >= 500 ? "critical" : "high",
          code: "broken_link",
          url: item.url,
          message: `URL returned HTTP ${fetched.status}.`,
          evidence: {
            status: fetched.status,
            chain: fetched.redirectChain,
          },
        });
        // Still count as crawled for seed coverage.
        pages.push({
          url: item.url,
          path: pathFromUrl(item.url),
          status: fetched.status,
          redirectChain: fetched.redirectChain,
          title: null,
          metaDescription: null,
          canonical: null,
          robotsMeta: null,
          xRobotsTag: null,
          h1Count: 0,
          headingOrderIssues: [],
          imagesMissingAlt: 0,
          jsonLdParseErrors: [],
          internalLinks: [],
          externalLinks: [],
        });
        continue;
      }

      const contentType = fetched.headers.get("content-type") ?? "";
      const isHtml = /text\/html|application\/xhtml\+xml/i.test(contentType) ||
        fetched.body.includes("<html");

      if (!isHtml) {
        pages.push({
          url: fetched.finalUrl,
          path: pathFromUrl(fetched.finalUrl),
          status: fetched.status,
          redirectChain: fetched.redirectChain,
          title: null,
          metaDescription: null,
          canonical: null,
          robotsMeta: null,
          xRobotsTag: fetched.headers.get("x-robots-tag"),
          h1Count: 0,
          headingOrderIssues: [],
          imagesMissingAlt: 0,
          jsonLdParseErrors: [],
          internalLinks: [],
          externalLinks: [],
        });
        continue;
      }

      const parsed = parseHtmlDocument(fetched.body, fetched.finalUrl);
      const internalLinks: string[] = [];
      const externalLinks: string[] = [];

      for (const link of parsed.links) {
        if (link.isInternal) {
          internalLinks.push(link.absolute);
          linkedTargets.add(normalizePath(pathFromUrl(link.absolute)));
          if (
            item.depth < settings.maxDepth &&
            pages.length + queue.length < settings.maxPages &&
            isSafeCrawlUrl(link.absolute, origin) &&
            isPathAllowed(pathFromUrl(link.absolute), robotsRules) &&
            !enqueued.has(link.absolute)
          ) {
            enqueued.add(link.absolute);
            queue.push({ url: link.absolute, depth: item.depth + 1 });
          }
        } else {
          externalLinks.push(link.absolute);
          if (checkExternal && isSafeExternalCheckUrl(link.absolute, origin)) {
            externalCandidates.add(link.absolute);
          }
        }
      }

      const record: PageRecord = {
        url: fetched.finalUrl,
        path: pathFromUrl(fetched.finalUrl),
        status: fetched.status,
        redirectChain: fetched.redirectChain,
        title: parsed.title,
        metaDescription: parsed.metaDescription,
        canonical: parsed.canonical,
        robotsMeta: parsed.robotsMeta,
        xRobotsTag: fetched.headers.get("x-robots-tag"),
        h1Count: parsed.headingCounts.h1,
        headingOrderIssues: parsed.headingOrderIssues,
        imagesMissingAlt: parsed.imagesMissingAlt.length,
        jsonLdParseErrors: parsed.jsonLdParseErrors,
        internalLinks,
        externalLinks,
      };
      pages.push(record);
      emitPageIssues(record, issues, sitemapPaths);
    }

    // Duplicate titles / descriptions across successfully parsed HTML pages.
    const titleMap = new Map<string, string[]>();
    const descMap = new Map<string, string[]>();
    for (const page of pages) {
      if (page.title) {
        const key = page.title.trim().toLowerCase();
        const list = titleMap.get(key) ?? [];
        list.push(page.url);
        titleMap.set(key, list);
      }
      if (page.metaDescription) {
        const key = page.metaDescription.trim().toLowerCase();
        const list = descMap.get(key) ?? [];
        list.push(page.url);
        descMap.set(key, list);
      }
    }
    for (const [title, urls] of titleMap) {
      if (urls.length < 2) continue;
      for (const url of urls) {
        pushIssue(issues, {
          severity: "high",
          code: "duplicate_title",
          url,
          message: "Duplicate <title> shared with other crawled pages.",
          evidence: { title, urls },
        });
      }
    }
    for (const [description, urls] of descMap) {
      if (urls.length < 2) continue;
      for (const url of urls) {
        pushIssue(issues, {
          severity: "high",
          code: "duplicate_meta_description",
          url,
          message: "Duplicate meta description shared with other crawled pages.",
          evidence: { description, urls },
        });
      }
    }

    // Orphan pages: in sitemap/registry but never linked from crawled HTML.
    for (const path of sitemapPaths) {
      if (linkedTargets.has(path)) continue;
      // Homepage is rarely linked as "/" from itself; still flag only if no inbound.
      const url = absoluteUrlFromPath(path, origin);
      pushIssue(issues, {
        severity: "info",
        code: "orphan_page",
        url,
        message:
          "Path is in the sitemap/registry but was not found as an internal link target during this crawl.",
        evidence: { path },
      });
    }

    // Optional external HEAD checks (never added to frontier).
    if (checkExternal) {
      let checked = 0;
      for (const extUrl of externalCandidates) {
        if (checked >= EXTERNAL_HEAD_LIMIT) break;
        if (!isSafeExternalCheckUrl(extUrl, origin)) continue;
        checked += 1;
        if (settings.delayMs > 0) await sleep(Math.min(settings.delayMs, 250));
        const head = await fetchChain(extUrl, { method: "HEAD" });
        if (head.status >= 400 || head.status === 0) {
          pushIssue(issues, {
            severity: head.status >= 500 || head.status === 0 ? "high" : "medium",
            code: "external_broken_link",
            url: extUrl,
            message:
              head.status === 0
                ? `External HEAD check failed: ${head.error ?? "unknown error"}`
                : `External link returned HTTP ${head.status} (HEAD).`,
            evidence: {
              status: head.status,
              error: head.error ?? null,
            },
          });
        }
      }
    }

    const bySeverity = summarizeBySeverity(issues);
    const finishedAt = new Date().toISOString();
    const summary = {
      origin,
      pages_crawled: pages.length,
      issues_found: issues.length,
      by_severity: bySeverity,
      limits: {
        max_pages: settings.maxPages,
        max_depth: settings.maxDepth,
        delay_ms: settings.delayMs,
      },
      external_head_checked: checkExternal
        ? Math.min(externalCandidates.size, EXTERNAL_HEAD_LIMIT)
        : 0,
      labeled: "Issues below were observed by the crawler; none are invented.",
    };

    if (issues.length > 0) {
      const rows = issues.map((issue) => ({
        audit_id: audit.id,
        severity: issue.severity,
        code: issue.code,
        url: issue.url,
        message: issue.message,
        evidence: issue.evidence ? JSON.stringify(issue.evidence) : null,
        resolution: "open" as SeoIssueResolution,
      }));

      // Insert in chunks to avoid payload limits.
      const chunkSize = 100;
      for (let i = 0; i < rows.length; i += chunkSize) {
        const chunk = rows.slice(i, i + chunkSize);
        const { error: insertError } = await client
          .from("seo_audit_issues")
          .insert(chunk);
        if (insertError) {
          throw new Error(insertError.message);
        }
      }
    }

    const { data: finished, error: finishError } = await client
      .from("seo_audits")
      .update({
        status: "completed",
        finished_at: finishedAt,
        pages_crawled: pages.length,
        issues_found: issues.length,
        summary,
        error: null,
      })
      .eq("id", audit.id)
      .select("*")
      .single();

    if (finishError || !finished) {
      throw new Error(finishError?.message ?? "Failed to finalize audit.");
    }

    return { audit: finished as SeoAudit, issues };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Audit failed.";
    await client
      .from("seo_audits")
      .update({
        status: "failed",
        finished_at: new Date().toISOString(),
        error: message,
        issues_found: issues.length,
      })
      .eq("id", audit.id);
    throw error;
  }
}
