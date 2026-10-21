import "server-only";

import { cookies } from "next/headers";
import { createClient as createAdminClient } from "@/lib/supabase/admin";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/admin-session";
import {
  SEO_ROLES,
  canManageSettings,
  canMutateContent,
  canReadAdmin,
  isSeoRole,
} from "@/lib/seo/roles";
import type { SeoRole, SeoSession } from "@/lib/seo/types";

export type { SeoRole, SeoSession };
export {
  SEO_ROLES,
  canManageSettings,
  canMutateContent,
  canReadAdmin,
  isSeoRole,
};

/**
 * Returns the fixed admin session, or null when the admin cookie is missing.
 */
export async function getSeoSession(): Promise<SeoSession | null> {
  const store = await cookies();
  const ok = await verifyAdminToken(store.get(ADMIN_COOKIE)?.value);
  if (!ok) return null;

  return {
    userId: "admin",
    email: "admin",
    role: "admin",
  };
}

export class SeoAuthError extends Error {
  readonly status: number;

  constructor(message: string, status = 403) {
    super(message);
    this.name = "SeoAuthError";
    this.status = status;
  }
}

/**
 * Requires an authenticated SEO session with one of the given roles.
 * Throws SeoAuthError (401/403) when unauthorized.
 */
export async function requireSeoRole(
  ...roles: SeoRole[]
): Promise<SeoSession> {
  const session = await getSeoSession();
  if (!session) {
    throw new SeoAuthError("Authentication required for SEO admin.", 401);
  }

  if (roles.length > 0 && !roles.includes(session.role)) {
    throw new SeoAuthError(
      `Insufficient role. Required: ${roles.join(", ")}.`,
      403,
    );
  }

  return session;
}

/**
 * Upserts the Clerk user into seo_profiles so DB mirrors publicMetadata.role.
 */
export async function syncProfileToDb(
  session: SeoSession,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const admin = createAdminClient();
    const { error } = await admin.from("seo_profiles").upsert(
      {
        user_id: session.userId,
        email: session.email,
        role: session.role,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    );

    if (error) {
      return { ok: false, error: error.message };
    }

    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { ok: false, error: message };
  }
}
