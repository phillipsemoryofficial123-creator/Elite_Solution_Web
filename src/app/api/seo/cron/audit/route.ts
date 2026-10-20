import { NextResponse } from "next/server";
import { SeoAuthError } from "@/lib/seo/auth";
import { runAudit } from "@/lib/seo/crawler/run-audit";
import { rateLimit } from "@/lib/seo/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 300;

function extractSecret(request: Request): string | null {
  const header = request.headers.get("authorization");
  if (header?.toLowerCase().startsWith("bearer ")) {
    return header.slice(7).trim() || null;
  }
  const url = new URL(request.url);
  const querySecret = url.searchParams.get("secret");
  return querySecret?.trim() || null;
}

export async function POST(request: Request) {
  try {
    const cronSecret = extractSecret(request);
    if (!cronSecret) {
      return NextResponse.json(
        { ok: false, error: "Missing Authorization Bearer or ?secret=" },
        { status: 401 },
      );
    }

    if (!process.env.CRON_SECRET) {
      return NextResponse.json(
        { ok: false, error: "CRON_SECRET is not configured." },
        { status: 500 },
      );
    }

    const limited = rateLimit("cron:audit", 3, 60_000);
    if (!limited.ok) {
      return NextResponse.json(
        { ok: false, error: "Rate limit exceeded. Try again shortly." },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil(limited.retryAfterMs / 1000)),
          },
        },
      );
    }

    const result = await runAudit({ cronSecret });
    return NextResponse.json({
      ok: true,
      audit: {
        id: result.audit.id,
        status: result.audit.status,
        pages_crawled: result.audit.pages_crawled,
        issues_found: result.audit.issues_found,
        summary: result.audit.summary,
      },
    });
  } catch (error) {
    if (error instanceof SeoAuthError) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.status },
      );
    }
    const message = error instanceof Error ? error.message : "Audit failed.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
