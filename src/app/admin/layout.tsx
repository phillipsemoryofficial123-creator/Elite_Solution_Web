import type { Metadata } from "next";
import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { AccessDenied } from "@/components/admin/access-denied";
import { AdminSidebar } from "@/components/admin/sidebar";
import { getSeoSession } from "@/lib/seo/auth";
import "./admin.css";

export const metadata: Metadata = {
  title: {
    default: "Admin Panel",
    template: "%s | Admin Panel",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSeoSession();

  if (!session) {
    const user = await currentUser();
    const email =
      user?.primaryEmailAddress?.emailAddress ??
      user?.emailAddresses[0]?.emailAddress ??
      null;
    return <AccessDenied email={email} />;
  }

  return (
    <div className="admin-shell">
      <AdminSidebar role={session.role} email={session.email} />
      <div className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar__title">Elite Solutions · Admin Panel</div>
          <div className="admin-topbar__actions">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "admin-avatar",
                },
              }}
            />
          </div>
        </header>
        <div className="admin-content">{children}</div>
      </div>
    </div>
  );
}
