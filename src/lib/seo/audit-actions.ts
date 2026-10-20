"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  SeoAuthError,
  canMutateContent,
  requireSeoRole,
} from "@/lib/seo/auth";
import { runAudit } from "@/lib/seo/crawler/run-audit";
import { serializeCsv, type CsvRow } from "@/lib/seo/csv";
import type {
  SeoAudit,
  SeoAuditIssue,
  SeoAuditIssueSeverity,
  SeoIssueResolution,
  SeoRole,
} from "@/lib/seo/types";

export type ActionOk<T> = { ok: true; data: T };
export type ActionErr = { ok: false; error: string };
export type ActionResult<T> = ActionOk<T> | ActionErr;

const READ_ROLES: SeoRole[] = ["owner", "admin", "editor", "viewer"];
const MUTATE_ROLES: SeoRole[] = ["owner", "admin", "editor"];

const severitySchema = z.enum([
  "critical",
  "high",
  "medium",
  "low",
  "info",
]);
const resolutionSchema = z.enum([
  "open",
  "acknowledged",
  "resolved",
  "ignored",
]);

function err(message: string): ActionErr {
  return { ok: false, error: message };
}

function ok<T>(data: T): ActionOk<T> {
  return { ok: true, data };
}

function asErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof SeoAuthError) return error.message;
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

function revalidateAudits(auditId?: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/audits");
  if (auditId) {
    revalidatePath(`/admin/audits/${auditId}`);
  }
}

export async function startAudit(): Promise<ActionResult<SeoAudit>> {
  try {
    const session = await requireSeoRole(...MUTATE_ROLES);
    if (!canMutateContent(session.role)) {
      return err("Editors and above can run SEO audits.");
    }

    const result = await runAudit();
    revalidateAudits(result.audit.id);
    return ok(result.audit);
  } catch (error) {
    return err(asErrorMessage(error, "Failed to start audit."));
  }
}

export async function listAudits(input?: {
  limit?: number;
}): Promise<ActionResult<SeoAudit[]>> {
  try {
    await requireSeoRole(...READ_ROLES);
    const client = createAdminClient();
    const limit = Math.min(Math.max(input?.limit ?? 50, 1), 200);

    const { data, error } = await client
      .from("seo_audits")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) return err(error.message);
    return ok((data ?? []) as SeoAudit[]);
  } catch (error) {
    return err(asErrorMessage(error, "Failed to list audits."));
  }
}

export async function getAudit(
  id: string,
): Promise<ActionResult<SeoAudit>> {
  try {
    await requireSeoRole(...READ_ROLES);
    const parsed = z.string().uuid().safeParse(id);
    if (!parsed.success) return err("Invalid audit id.");

    const client = createAdminClient();
    const { data, error } = await client
      .from("seo_audits")
      .select("*")
      .eq("id", parsed.data)
      .maybeSingle();

    if (error) return err(error.message);
    if (!data) return err("Audit not found.");
    return ok(data as SeoAudit);
  } catch (error) {
    return err(asErrorMessage(error, "Failed to load audit."));
  }
}

export async function listIssues(
  auditId: string,
  filters?: {
    severity?: SeoAuditIssueSeverity;
    resolution?: SeoIssueResolution;
    code?: string;
    search?: string;
  },
): Promise<ActionResult<SeoAuditIssue[]>> {
  try {
    await requireSeoRole(...READ_ROLES);
    const parsed = z.string().uuid().safeParse(auditId);
    if (!parsed.success) return err("Invalid audit id.");

    const client = createAdminClient();
    let query = client
      .from("seo_audit_issues")
      .select("*")
      .eq("audit_id", parsed.data)
      .order("created_at", { ascending: false });

    if (filters?.severity) {
      const sev = severitySchema.safeParse(filters.severity);
      if (!sev.success) return err("Invalid severity filter.");
      query = query.eq("severity", sev.data);
    }
    if (filters?.resolution) {
      const res = resolutionSchema.safeParse(filters.resolution);
      if (!res.success) return err("Invalid resolution filter.");
      query = query.eq("resolution", res.data);
    }
    if (filters?.code?.trim()) {
      query = query.eq("code", filters.code.trim());
    }

    const { data, error } = await query;
    if (error) return err(error.message);

    let issues = (data ?? []) as SeoAuditIssue[];
    const search = filters?.search?.trim().toLowerCase();
    if (search) {
      issues = issues.filter((issue) => {
        const haystack = [issue.url, issue.message, issue.code, issue.severity]
          .join(" ")
          .toLowerCase();
        return haystack.includes(search);
      });
    }

    return ok(issues);
  } catch (error) {
    return err(asErrorMessage(error, "Failed to list issues."));
  }
}

export async function updateIssueResolution(
  issueId: string,
  resolution: SeoIssueResolution,
): Promise<ActionResult<SeoAuditIssue>> {
  try {
    const session = await requireSeoRole(...MUTATE_ROLES);
    if (!canMutateContent(session.role)) {
      return err("Editors and above can update issue resolution.");
    }

    const parsed = z
      .object({
        issueId: z.string().uuid(),
        resolution: resolutionSchema,
      })
      .safeParse({ issueId, resolution });
    if (!parsed.success) {
      return err(parsed.error.issues[0]?.message ?? "Invalid resolution update.");
    }

    const client = createAdminClient();
    const { data: before, error: loadError } = await client
      .from("seo_audit_issues")
      .select("*")
      .eq("id", parsed.data.issueId)
      .maybeSingle();
    if (loadError) return err(loadError.message);
    if (!before) return err("Issue not found.");

    const { data: saved, error } = await client
      .from("seo_audit_issues")
      .update({ resolution: parsed.data.resolution })
      .eq("id", parsed.data.issueId)
      .select("*")
      .single();

    if (error) return err(error.message);
    const issue = saved as SeoAuditIssue;
    const ticketPayload = {
      issue_id: issue.id,
      resolution: parsed.data.resolution,
      updated_by: session.userId,
      updated_at: new Date().toISOString(),
    };
    const { data: existingTicket } = await client
      .from("seo_issue_tickets")
      .select("id")
      .eq("issue_id", issue.id)
      .maybeSingle();
    if (existingTicket) {
      await client
        .from("seo_issue_tickets")
        .update(ticketPayload)
        .eq("id", (existingTicket as { id: string }).id);
    } else {
      await client.from("seo_issue_tickets").insert(ticketPayload);
    }

    revalidateAudits(issue.audit_id);
    return ok(issue);
  } catch (error) {
    return err(asErrorMessage(error, "Failed to update issue resolution."));
  }
}

export async function exportIssuesCsv(
  auditId: string,
): Promise<ActionResult<string>> {
  try {
    await requireSeoRole(...READ_ROLES);
    const parsed = z.string().uuid().safeParse(auditId);
    if (!parsed.success) return err("Invalid audit id.");

    const client = createAdminClient();
    const { data, error } = await client
      .from("seo_audit_issues")
      .select("*")
      .eq("audit_id", parsed.data)
      .order("severity", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) return err(error.message);

    const columns = [
      "id",
      "severity",
      "code",
      "url",
      "message",
      "resolution",
      "evidence",
      "created_at",
    ];
    const rows: CsvRow[] = ((data ?? []) as SeoAuditIssue[]).map((issue) => ({
      id: issue.id,
      severity: issue.severity,
      code: issue.code,
      url: issue.url,
      message: issue.message,
      resolution: issue.resolution,
      evidence: issue.evidence ?? "",
      created_at: issue.created_at,
    }));

    return ok(serializeCsv(rows, columns));
  } catch (error) {
    return err(asErrorMessage(error, "Failed to export issues CSV."));
  }
}
