# Elite Solutions USA — SEO Admin

Hybrid SEO management panel at `/admin`. Page bodies stay in Next.js (`src/data/*` + studio components). Supabase stores SEO metadata, settings, audits, keywords, and optional Google sync data.

## Supabase project

- **Name:** Elite Solutions USA SEO  
- **Ref:** `xajonksqzaryhvpdtgrj`  
- **URL:** `https://xajonksqzaryhvpdtgrj.supabase.co`  
- **Region:** `us-east-1`

Get the **service role** key from:  
[Project API settings](https://supabase.com/dashboard/project/xajonksqzaryhvpdtgrj/settings/api)

## Environment variables

Copy from `.env.example` and fill:

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Public reads (published SEO) |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes (admin) | Admin mutations after Clerk authz |
| `SEO_SITE_ORIGIN` | Yes | Crawl allowlist origin |
| `SEO_ADMIN_BOOTSTRAP_USER_IDS` | Bootstrap | Comma-separated Clerk user IDs → `owner` |
| `SEO_TOKEN_ENCRYPTION_KEY` | Google | 32-byte secret for token encryption |
| `CRON_SECRET` | Cron | Protects `/api/seo/cron/*` |
| `GOOGLE_OAUTH_CLIENT_ID` | Optional | GSC/GA4 OAuth |
| `GOOGLE_OAUTH_CLIENT_SECRET` | Optional | GSC/GA4 OAuth |
| `GOOGLE_OAUTH_REDIRECT_URI` | Optional | e.g. `https://www.elitesolutionusa.com/api/seo/google/callback` |

Keep existing Clerk, SMTP, and reCAPTCHA variables.

## Roles (Clerk `publicMetadata.role`)

| Role | Access |
|------|--------|
| `owner` | Full access + user role changes |
| `admin` | Settings, integrations, audits, content |
| `editor` | Content/keywords mutations |
| `viewer` | Read-only admin |

Bootstrap: set `SEO_ADMIN_BOOTSTRAP_USER_IDS` to your Clerk user id, sign in, open `/admin`. Then set `publicMetadata.role` in the Clerk dashboard for permanent roles.

## Public site behavior

- `generateMetadata` merges published `seo_pages` onto code defaults.
- If Supabase is unreachable, code defaults are used (site never breaks).
- `/sitemap.xml` and `/robots.txt` are generated from DB + safe fallbacks.
- Publishing calls `revalidateTag("seo")` so HTML updates.

## Admin routes

| Path | Purpose |
|------|---------|
| `/admin` | Dashboard (live GSC only when connected) |
| `/admin/pages` | SEO metadata CRUD |
| `/admin/blogs` | Blog SEO overlays (bodies stay in code) |
| `/admin/keywords` | Keywords, manual rankings, cannibalization |
| `/admin/audits` | Technical crawl audits |
| `/admin/tools` | Redirects, robots, sitemap, CSV, templates |
| `/admin/integrations` | GSC / GA4 connect |
| `/admin/users` | Role management |
| `/admin/settings` | Site SEO settings |

## Cron

```bash
curl -X POST https://www.elitesolutionusa.com/api/seo/cron/audit \
  -H "Authorization: Bearer $CRON_SECRET"

curl -X POST https://www.elitesolutionusa.com/api/seo/cron/sync \
  -H "Authorization: Bearer $CRON_SECRET"
```

## Google setup (optional)

1. Create a Google Cloud OAuth client (Web).
2. Enable **Search Console API** and **Google Analytics Data API**.
3. Set redirect URI to `GOOGLE_OAUTH_REDIRECT_URI`.
4. Set encryption key and OAuth env vars.
5. Connect from `/admin/integrations`.

Without these vars, core SEO CRUD and audits still work. Metrics show **Disconnected**.

## Local commands

```bash
npm run dev
npm test
npm run build
```

## Limitations

- Not a full CMS — page/service/blog **bodies** remain in TypeScript.
- Search volume / difficulty / competitor SERP ranks require a paid external API (not bundled).
- Internal SEO score is an editorial checklist, **not** a Google ranking factor.
- In-memory rate limits are per-instance (fine for low traffic).
- Crawler is same-origin only and capped by `seo_site_settings` crawl limits.

## Deployment checklist

1. Set all required env vars on Vercel (including `SUPABASE_SERVICE_ROLE_KEY`).
2. Confirm Clerk production keys and bootstrap/owner role.
3. Deploy; visit `/admin` while signed in.
4. Publish a metadata change; verify `<title>` / meta description on the public page.
5. Hit `/sitemap.xml` and `/robots.txt`.
6. Optionally schedule cron for audits and Google sync.
