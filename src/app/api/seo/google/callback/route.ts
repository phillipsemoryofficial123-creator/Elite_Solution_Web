import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { canManageSettings, getSeoSession } from "@/lib/seo/auth";
import { exchangeCode, GOOGLE_SCOPES } from "@/lib/seo/google/oauth";
import { storeRefreshToken } from "@/lib/seo/google/tokens";
import type { SeoGoogleProvider } from "@/lib/seo/types";

export const runtime = "nodejs";

const STATE_COOKIE = "seo_google_oauth_state";

function parseProviderFromState(state: string): SeoGoogleProvider | null {
  const provider = state.split(".")[0];
  if (provider === "gsc" || provider === "ga4") return provider;
  return null;
}

export async function GET(request: Request) {
  const session = await getSeoSession();
  if (!session || !canManageSettings(session.role)) {
    return NextResponse.redirect(
      new URL("/admin/integrations?error=forbidden", request.url),
    );
  }

  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const oauthError = url.searchParams.get("error");

  const cookieStore = await cookies();
  const expectedState = cookieStore.get(STATE_COOKIE)?.value;

  const clearAndRedirect = (path: string) => {
    const response = NextResponse.redirect(new URL(path, request.url));
    response.cookies.set(STATE_COOKIE, "", {
      httpOnly: true,
      path: "/",
      maxAge: 0,
    });
    return response;
  };

  if (oauthError) {
    return clearAndRedirect(
      `/admin/integrations?error=${encodeURIComponent(oauthError)}`,
    );
  }

  if (!code || !state || !expectedState || state !== expectedState) {
    return clearAndRedirect("/admin/integrations?error=invalid_state");
  }

  const provider = parseProviderFromState(state);
  if (!provider) {
    return clearAndRedirect("/admin/integrations?error=invalid_provider");
  }

  try {
    const tokens = await exchangeCode(code);
    if (!tokens.refresh_token) {
      return clearAndRedirect(
        "/admin/integrations?error=missing_refresh_token",
      );
    }

    const scopes =
      tokens.scope?.split(/\s+/).filter(Boolean) ?? [...GOOGLE_SCOPES];

    await storeRefreshToken({
      provider,
      refreshToken: tokens.refresh_token,
      connectedBy: session.userId,
      scopes,
    });

    return clearAndRedirect(
      `/admin/integrations?connected=${provider}`,
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "OAuth callback failed.";
    return clearAndRedirect(
      `/admin/integrations?error=${encodeURIComponent(message)}`,
    );
  }
}
