import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/sidebar";
import { getSeoSession } from "@/lib/seo/auth";
import { logoutAdmin } from "./login/actions";
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
  const pathname = (await headers()).get("x-pathname") ?? "";
  if (pathname === "/admin/login") {
    return children;
  }

  const session = await getSeoSession();

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="admin-shell">
      <AdminSidebar role={session.role} email={session.email} />
      <div className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar__title">Elite Solutions · Admin Panel</div>
          <div className="admin-topbar__actions">
            <form action={logoutAdmin}>
              <button className="admin-btn admin-btn--ghost" type="submit">
                Sign out
              </button>
            </form>
          </div>
        </header>
        <div className="admin-content">{children}</div>
      </div>
    </div>
  );
}
