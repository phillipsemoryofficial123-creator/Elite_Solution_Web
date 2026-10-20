"use server";

import { revalidatePath } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  SeoAuthError,
  canMutateContent,
  requireSeoRole,
} from "@/lib/seo/auth";
import type {
  SeoCompetitor,
  SeoKeyword,
  SeoKeywordRanking,
  SeoRole,
} from "@/lib/seo/types";

export type ActionOk<T> = { ok: true; data: T };
export type ActionErr = { ok: false; error: string };
export type ActionResult<T> = ActionOk<T> | ActionErr;

const MUTATE_ROLES: SeoRole[] = ["owner", "admin", "editor"];
const READ_ROLES: SeoRole[] = ["owner", "admin", "editor", "viewer"];

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

function ensureAdminClient(): ActionResult<SupabaseClient> {
  try {
    return ok(createAdminClient());
  } catch (error) {
    return err(
      asErrorMessage(
        error,
        "Supabase service role is not configured. Set SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_URL.",
      ),
    );
  }
}

async function requireMutator() {
  const session = await requireSeoRole(...MUTATE_ROLES);
  if (!canMutateContent(session.role)) {
    throw new SeoAuthError("Editors and above can mutate SEO content.", 403);
  }
  return session;
}

async function logAction(
  client: SupabaseClient,
  input: {
    actorId: string | null;
    action: string;
    entityType: string;
    entityId?: string | null;
    before?: Record<string, unknown> | null;
    after?: Record<string, unknown> | null;
  },
) {
  await client.from("seo_action_logs").insert({
    actor_id: input.actorId,
    action: input.action,
    entity_type: input.entityType,
    entity_id: input.entityId ?? null,
    before_data: input.before ?? null,
    after_data: input.after ?? null,
  });
}

function revalidateKeywords() {
  revalidatePath("/admin/keywords");
  revalidatePath("/admin");
}

function normalizeTags(tags: string[] | undefined): string[] {
  if (!tags) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of tags) {
    const tag = raw.trim();
    if (!tag) continue;
    const key = tag.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(tag);
  }
  return out;
}

const keywordSchema = z.object({
  id: z.string().uuid().optional(),
  keyword: z.string().trim().min(1).max(300),
  intent: z.string().max(100).nullable().optional(),
  keyword_group: z.string().max(200).nullable().optional(),
  /** Alias accepted from UI; mapped to keyword_group. */
  group: z.string().max(200).nullable().optional(),
  tags: z.array(z.string().max(80)).max(40).optional(),
  target_path: z.string().max(500).nullable().optional(),
  notes: z.string().max(5000).nullable().optional(),
});

const rankingSchema = z.object({
  keyword_id: z.string().uuid(),
  metric_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "metric_date must be YYYY-MM-DD"),
  /** Alias accepted from UI. */
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD")
    .optional(),
  position: z.number().min(0).max(1000).nullable().optional(),
  url: z.string().max(2000).nullable().optional(),
  impressions: z.number().int().min(0).nullable().optional(),
  clicks: z.number().int().min(0).nullable().optional(),
  ctr: z.number().min(0).max(1).nullable().optional(),
});

const competitorSchema = z.object({
  id: z.string().uuid().optional(),
  domain: z.string().trim().min(1).max(300),
  label: z.string().max(200).nullable().optional(),
  notes: z.string().max(5000).nullable().optional(),
});

export type CannibalizationGroup = {
  focus_keyword: string;
  pages: Array<{
    id: string;
    path: string;
    title: string | null;
    status: string;
  }>;
};

export async function listKeywords(): Promise<ActionResult<SeoKeyword[]>> {
  try {
    await requireSeoRole(...READ_ROLES);
    const clientResult = ensureAdminClient();
    if (!clientResult.ok) return clientResult;
    const client = clientResult.data;

    const { data, error } = await client
      .from("seo_keywords")
      .select("*")
      .order("keyword", { ascending: true });

    if (error) return err(error.message);
    return ok((data ?? []) as SeoKeyword[]);
  } catch (error) {
    return err(asErrorMessage(error, "Failed to list keywords."));
  }
}

export async function saveKeyword(
  input: z.infer<typeof keywordSchema>,
): Promise<ActionResult<SeoKeyword>> {
  try {
    const session = await requireMutator();
    const parsed = keywordSchema.safeParse(input);
    if (!parsed.success) {
      return err(parsed.error.issues[0]?.message ?? "Invalid keyword.");
    }

    const clientResult = ensureAdminClient();
    if (!clientResult.ok) return clientResult;
    const client = clientResult.data;

    const keywordGroup =
      parsed.data.keyword_group !== undefined
        ? parsed.data.keyword_group
        : parsed.data.group !== undefined
          ? parsed.data.group
          : null;

    const now = new Date().toISOString();
    const payload = {
      keyword: parsed.data.keyword.trim(),
      intent: parsed.data.intent ?? null,
      keyword_group: keywordGroup?.trim() ? keywordGroup.trim() : null,
      tags: normalizeTags(parsed.data.tags),
      target_path: parsed.data.target_path?.trim()
        ? parsed.data.target_path.trim()
        : null,
      notes: parsed.data.notes ?? null,
      updated_at: now,
    };

    let existing: SeoKeyword | null = null;
    if (parsed.data.id) {
      const { data, error } = await client
        .from("seo_keywords")
        .select("*")
        .eq("id", parsed.data.id)
        .maybeSingle();
      if (error) return err(error.message);
      if (!data) return err("Keyword not found.");
      existing = data as SeoKeyword;
    }

    const { data: saved, error } = existing
      ? await client
          .from("seo_keywords")
          .update(payload)
          .eq("id", existing.id)
          .select("*")
          .single()
      : await client
          .from("seo_keywords")
          .insert(payload)
          .select("*")
          .single();

    if (error) return err(error.message);
    const keyword = saved as SeoKeyword;

    await logAction(client, {
      actorId: session.userId,
      action: existing ? "keyword.update" : "keyword.create",
      entityType: "seo_keywords",
      entityId: keyword.id,
      before: existing ? { ...existing } : null,
      after: { ...keyword },
    });

    revalidateKeywords();
    return ok(keyword);
  } catch (error) {
    return err(asErrorMessage(error, "Failed to save keyword."));
  }
}

export async function deleteKeyword(
  id: string,
): Promise<ActionResult<{ id: string }>> {
  try {
    const session = await requireMutator();
    const parsed = z.string().uuid().safeParse(id);
    if (!parsed.success) return err("Invalid keyword id.");

    const clientResult = ensureAdminClient();
    if (!clientResult.ok) return clientResult;
    const client = clientResult.data;

    const { data: existing, error: fetchError } = await client
      .from("seo_keywords")
      .select("*")
      .eq("id", parsed.data)
      .maybeSingle();

    if (fetchError) return err(fetchError.message);
    if (!existing) return err("Keyword not found.");

    const { error: rankError } = await client
      .from("seo_keyword_rankings")
      .delete()
      .eq("keyword_id", parsed.data);
    if (rankError) return err(rankError.message);

    const { error } = await client
      .from("seo_keywords")
      .delete()
      .eq("id", parsed.data);
    if (error) return err(error.message);

    await logAction(client, {
      actorId: session.userId,
      action: "keyword.delete",
      entityType: "seo_keywords",
      entityId: parsed.data,
      before: { ...(existing as SeoKeyword) },
      after: null,
    });

    revalidateKeywords();
    return ok({ id: parsed.data });
  } catch (error) {
    return err(asErrorMessage(error, "Failed to delete keyword."));
  }
}

/**
 * Manual ranking entry only. Does not invent volume/difficulty or pull SERP data.
 * Optional clicks/impressions/ctr are stored only when the user provides them.
 */
export async function addRanking(
  input: z.infer<typeof rankingSchema>,
): Promise<ActionResult<SeoKeywordRanking>> {
  try {
    const session = await requireMutator();
    const parsed = rankingSchema.safeParse(input);
    if (!parsed.success) {
      return err(parsed.error.issues[0]?.message ?? "Invalid ranking.");
    }

    const clientResult = ensureAdminClient();
    if (!clientResult.ok) return clientResult;
    const client = clientResult.data;

    const metricDate = parsed.data.metric_date || parsed.data.date;
    if (!metricDate) return err("metric_date is required.");

    const { data: keyword, error: keywordError } = await client
      .from("seo_keywords")
      .select("id")
      .eq("id", parsed.data.keyword_id)
      .maybeSingle();
    if (keywordError) return err(keywordError.message);
    if (!keyword) return err("Keyword not found.");

    const payload = {
      keyword_id: parsed.data.keyword_id,
      metric_date: metricDate,
      position: parsed.data.position ?? null,
      url: parsed.data.url?.trim() ? parsed.data.url.trim() : null,
      source: "manual" as const,
      impressions: parsed.data.impressions ?? null,
      clicks: parsed.data.clicks ?? null,
      ctr: parsed.data.ctr ?? null,
    };

    const { data: saved, error } = await client
      .from("seo_keyword_rankings")
      .upsert(payload, {
        onConflict: "keyword_id,metric_date,source",
      })
      .select("*")
      .single();

    if (error) return err(error.message);
    const ranking = saved as SeoKeywordRanking;

    await logAction(client, {
      actorId: session.userId,
      action: "keyword_ranking.upsert",
      entityType: "seo_keyword_rankings",
      entityId: ranking.id,
      after: { ...ranking },
    });

    revalidateKeywords();
    return ok(ranking);
  } catch (error) {
    return err(asErrorMessage(error, "Failed to add ranking."));
  }
}

export async function listRankings(
  keywordId?: string,
): Promise<ActionResult<SeoKeywordRanking[]>> {
  try {
    await requireSeoRole(...READ_ROLES);
    const clientResult = ensureAdminClient();
    if (!clientResult.ok) return clientResult;
    const client = clientResult.data;

    let query = client
      .from("seo_keyword_rankings")
      .select("*")
      .order("metric_date", { ascending: false });

    if (keywordId) {
      const parsed = z.string().uuid().safeParse(keywordId);
      if (!parsed.success) return err("Invalid keyword id.");
      query = query.eq("keyword_id", parsed.data);
    }

    const { data, error } = await query.limit(500);
    if (error) return err(error.message);
    return ok((data ?? []) as SeoKeywordRanking[]);
  } catch (error) {
    return err(asErrorMessage(error, "Failed to list rankings."));
  }
}

export async function listCompetitors(): Promise<ActionResult<SeoCompetitor[]>> {
  try {
    await requireSeoRole(...READ_ROLES);
    const clientResult = ensureAdminClient();
    if (!clientResult.ok) return clientResult;
    const client = clientResult.data;

    const { data, error } = await client
      .from("seo_competitors")
      .select("*")
      .order("domain", { ascending: true });

    if (error) return err(error.message);
    return ok((data ?? []) as SeoCompetitor[]);
  } catch (error) {
    return err(asErrorMessage(error, "Failed to list competitors."));
  }
}

export async function saveCompetitor(
  input: z.infer<typeof competitorSchema>,
): Promise<ActionResult<SeoCompetitor>> {
  try {
    const session = await requireMutator();
    const parsed = competitorSchema.safeParse(input);
    if (!parsed.success) {
      return err(parsed.error.issues[0]?.message ?? "Invalid competitor.");
    }

    const clientResult = ensureAdminClient();
    if (!clientResult.ok) return clientResult;
    const client = clientResult.data;

    const domain = parsed.data.domain
      .trim()
      .toLowerCase()
      .replace(/^https?:\/\//, "")
      .replace(/\/.*$/, "");

    if (!domain) return err("Domain is required.");

    const payload = {
      domain,
      label: parsed.data.label?.trim() ? parsed.data.label.trim() : null,
      notes: parsed.data.notes ?? null,
    };

    let existing: SeoCompetitor | null = null;
    if (parsed.data.id) {
      const { data, error } = await client
        .from("seo_competitors")
        .select("*")
        .eq("id", parsed.data.id)
        .maybeSingle();
      if (error) return err(error.message);
      if (!data) return err("Competitor not found.");
      existing = data as SeoCompetitor;
    }

    const { data: saved, error } = existing
      ? await client
          .from("seo_competitors")
          .update(payload)
          .eq("id", existing.id)
          .select("*")
          .single()
      : await client
          .from("seo_competitors")
          .insert(payload)
          .select("*")
          .single();

    if (error) return err(error.message);
    const competitor = saved as SeoCompetitor;

    await logAction(client, {
      actorId: session.userId,
      action: existing ? "competitor.update" : "competitor.create",
      entityType: "seo_competitors",
      entityId: competitor.id,
      before: existing ? { ...existing } : null,
      after: { ...competitor },
    });

    revalidateKeywords();
    return ok(competitor);
  } catch (error) {
    return err(asErrorMessage(error, "Failed to save competitor."));
  }
}

export async function deleteCompetitor(
  id: string,
): Promise<ActionResult<{ id: string }>> {
  try {
    const session = await requireMutator();
    const parsed = z.string().uuid().safeParse(id);
    if (!parsed.success) return err("Invalid competitor id.");

    const clientResult = ensureAdminClient();
    if (!clientResult.ok) return clientResult;
    const client = clientResult.data;

    const { data: existing, error: fetchError } = await client
      .from("seo_competitors")
      .select("*")
      .eq("id", parsed.data)
      .maybeSingle();

    if (fetchError) return err(fetchError.message);
    if (!existing) return err("Competitor not found.");

    const { error } = await client
      .from("seo_competitors")
      .delete()
      .eq("id", parsed.data);
    if (error) return err(error.message);

    await logAction(client, {
      actorId: session.userId,
      action: "competitor.delete",
      entityType: "seo_competitors",
      entityId: parsed.data,
      before: { ...(existing as SeoCompetitor) },
      after: null,
    });

    revalidateKeywords();
    return ok({ id: parsed.data });
  } catch (error) {
    return err(asErrorMessage(error, "Failed to delete competitor."));
  }
}

/**
 * Finds published pages that share the same focus_keyword (case-insensitive).
 */
export async function findCannibalization(): Promise<
  ActionResult<CannibalizationGroup[]>
> {
  try {
    await requireSeoRole(...READ_ROLES);
    const clientResult = ensureAdminClient();
    if (!clientResult.ok) return clientResult;
    const client = clientResult.data;

    const { data, error } = await client
      .from("seo_pages")
      .select("id, path, title, status, focus_keyword")
      .eq("status", "published")
      .not("focus_keyword", "is", null);

    if (error) return err(error.message);

    const groups = new Map<string, CannibalizationGroup>();

    for (const row of data ?? []) {
      const raw = (row.focus_keyword as string | null)?.trim();
      if (!raw) continue;
      const key = raw.toLowerCase();
      const existing = groups.get(key);
      const page = {
        id: row.id as string,
        path: row.path as string,
        title: (row.title as string | null) ?? null,
        status: row.status as string,
      };
      if (existing) {
        existing.pages.push(page);
      } else {
        groups.set(key, { focus_keyword: raw, pages: [page] });
      }
    }

    const collisions = [...groups.values()]
      .filter((group) => group.pages.length > 1)
      .sort((a, b) => a.focus_keyword.localeCompare(b.focus_keyword));

    return ok(collisions);
  } catch (error) {
    return err(asErrorMessage(error, "Failed to find cannibalization."));
  }
}
