import type { Metadata } from "next";
import { AuditsPanel } from "@/components/admin/audits-panel";
import { EmptyState } from "@/components/admin/empty-state";
import { canMutateContent, getSeoSession } from "@/lib/seo/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import type { SeoAudit } from "@/lib/seo/types";

export const metadata: Metadata = {
  title: "Audits",
};

async function loadAudits(): Promise<
  { ok: true; audits: SeoAudit[] } | { ok: false; error: string }
> {
  try {
    const client = createAdminClient();
    const { data, error } = await client
      .from("seo_audits")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) return { ok: false, error: error.message };
    return { ok: true, audits: (data ?? []) as SeoAudit[] };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "Supabase admin client unavailable.",
    };
  }
}

export default async function AdminAuditsPage() {
  const session = await getSeoSession();
  const result = await loadAudits();

  if (!result.ok) {
    return (
      <EmptyState title="Audits unavailable" description={result.error} />
    );
  }

  return (
    <AuditsPanel
      audits={result.audits}
      canRun={canMutateContent(session?.role)}
    />
  );
}
