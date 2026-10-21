import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSeoSession } from "@/lib/seo/auth";
import { AdminLoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const session = await getSeoSession();
  if (session) redirect("/admin");

  return (
    <div className="admin-login-screen">
      <div className="admin-access-denied__card">
        <p className="admin-access-denied__eyebrow">Admin Panel</p>
        <h1>Sign in</h1>
        <p>Use the admin username and password to open the panel.</p>
        <AdminLoginForm />
      </div>
    </div>
  );
}
