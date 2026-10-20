import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import {
  getGoogleOAuthConfig,
  refreshAccessToken,
} from "@/lib/seo/google/oauth";
import {
  loadRefreshToken,
  setConnectionStatus,
} from "@/lib/seo/google/tokens";

export type SyncOk = {
  ok: true;
  provider: "gsc" | "ga4";
  metric_date: string;
  snapshot_id: string;
};

export type SyncFail = {
  ok: false;
  reason: string;
  message?: string;
};

export type SyncResult = SyncOk | SyncFail;

function isoDate(daysAgo = 0): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

async function getAccessToken(
  provider: "gsc" | "ga4",
): Promise<{ ok: true; token: string } | SyncFail> {
  if (!getGoogleOAuthConfig()) {
    return { ok: false, reason: "not_configured" };
  }

  let refreshToken: string | null;
  try {
    refreshToken = await loadRefreshToken(provider);
  } catch (error) {
    return {
      ok: false,
      reason: "token_error",
      message:
        error instanceof Error ? error.message : "Failed to load refresh token.",
    };
  }

  if (!refreshToken) {
    return { ok: false, reason: "not_configured" };
  }

  try {
    const tokens = await refreshAccessToken(refreshToken);
    return { ok: true, token: tokens.access_token };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Token refresh failed.";
    await setConnectionStatus({
      provider,
      status: "error",
      lastError: message,
    });
    return { ok: false, reason: "auth_error", message };
  }
}

async function upsertSnapshot(input: {
  provider: "gsc" | "ga4";
  metricDate: string;
  dimension: string;
  payload: Record<string, unknown>;
}): Promise<string> {
  const client = createAdminClient();
  const { data, error } = await client
    .from("seo_google_snapshots")
    .upsert(
      {
        provider: input.provider,
        metric_date: input.metricDate,
        dimension: input.dimension,
        payload: input.payload,
      },
      { onConflict: "provider,metric_date,dimension" },
    )
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  return data.id as string;
}

/**
 * Pulls Search Console searchAnalytics for the last complete day.
 * Returns { ok:false, reason:'not_configured' } when OAuth/token is missing.
 */
export async function syncGsc(siteUrl: string): Promise<SyncResult> {
  const trimmed = siteUrl.trim();
  if (!trimmed) {
    return {
      ok: false,
      reason: "missing_site_url",
      message: "GSC site URL is required (e.g. https://www.example.com/).",
    };
  }

  const auth = await getAccessToken("gsc");
  if (!auth.ok) return auth;

  await setConnectionStatus({
    provider: "gsc",
    status: "syncing",
    lastError: null,
  });

  const metricDate = isoDate(3);
  const endDate = metricDate;
  const startDate = isoDate(30);

  try {
    const encodedSite = encodeURIComponent(trimmed);
    const response = await fetch(
      `https://www.googleapis.com/webmasters/v3/sites/${encodedSite}/searchAnalytics/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${auth.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startDate,
          endDate,
          dimensions: [],
          rowLimit: 1,
        }),
      },
    );

    const body = (await response.json()) as {
      rows?: Array<{
        clicks?: number;
        impressions?: number;
        ctr?: number;
        position?: number;
      }>;
      error?: { message?: string };
    };

    if (!response.ok) {
      const message =
        body.error?.message || `GSC sync failed (${response.status}).`;
      await setConnectionStatus({
        provider: "gsc",
        status: "error",
        lastError: message,
      });
      return { ok: false, reason: "api_error", message };
    }

    const row = body.rows?.[0];
    const totals = {
      clicks: row?.clicks ?? 0,
      impressions: row?.impressions ?? 0,
      ctr: row?.ctr ?? 0,
      position: row?.position ?? 0,
    };

    const topQueriesRes = await fetch(
      `https://www.googleapis.com/webmasters/v3/sites/${encodedSite}/searchAnalytics/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${auth.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startDate,
          endDate,
          dimensions: ["query"],
          rowLimit: 25,
        }),
      },
    );

    let queries: unknown[] = [];
    if (topQueriesRes.ok) {
      const qBody = (await topQueriesRes.json()) as { rows?: unknown[] };
      queries = qBody.rows ?? [];
    }

    const payload = {
      site_url: trimmed,
      range: { startDate, endDate },
      totals,
      clicks: totals.clicks,
      impressions: totals.impressions,
      ctr: totals.ctr,
      position: totals.position,
      queries,
      synced_at: new Date().toISOString(),
    };

    const snapshotId = await upsertSnapshot({
      provider: "gsc",
      metricDate,
      dimension: "daily",
      payload,
    });

    await setConnectionStatus({
      provider: "gsc",
      status: "connected",
      lastError: null,
      lastSyncAt: new Date().toISOString(),
    });

    return {
      ok: true,
      provider: "gsc",
      metric_date: metricDate,
      snapshot_id: snapshotId,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "GSC sync failed.";
    await setConnectionStatus({
      provider: "gsc",
      status: "error",
      lastError: message,
    });
    return { ok: false, reason: "sync_error", message };
  }
}

/**
 * Pulls GA4 runReport metrics for the last 28 days.
 * Returns { ok:false, reason:'not_configured' } when OAuth/token is missing.
 */
export async function syncGa4(propertyId: string): Promise<SyncResult> {
  const trimmed = propertyId.trim().replace(/^properties\//, "");
  if (!trimmed) {
    return {
      ok: false,
      reason: "missing_property_id",
      message: "GA4 property ID is required (e.g. 123456789).",
    };
  }

  const auth = await getAccessToken("ga4");
  if (!auth.ok) return auth;

  await setConnectionStatus({
    provider: "ga4",
    status: "syncing",
    lastError: null,
  });

  const metricDate = isoDate(1);
  const startDate = isoDate(28);
  const endDate = metricDate;

  try {
    const response = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/properties/${trimmed}:runReport`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${auth.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dateRanges: [{ startDate, endDate }],
          metrics: [
            { name: "sessions" },
            { name: "totalUsers" },
            { name: "screenPageViews" },
            { name: "bounceRate" },
          ],
        }),
      },
    );

    const body = (await response.json()) as {
      rows?: Array<{
        metricValues?: Array<{ value?: string }>;
      }>;
      error?: { message?: string };
    };

    if (!response.ok) {
      const message =
        body.error?.message || `GA4 sync failed (${response.status}).`;
      await setConnectionStatus({
        provider: "ga4",
        status: "error",
        lastError: message,
      });
      return { ok: false, reason: "api_error", message };
    }

    const values = body.rows?.[0]?.metricValues ?? [];
    const read = (index: number) => {
      const raw = values[index]?.value;
      if (raw == null || raw === "") return null;
      const n = Number(raw);
      return Number.isFinite(n) ? n : null;
    };

    const payload = {
      property_id: trimmed,
      range: { startDate, endDate },
      totals: {
        sessions: read(0),
        totalUsers: read(1),
        screenPageViews: read(2),
        bounceRate: read(3),
      },
      synced_at: new Date().toISOString(),
    };

    const snapshotId = await upsertSnapshot({
      provider: "ga4",
      metricDate,
      dimension: "daily",
      payload,
    });

    await setConnectionStatus({
      provider: "ga4",
      status: "connected",
      lastError: null,
      lastSyncAt: new Date().toISOString(),
    });

    return {
      ok: true,
      provider: "ga4",
      metric_date: metricDate,
      snapshot_id: snapshotId,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "GA4 sync failed.";
    await setConnectionStatus({
      provider: "ga4",
      status: "error",
      lastError: message,
    });
    return { ok: false, reason: "sync_error", message };
  }
}

/**
 * Syncs both providers using stored site_url / property_id when present.
 */
export async function syncAllConfigured(): Promise<{
  gsc: SyncResult;
  ga4: SyncResult;
}> {
  const client = createAdminClient();
  const { data } = await client
    .from("seo_google_connections")
    .select("provider, site_url, property_id, encrypted_refresh_token, status");

  const rows = (data ?? []) as Array<{
    provider: "gsc" | "ga4";
    site_url: string | null;
    property_id: string | null;
    encrypted_refresh_token: string | null;
    status: string;
  }>;

  const gscRow = rows.find((r) => r.provider === "gsc");
  const ga4Row = rows.find((r) => r.provider === "ga4");

  const gsc: SyncResult =
    gscRow?.encrypted_refresh_token && gscRow.site_url
      ? await syncGsc(gscRow.site_url)
      : { ok: false, reason: "not_configured" };

  const ga4: SyncResult =
    ga4Row?.encrypted_refresh_token && ga4Row.property_id
      ? await syncGa4(ga4Row.property_id)
      : { ok: false, reason: "not_configured" };

  return { gsc, ga4 };
}
