import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import { decryptSecret, encryptSecret } from "@/lib/seo/crypto";
import { GOOGLE_SCOPES } from "@/lib/seo/google/oauth";
import type {
  SeoGoogleConnection,
  SeoGoogleConnectionPublic,
  SeoGoogleConnectionStatus,
  SeoGoogleProvider,
} from "@/lib/seo/types";

function toPublic(
  row: SeoGoogleConnection | null,
): SeoGoogleConnectionPublic | null {
  if (!row) return null;
  const { encrypted_refresh_token, ...rest } = row;
  return {
    ...rest,
    has_refresh_token: Boolean(encrypted_refresh_token),
  };
}

/**
 * Loads a connection row for admin UI. Never includes the encrypted token.
 */
export async function getPublicConnection(
  provider: SeoGoogleProvider,
): Promise<SeoGoogleConnectionPublic | null> {
  const client = createAdminClient();
  const { data, error } = await client
    .from("seo_google_connections")
    .select("*")
    .eq("provider", provider)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return toPublic((data as SeoGoogleConnection | null) ?? null);
}

export async function listPublicConnections(): Promise<
  SeoGoogleConnectionPublic[]
> {
  const client = createAdminClient();
  const { data, error } = await client
    .from("seo_google_connections")
    .select("*")
    .order("provider", { ascending: true });

  if (error) throw new Error(error.message);
  return ((data ?? []) as SeoGoogleConnection[])
    .map((row) => toPublic(row))
    .filter((row): row is SeoGoogleConnectionPublic => row != null);
}

/**
 * Decrypts and returns the refresh token for server-side Google API calls.
 * NEVER expose the return value to the client.
 */
export async function loadRefreshToken(
  provider: SeoGoogleProvider,
): Promise<string | null> {
  const client = createAdminClient();
  const { data, error } = await client
    .from("seo_google_connections")
    .select("encrypted_refresh_token")
    .eq("provider", provider)
    .maybeSingle();

  if (error) throw new Error(error.message);
  const encrypted = data?.encrypted_refresh_token as string | null | undefined;
  if (!encrypted) return null;
  return decryptSecret(encrypted);
}

export async function storeRefreshToken(input: {
  provider: SeoGoogleProvider;
  refreshToken: string;
  connectedBy: string | null;
  scopes?: string[];
  siteUrl?: string | null;
  propertyId?: string | null;
}): Promise<SeoGoogleConnectionPublic> {
  const client = createAdminClient();
  const encrypted = encryptSecret(input.refreshToken);
  const now = new Date().toISOString();

  const { data: existing } = await client
    .from("seo_google_connections")
    .select("*")
    .eq("provider", input.provider)
    .maybeSingle();

  const payload = {
    provider: input.provider,
    encrypted_refresh_token: encrypted,
    scopes: input.scopes?.length ? input.scopes : [...GOOGLE_SCOPES],
    status: "connected" as SeoGoogleConnectionStatus,
    last_error: null,
    connected_by: input.connectedBy,
    updated_at: now,
    site_url:
      input.siteUrl !== undefined
        ? input.siteUrl
        : ((existing as SeoGoogleConnection | null)?.site_url ?? null),
    property_id:
      input.propertyId !== undefined
        ? input.propertyId
        : ((existing as SeoGoogleConnection | null)?.property_id ?? null),
  };

  const { data, error } = existing
    ? await client
        .from("seo_google_connections")
        .update(payload)
        .eq("id", (existing as SeoGoogleConnection).id)
        .select("*")
        .single()
    : await client
        .from("seo_google_connections")
        .insert(payload)
        .select("*")
        .single();

  if (error) throw new Error(error.message);
  const publicRow = toPublic(data as SeoGoogleConnection);
  if (!publicRow) throw new Error("Failed to store Google connection.");
  return publicRow;
}

export async function updateConnectionFields(input: {
  provider: SeoGoogleProvider;
  siteUrl?: string | null;
  propertyId?: string | null;
}): Promise<SeoGoogleConnectionPublic> {
  const client = createAdminClient();
  const now = new Date().toISOString();

  const patch: Record<string, unknown> = { updated_at: now };
  if (input.siteUrl !== undefined) {
    patch.site_url = input.siteUrl?.trim() ? input.siteUrl.trim() : null;
  }
  if (input.propertyId !== undefined) {
    patch.property_id = input.propertyId?.trim()
      ? input.propertyId.trim()
      : null;
  }

  const { data: existing } = await client
    .from("seo_google_connections")
    .select("id")
    .eq("provider", input.provider)
    .maybeSingle();

  const { data, error } = existing
    ? await client
        .from("seo_google_connections")
        .update(patch)
        .eq("provider", input.provider)
        .select("*")
        .single()
    : await client
        .from("seo_google_connections")
        .insert({
          provider: input.provider,
          status: "disconnected",
          scopes: [...GOOGLE_SCOPES],
          ...patch,
        })
        .select("*")
        .single();

  if (error) throw new Error(error.message);
  const publicRow = toPublic(data as SeoGoogleConnection);
  if (!publicRow) throw new Error("Failed to update Google connection.");
  return publicRow;
}

export async function setConnectionStatus(input: {
  provider: SeoGoogleProvider;
  status: SeoGoogleConnectionStatus;
  lastError?: string | null;
  lastSyncAt?: string | null;
}): Promise<void> {
  const client = createAdminClient();
  const patch: Record<string, unknown> = {
    status: input.status,
    updated_at: new Date().toISOString(),
  };
  if (input.lastError !== undefined) patch.last_error = input.lastError;
  if (input.lastSyncAt !== undefined) patch.last_sync_at = input.lastSyncAt;

  const { error } = await client
    .from("seo_google_connections")
    .update(patch)
    .eq("provider", input.provider);

  if (error) throw new Error(error.message);
}

/**
 * Clears the stored refresh token and marks the provider disconnected.
 */
export async function clearConnection(
  provider: SeoGoogleProvider,
): Promise<void> {
  const client = createAdminClient();
  const now = new Date().toISOString();

  const { data: existing } = await client
    .from("seo_google_connections")
    .select("id")
    .eq("provider", provider)
    .maybeSingle();

  if (!existing) return;

  const { error } = await client
    .from("seo_google_connections")
    .update({
      encrypted_refresh_token: null,
      status: "disconnected",
      last_error: null,
      connected_by: null,
      updated_at: now,
    })
    .eq("provider", provider);

  if (error) throw new Error(error.message);
}
