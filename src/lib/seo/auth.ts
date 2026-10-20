import "server-only";

import { currentUser } from "@clerk/nextjs/server";
import { createClient as createAdminClient } from "@/lib/supabase/admin";
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

const OWNER_EMAILS = new Set(
  [
    "phillipsemory.official123@gmail.com",
    "development.elitesolutionusa@gmail.com",
    "info@elitesolutionusa.com",
    "info@elitesolutionscpa.com",
    "usa@elitesolutionusa.com",
  ].map((email) => email.toLowerCase()),
);

const OWNER_EMAIL_DOMAINS = new Set([
  "elitesolutionusa.com",
  "elitesolutionscpa.com",
]);

function parseBootstrapUserIds(): string[] {
  const raw = process.env.SEO_ADMIN_BOOTSTRAP_USER_IDS ?? "";
  return raw
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
}

function collectEmails(user: {
  primaryEmailAddress?: { emailAddress: string } | null;
  emailAddresses: { emailAddress: string }[];
}): string[] {
  const emails = [
    user.primaryEmailAddress?.emailAddress,
    ...user.emailAddresses.map((item) => item.emailAddress),
  ]
    .filter((value): value is string => Boolean(value))
    .map((value) => value.toLowerCase());

  return [...new Set(emails)];
}

function resolveRole(options: {
  userId: string;
  emails: string[];
  publicMetadata: Record<string, unknown> | null | undefined;
}): SeoRole | null {
  if (parseBootstrapUserIds().includes(options.userId)) {
    return "owner";
  }

  if (options.emails.some((email) => isOwnerEmail(email))) {
    return "owner";
  }

  // Local development: any signed-in Clerk user can open the admin panel.
  if (process.env.NODE_ENV !== "production") {
    return "owner";
  }

  const role = options.publicMetadata?.role;
  return isSeoRole(role) ? role : null;
}

function isOwnerEmail(email: string): boolean {
  if (OWNER_EMAILS.has(email)) return true;
  const domain = email.split("@")[1] ?? "";
  return OWNER_EMAIL_DOMAINS.has(domain);
}

async function roleFromProfile(userId: string): Promise<SeoRole | null> {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("seo_profiles")
      .select("role")
      .eq("user_id", userId)
      .maybeSingle();

    if (error || !data) return null;
    return isSeoRole(data.role) ? data.role : null;
  } catch {
    return null;
  }
}

/**
 * Returns the current Clerk user's admin session, or null if unsigned / no role.
 */
export async function getSeoSession(): Promise<SeoSession | null> {
  const user = await currentUser();
  if (!user) return null;

  const emails = collectEmails(user);
  const email = emails[0] ?? null;
  const role =
    resolveRole({
      userId: user.id,
      emails,
      publicMetadata: user.publicMetadata as Record<string, unknown> | undefined,
    }) ?? (await roleFromProfile(user.id));

  if (!role) return null;

  const session: SeoSession = {
    userId: user.id,
    email,
    role,
  };

  void syncProfileToDb(session);
  return session;
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
