import type { SeoRole } from "@/lib/seo/types";

export const SEO_ROLES: readonly SeoRole[] = [
  "owner",
  "admin",
  "editor",
  "viewer",
] as const;

export function isSeoRole(value: unknown): value is SeoRole {
  return (
    typeof value === "string" &&
    (SEO_ROLES as readonly string[]).includes(value)
  );
}

export function canReadAdmin(role: SeoRole | null | undefined): boolean {
  return role != null && SEO_ROLES.includes(role);
}

export function canMutateContent(role: SeoRole | null | undefined): boolean {
  return role === "owner" || role === "admin" || role === "editor";
}

export function canManageSettings(role: SeoRole | null | undefined): boolean {
  return role === "owner" || role === "admin";
}
