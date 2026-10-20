"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  SeoAuthError,
  canManageSettings,
  requireSeoRole,
} from "@/lib/seo/auth";
import { isGoogleOAuthConfigured } from "@/lib/seo/google/oauth";
import { syncGa4, syncGsc, type SyncResult } from "@/lib/seo/google/sync";
import {
  getPublicConnection,
  listPublicConnections,
  updateConnectionFields,
} from "@/lib/seo/google/tokens";
import type {
  SeoGoogleConnectionPublic,
  SeoGoogleProvider,
  SeoRole,
} from "@/lib/seo/types";

export type ActionOk<T> = { ok: true; data: T };
export type ActionErr = { ok: false; error: string };
export type ActionResult<T> = ActionOk<T> | ActionErr;

const MANAGE_ROLES: SeoRole[] = ["owner", "admin"];
const READ_ROLES: SeoRole[] = ["owner", "admin", "editor", "viewer"];

function err(message: string): ActionErr {
  return { ok: false, error: message };
}

function ok<T>(data: T): ActionOk<T> {
  return { ok: true, data };
}

function asErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof SeoAuthError) return error.message;
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

async function requireManager() {
  const session = await requireSeoRole(...MANAGE_ROLES);
  if (!canManageSettings(session.role)) {
    throw new SeoAuthError("Owners and admins can manage integrations.", 403);
  }
  return session;
}

function revalidateIntegrations() {
  revalidatePath("/admin/integrations");
  revalidatePath("/admin");
}

export async function getGoogleOAuthStatus(): Promise<
  ActionResult<{ configured: boolean }>
> {
  try {
    await requireSeoRole(...READ_ROLES);
    return ok({ configured: isGoogleOAuthConfigured() });
  } catch (error) {
    return err(asErrorMessage(error, "Failed to read OAuth status."));
  }
}

export async function listGoogleConnections(): Promise<
  ActionResult<SeoGoogleConnectionPublic[]>
> {
  try {
    await requireSeoRole(...READ_ROLES);
    const connections = await listPublicConnections();
    return ok(connections);
  } catch (error) {
    return err(asErrorMessage(error, "Failed to list Google connections."));
  }
}

export async function getGoogleConnection(
  provider: SeoGoogleProvider,
): Promise<ActionResult<SeoGoogleConnectionPublic | null>> {
  try {
    await requireSeoRole(...READ_ROLES);
    const connection = await getPublicConnection(provider);
    return ok(connection);
  } catch (error) {
    return err(asErrorMessage(error, "Failed to load Google connection."));
  }
}

const connectionFieldsSchema = z.object({
  provider: z.enum(["gsc", "ga4"]),
  site_url: z.string().max(2000).nullable().optional(),
  property_id: z.string().max(200).nullable().optional(),
});

export async function saveGoogleConnectionFields(
  input: z.infer<typeof connectionFieldsSchema>,
): Promise<ActionResult<SeoGoogleConnectionPublic>> {
  try {
    await requireManager();
    const parsed = connectionFieldsSchema.safeParse(input);
    if (!parsed.success) {
      return err(parsed.error.issues[0]?.message ?? "Invalid fields.");
    }

    const saved = await updateConnectionFields({
      provider: parsed.data.provider,
      siteUrl: parsed.data.site_url,
      propertyId: parsed.data.property_id,
    });

    revalidateIntegrations();
    return ok(saved);
  } catch (error) {
    return err(asErrorMessage(error, "Failed to save connection fields."));
  }
}

export async function runGoogleSync(
  provider: SeoGoogleProvider,
): Promise<ActionResult<SyncResult>> {
  try {
    await requireManager();

    const connection = await getPublicConnection(provider);
    if (!connection?.has_refresh_token) {
      return ok({ ok: false, reason: "not_configured" });
    }

    let result: SyncResult;
    if (provider === "gsc") {
      if (!connection.site_url) {
        return ok({
          ok: false,
          reason: "missing_site_url",
          message: "Set a Search Console site URL before syncing.",
        });
      }
      result = await syncGsc(connection.site_url);
    } else {
      if (!connection.property_id) {
        return ok({
          ok: false,
          reason: "missing_property_id",
          message: "Set a GA4 property ID before syncing.",
        });
      }
      result = await syncGa4(connection.property_id);
    }

    revalidateIntegrations();
    return ok(result);
  } catch (error) {
    return err(asErrorMessage(error, "Failed to sync Google data."));
  }
}
