import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/admin-session";

/** Cron routes authenticate via CRON_SECRET, not the admin session. */
const isCronRoute = createRouteMatcher(["/api/seo/cron(.*)"]);

type RedirectRow = { from_path: string; to_url: string; status_code: number };

let redirectCache: { at: number; rows: RedirectRow[] } | null = null;
const REDIRECT_CACHE_MS = 60_000;

async function loadEnabledRedirects(): Promise<RedirectRow[]> {
  const now = Date.now();
  if (redirectCache && now - redirectCache.at < REDIRECT_CACHE_MS) {
    return redirectCache.rows;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return redirectCache?.rows ?? [];

  try {
    const res = await fetch(
      `${url}/rest/v1/seo_redirects?enabled=eq.true&select=from_path,to_url,status_code`,
      {
        headers: {
          apikey: anon,
          Authorization: `Bearer ${anon}`,
        },
      },
    );
    if (!res.ok) return redirectCache?.rows ?? [];
    const rows = (await res.json()) as RedirectRow[];
    redirectCache = { at: now, rows: Array.isArray(rows) ? rows : [] };
    return redirectCache.rows;
  } catch {
    return redirectCache?.rows ?? [];
  }
}

function normalizePath(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }
  return pathname || "/";
}

async function maybeRedirect(request: NextRequest): Promise<NextResponse | null> {
  const path = normalizePath(request.nextUrl.pathname);
  if (path.startsWith("/admin") || path.startsWith("/api") || path.startsWith("/sign-")) {
    return null;
  }

  const rows = await loadEnabledRedirects();
  const match = rows.find((r) => normalizePath(r.from_path) === path);
  if (!match) return null;

  const status =
    match.status_code === 302 || match.status_code === 307 || match.status_code === 308
      ? match.status_code
      : 301;

  const target = match.to_url.startsWith("http")
    ? match.to_url
    : new URL(match.to_url, request.nextUrl.origin).toString();

  return NextResponse.redirect(target, status);
}

export default clerkMiddleware(async (_auth, request) => {
  const redirected = await maybeRedirect(request);
  if (redirected) return redirected;

  const path = request.nextUrl.pathname;
  const needsAdmin =
    (path.startsWith("/admin") && path !== "/admin/login") ||
    (path.startsWith("/api/seo") && !isCronRoute(request));

  if (needsAdmin) {
    const ok = await verifyAdminToken(request.cookies.get(ADMIN_COOKIE)?.value);
    if (!ok) {
      if (path.startsWith("/api/")) {
        return NextResponse.json({ error: "Authentication required." }, { status: 401 });
      }
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);
  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });
  response.headers.set("x-pathname", request.nextUrl.pathname);
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  if (request.nextUrl.pathname.startsWith("/admin")) {
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("Cache-Control", "no-store");
  }
  return response;
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
