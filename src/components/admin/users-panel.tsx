"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateUserRole } from "@/lib/seo/actions";
import type { SeoProfile, SeoRole } from "@/lib/seo/types";
import { EmptyState } from "@/components/admin/empty-state";

type UsersPanelProps = {
  profiles: SeoProfile[];
  canManage: boolean;
  note?: string | null;
};

const ROLES: SeoRole[] = ["owner", "admin", "editor", "viewer"];

export function UsersPanel({ profiles, canManage, note }: UsersPanelProps) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function handleRoleChange(userId: string, role: SeoRole) {
    if (!canManage) return;
    setError(null);
    setMessage(null);
    setPendingId(userId);
    startTransition(async () => {
      const result = await updateUserRole({ userId, role });
      setPendingId(null);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setMessage(
        "Role updated in seo_profiles and Clerk publicMetadata.role (when Clerk sync succeeds).",
      );
      router.refresh();
    });
  }

  if (profiles.length === 0) {
    return (
      <EmptyState
        title="No profiles yet"
        description="Profiles appear after SEO admins sync via Clerk. Bootstrap owners with SEO_ADMIN_BOOTSTRAP_USER_IDS."
      />
    );
  }

  return (
    <div>
      <p className="admin-card__meta" style={{ marginBottom: 12 }}>
        Clerk <code>publicMetadata.role</code> must match <code>seo_profiles.role</code>{" "}
        for access checks. Role changes attempt{" "}
        <code>clerkClient().users.updateUser</code> automatically.
      </p>
      {note ? <p className="admin-flash admin-flash--warn">{note}</p> : null}
      {error ? <p className="admin-flash admin-flash--error">{error}</p> : null}
      {message ? <p className="admin-flash admin-flash--ok">{message}</p> : null}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Role</th>
              <th>User ID</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((profile) => (
              <tr key={profile.id}>
                <td>{profile.email ?? "—"}</td>
                <td>
                  {canManage ? (
                    <select
                      value={profile.role}
                      disabled={pendingId === profile.user_id}
                      onChange={(e) =>
                        handleRoleChange(
                          profile.user_id,
                          e.target.value as SeoRole,
                        )
                      }
                    >
                      {ROLES.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span className="admin-badge admin-badge--role">
                      {profile.role}
                    </span>
                  )}
                </td>
                <td>
                  <code style={{ fontSize: 12 }}>{profile.user_id}</code>
                </td>
                <td>{new Date(profile.updated_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
