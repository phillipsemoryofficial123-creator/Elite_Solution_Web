/** Clerk / DB role for SEO admin access. */
export type SeoRole = "owner" | "admin" | "editor" | "viewer";

export type SeoPageType = "static" | "service" | "blog" | "other";

export type SeoPublishStatus =
  | "draft"
  | "published"
  | "scheduled"
  | "unpublished";

export type SeoRankingSource = "manual" | "gsc" | "provider";

export type SeoGoogleProvider = "gsc" | "ga4";

export type SeoGoogleConnectionStatus =
  | "connected"
  | "disconnected"
  | "error"
  | "syncing";

export type SeoAuditIssueSeverity =
  | "critical"
  | "high"
  | "medium"
  | "low"
  | "info";

export type SeoIssueResolution =
  | "open"
  | "acknowledged"
  | "resolved"
  | "ignored";

export type SeoIssueTicketStatus =
  | "open"
  | "in_progress"
  | "resolved"
  | "wont_fix"
  | "ignored";

export type SeoRedirectStatusCode = 301 | 302 | 307 | 308;

export type JsonLdValue =
  | Record<string, unknown>
  | Array<Record<string, unknown>>;

export type SeoProfile = {
  id: string;
  user_id: string;
  email: string | null;
  role: SeoRole;
  created_at: string;
  updated_at: string;
};

export type SeoPage = {
  id: string;
  path: string;
  page_type: SeoPageType;
  title: string | null;
  meta_description: string | null;
  focus_keyword: string | null;
  canonical_url: string | null;
  robots_index: boolean;
  robots_follow: boolean;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
  og_type: string | null;
  twitter_card: string | null;
  twitter_title: string | null;
  twitter_description: string | null;
  twitter_image: string | null;
  json_ld: JsonLdValue | null;
  image_alt_defaults: Record<string, string> | null;
  include_in_sitemap: boolean;
  status: SeoPublishStatus;
  scheduled_at: string | null;
  published_at: string | null;
  seo_score: number | null;
  content_checksum: string | null;
  created_at: string;
  updated_at: string;
};

export type SeoPageRevision = {
  id: string;
  page_id: string;
  snapshot: Record<string, unknown>;
  actor_id: string | null;
  created_at: string;
};

export type SeoBlogOverride = {
  id: string;
  slug: string;
  title: string | null;
  meta_description: string | null;
  focus_keyword: string | null;
  canonical_url: string | null;
  robots_index: boolean;
  robots_follow: boolean;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
  twitter_title: string | null;
  twitter_description: string | null;
  twitter_image: string | null;
  json_ld: JsonLdValue | null;
  include_in_sitemap: boolean;
  status: SeoPublishStatus;
  scheduled_at: string | null;
  published_at: string | null;
  seo_score: number | null;
  created_at: string;
  updated_at: string;
};

export type SeoKeyword = {
  id: string;
  keyword: string;
  intent: string | null;
  keyword_group: string | null;
  tags: string[];
  target_path: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type SeoKeywordRanking = {
  id: string;
  keyword_id: string;
  metric_date: string;
  position: number | null;
  url: string | null;
  source: SeoRankingSource;
  impressions: number | null;
  clicks: number | null;
  ctr: number | null;
  created_at: string;
};

export type SeoCompetitor = {
  id: string;
  domain: string;
  label: string | null;
  notes: string | null;
  created_at: string;
};

export type SeoRedirect = {
  id: string;
  from_path: string;
  to_url: string;
  status_code: SeoRedirectStatusCode;
  enabled: boolean;
  created_at: string;
  updated_at: string;
};

export type SeoSiteSettings = {
  id: string;
  robots_txt: string | null;
  sitemap_defaults: Record<string, unknown> | null;
  meta_templates: Record<string, unknown> | null;
  /** Legacy / UI shape; prefer crawl_max_* columns when present. */
  crawl_limits: {
    max_pages?: number;
    max_depth?: number;
    requests_per_second?: number;
  } | null;
  crawl_max_pages?: number | null;
  crawl_delay_ms?: number | null;
  crawl_max_depth?: number | null;
  created_at: string;
  updated_at: string;
};

export type SeoAudit = {
  id: string;
  status: "pending" | "running" | "completed" | "failed" | "cancelled";
  started_at: string | null;
  finished_at: string | null;
  pages_crawled: number;
  issues_found: number;
  summary: Record<string, unknown> | null;
  error: string | null;
  triggered_by: string | null;
  created_at: string;
};

export type SeoAuditIssue = {
  id: string;
  audit_id: string;
  severity: SeoAuditIssueSeverity;
  code: string;
  url: string;
  message: string;
  /** JSON string or plain text evidence from the crawler. */
  evidence: string | null;
  resolution: SeoIssueResolution;
  created_at: string;
};

export type SeoGoogleConnection = {
  id: string;
  provider: SeoGoogleProvider;
  encrypted_refresh_token: string | null;
  property_id: string | null;
  site_url: string | null;
  scopes: string[];
  status: SeoGoogleConnectionStatus;
  last_sync_at: string | null;
  last_error: string | null;
  connected_by: string | null;
  created_at: string;
  updated_at: string;
};

/** Safe projection for admin UI — never includes encrypted tokens. */
export type SeoGoogleConnectionPublic = Omit<
  SeoGoogleConnection,
  "encrypted_refresh_token"
> & {
  has_refresh_token: boolean;
};

export type SeoGoogleSnapshot = {
  id: string;
  provider: SeoGoogleProvider;
  metric_date: string;
  dimension: string;
  payload: Record<string, unknown>;
  created_at: string;
};

export type SeoActionLog = {
  id: string;
  actor_id: string | null;
  action: string;
  entity: string;
  entity_id: string | null;
  before: Record<string, unknown> | null;
  after: Record<string, unknown> | null;
  ip: string | null;
  created_at: string;
};

export type SeoIssueTicket = {
  id: string;
  audit_issue_id: string | null;
  status: SeoIssueTicketStatus;
  notes: string | null;
  assignee_id: string | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
};

export type SeoSession = {
  userId: string;
  email: string | null;
  role: SeoRole;
};

export type SeoScoreCheck = {
  id: string;
  label: string;
  pass: boolean;
  weight: number;
};

export type SeoScoreResult = {
  score: number;
  checks: SeoScoreCheck[];
};

/** Fields commonly used when scoring a page (DB row or form draft). */
export type SeoScoreInput = {
  title?: string | null;
  meta_description?: string | null;
  focus_keyword?: string | null;
  canonical_url?: string | null;
  og_image?: string | null;
  robots_index?: boolean | null;
  robots_follow?: boolean | null;
  include_in_sitemap?: boolean | null;
};
