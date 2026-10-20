"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/pages", label: "Pages" },
  { href: "/admin/blogs", label: "Blogs" },
  { href: "/admin/keywords", label: "Keywords" },
  { href: "/admin/audits", label: "Audits" },
  { href: "/admin/tools", label: "Tools" },
  { href: "/admin/integrations", label: "Integrations" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/settings", label: "Settings" },
] as const;

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminSidebar({
  role,
  email,
}: {
  role: string;
  email?: string | null;
}) {
  const pathname = usePathname() ?? "/admin";
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.classList.toggle("admin-nav-open", open);
    return () => document.body.classList.remove("admin-nav-open");
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="admin-nav-toggle"
        aria-expanded={open}
        aria-controls="admin-sidebar"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="admin-nav-toggle__bars" aria-hidden />
        Menu
      </button>

      <div
        className={`admin-sidebar-backdrop${open ? " is-open" : ""}`}
        onClick={() => setOpen(false)}
        aria-hidden
      />

      <aside
        id="admin-sidebar"
        className={`admin-sidebar${open ? " is-open" : ""}`}
      >
        <div className="admin-sidebar__brand">
          <Link href="/admin" className="admin-sidebar__logo">
            <span className="admin-sidebar__mark">ES</span>
            <span className="admin-sidebar__text">
              <strong>Admin Panel</strong>
              <small>Elite Solutions</small>
            </span>
          </Link>
        </div>

        <nav className="admin-sidebar__nav" aria-label="Admin">
          {NAV.map((item) => {
            const active = isActive(
              pathname,
              item.href,
              "exact" in item ? item.exact : false,
            );
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`admin-nav-link${active ? " is-active" : ""}`}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="admin-sidebar__meta">
          <span className="admin-badge admin-badge--role">{role}</span>
          {email ? <p className="admin-sidebar__email">{email}</p> : null}
          <Link className="admin-sidebar__site" href="/" target="_blank">
            View site ↗
          </Link>
        </div>
      </aside>
    </>
  );
}
