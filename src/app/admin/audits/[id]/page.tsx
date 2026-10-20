import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AuditDetailPanel } from "@/components/admin/audit-detail-panel";
import { EmptyState } from "@/components/admin/empty-state";
import { canMutateContent, getSeoSession } from "@/lib/seo/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import type { SeoAudit, SeoAuditIssue } from "@/lib/seo/types";

export const metadata: Metadata = {
  title: "Audit detail",
};

type PageProps = {
  params: Promise<{ id: string }>;
};

async function loadAudit(id: string): Promise<
  | { ok: true; audit: SeoAudit; issues: SeoAuditIssue[] }
  | { ok: false; error: string; notFound?: boolean }
> {
  try {
    const client = createAdminClient();
    const { data: audit, error: auditError } = await client
      .from("seo_audits")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (auditError) return { ok: false, error: auditError.message };
    if (!audit) return { ok: false, error: "Audit not found.", notFound: true };

    const { data: issues, error: issuesError } = await client
      .from("seo_audit_issues")
      .select("*")
      .eq("audit_id", id)
      .order("created_at", { ascending: false });

    if (issuesError) return { ok: false, error: issuesError.message };

    return {
      ok: true,
      audit: audit as SeoAudit,
      issues: (issues ?? []) as SeoAuditIssue[],
    };
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

export default async function AdminAuditDetailPage({ params }: PageProps) {
  const { id } = await params;
  const session = await getSeoSession();
  const result = await loadAudit(id);

  if (!result.ok && result.notFound) {
    notFound();
  }

  if (!result.ok) {
    return (
      <EmptyState title="Audit unavailable" description={result.error} />
    );
  }

  return (
    <AuditDetailPanel
      audit={result.audit}
      issues={result.issues}
      canEdit={canMutateContent(session?.role)}
    />
  );
}
