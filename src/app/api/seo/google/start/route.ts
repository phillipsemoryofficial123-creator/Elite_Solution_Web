import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { canManageSettings, getSeoSession } from "@/lib/seo/auth";
import {
  buildAuthUrl,
  isGoogleOAuthConfigured,
} from "@/lib/seo/google/oauth";
import type { SeoGoogleProvider } from "@/lib/seo/types";

export const runtime = "nodejs";

const STATE_COOKIE = "seo_google_oauth_state";

function parseProvider(value: string | null): SeoGoogleProvider {
  return value === "ga4" ? "ga4" : "gsc";
}

export async function GET(request: Request) {
  const session = await getSeoSession();
  if (!session || !canManageSettings(session.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!isGoogleOAuthConfigured()) {
    return NextResponse.redirect(
      new URL(
        "/admin/integrations?error=not_configured",
        request.url,
      ),
    );
  }

  const url = new URL(request.url);
  const provider = parseProvider(url.searchParams.get("provider"));
  const nonce = randomBytes(16).toString("hex");
  const state = `${provider}.${nonce}`;

  let authUrl: string;
  try {
    authUrl = buildAuthUrl(state);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "OAuth start failed.";
    return NextResponse.redirect(
      new URL(
        `/admin/integrations?error=${encodeURIComponent(message)}`,
        request.url,
      ),
    );
  }

  const response = NextResponse.redirect(authUrl);
  response.cookies.set(STATE_COOKIE, state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 10,
  });
  return response;
}
