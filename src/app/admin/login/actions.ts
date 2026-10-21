"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_COOKIE,
  ADMIN_COOKIE_MAX_AGE,
  createAdminToken,
  credentialsMatch,
} from "@/lib/admin-session";
import { rateLimit } from "@/lib/seo/rate-limit";

export type LoginState = { error: string };

export async function loginAdmin(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const headerStore = await headers();
  const ip =
    headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const limited = rateLimit(`admin-login:${ip}`, 8, 10 * 60 * 1000);
  if (!limited.ok) {
    return { error: "Too many attempts. Try again in a few minutes." };
  }

  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");
  if (!credentialsMatch(username, password)) {
    return { error: "Invalid username or password." };
  }

  const store = await cookies();
  store.set(ADMIN_COOKIE, await createAdminToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_COOKIE_MAX_AGE,
  });

  redirect("/admin");
}

export async function logoutAdmin(): Promise<void> {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
  redirect("/admin/login");
}
