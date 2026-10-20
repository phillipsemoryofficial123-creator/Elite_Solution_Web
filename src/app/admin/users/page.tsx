import type { Metadata } from "next";
import { listProfiles } from "@/lib/seo/actions";
import { canManageSettings, getSeoSession } from "@/lib/seo/auth";
import { UsersPanel } from "@/components/admin/users-panel";
import { EmptyState } from "@/components/admin/empty-state";

export const metadata: Metadata = {
  title: "Users",
};

export default async function AdminUsersPage() {
  const session = await getSeoSession();
  const canManage = canManageSettings(session?.role);
  const result = await listProfiles();

  return (
    <div>
      <header className="admin-page-header">
        <div>
          <p className="admin-eyebrow">Access</p>
          <h1>Users</h1>
          <p>
            SEO roles (owner, admin, editor, viewer) mirror Clerk{" "}
            <code>publicMetadata.role</code> and <code>seo_profiles</code>.
          </p>
        </div>
      </header>

      {!result.ok ? (
        <EmptyState title="Could not load users" description={result.error} />
      ) : (
        <UsersPanel
          profiles={result.data}
          canManage={canManage}
          note={
            session
              ? `Signed in as ${session.email ?? session.userId} (${session.role}).`
              : null
          }
        />
      )}
    </div>
  );
}
