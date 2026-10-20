import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { canManageSettings, getSeoSession } from "@/lib/seo/auth";
import { clearConnection } from "@/lib/seo/google/tokens";
import type { SeoGoogleProvider } from "@/lib/seo/types";

export const runtime = "nodejs";

function parseProvider(value: unknown): SeoGoogleProvider | null {
  if (value === "gsc" || value === "ga4") return value;
  return null;
}

export async function POST(request: Request) {
  const session = await getSeoSession();
  if (!session || !canManageSettings(session.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let provider: SeoGoogleProvider | null = null;
  const contentType = request.headers.get("content-type") ?? "";

  try {
    if (contentType.includes("application/json")) {
      const body = (await request.json()) as { provider?: unknown };
      provider = parseProvider(body.provider);
    } else {
      const form = await request.formData();
      provider = parseProvider(form.get("provider"));
    }
  } catch {
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  }

  if (!provider) {
    return NextResponse.json(
      { error: "provider must be gsc or ga4." },
      { status: 400 },
    );
  }

  try {
    await clearConnection(provider);
    revalidatePath("/admin/integrations");
    revalidatePath("/admin");
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Disconnect failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  const accept = request.headers.get("accept") ?? "";
  if (accept.includes("text/html")) {
    return NextResponse.redirect(
      new URL(`/admin/integrations?disconnected=${provider}`, request.url),
      303,
    );
  }

  return NextResponse.json({ ok: true, provider });
}

export async function GET(request: Request) {
  const session = await getSeoSession();
  if (!session || !canManageSettings(session.role)) {
    return NextResponse.redirect(
      new URL("/admin/integrations?error=forbidden", request.url),
    );
  }

  const url = new URL(request.url);
  const provider = parseProvider(url.searchParams.get("provider"));
  if (!provider) {
    return NextResponse.redirect(
      new URL("/admin/integrations?error=invalid_provider", request.url),
    );
  }

  try {
    await clearConnection(provider);
    revalidatePath("/admin/integrations");
    revalidatePath("/admin");
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Disconnect failed.";
    return NextResponse.redirect(
      new URL(
        `/admin/integrations?error=${encodeURIComponent(message)}`,
        request.url,
      ),
    );
  }

  return NextResponse.redirect(
    new URL(`/admin/integrations?disconnected=${provider}`, request.url),
  );
}
