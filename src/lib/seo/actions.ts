"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { clerkClient } from "@clerk/nextjs/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  SeoAuthError,
  canManageSettings,
  canMutateContent,
  isSeoRole,
  requireSeoRole,
} from "@/lib/seo/auth";
import { SEO_CACHE_TAG } from "@/lib/seo/get-page-seo";
import { computeSeoScore } from "@/lib/seo/score";
import { wouldCreateRedirectLoop } from "@/lib/seo/redirects";
import {
  SEO_PAGE_CSV_COLUMNS,
  parseCsv,
  serializeCsv,
  type CsvRow,
} from "@/lib/seo/csv";
import { pathForBlog } from "@/lib/seo/paths";
import type {
  SeoActionLog,
  SeoBlogOverride,
  SeoPage,
  SeoPageRevision,
  SeoPageType,
  SeoProfile,
  SeoPublishStatus,
  SeoRedirect,
  SeoRedirectStatusCode,
  SeoRole,
  SeoSiteSettings,
} from "@/lib/seo/types";

export type ActionOk<T> = { ok: true; data: T };
export type ActionErr = { ok: false; error: string };
export type ActionResult<T> = ActionOk<T> | ActionErr;

const MUTATE_ROLES: SeoRole[] = ["owner", "admin", "editor"];
const MANAGE_ROLES: SeoRole[] = ["owner", "admin"];
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

async function requireManager() {
  const session = await requireSeoRole(...MANAGE_ROLES);
  if (!canManageSettings(session.role)) {
    throw new SeoAuthError("Owners and admins can manage settings.", 403);
  }
  return session;
}

async function logAction(
  client: SupabaseClient,
  input: {
    actorId: string | null;
    action: string;
    entity: string;
    entityId?: string | null;
    before?: Record<string, unknown> | null;
    after?: Record<string, unknown> | null;
  },
) {
  await client.from("seo_action_logs").insert({
    actor_id: input.actorId,
    action: input.action,
    entity: input.entity,
    entity_id: input.entityId ?? null,
    before: input.before ?? null,
    after: input.after ?? null,
  });
}

function revalidateSeo(path?: string | null) {
  revalidateTag(SEO_CACHE_TAG, "max");
  if (path) {
    revalidatePath(path);
  }
  revalidatePath("/admin");
  revalidatePath("/admin/pages");
  revalidatePath("/admin/blogs");
  revalidatePath("/admin/tools");
  revalidatePath("/admin/settings");
}

const publishStatusSchema = z.enum([
  "draft",
  "published",
  "scheduled",
  "unpublished",
]);

const pageTypeSchema = z.enum(["static", "service", "blog", "other"]);

const jsonValueSchema = z.union([
  z.record(z.string(), z.unknown()),
  z.array(z.record(z.string(), z.unknown())),
  z.null(),
]);

const pageFieldsSchema = z.object({
  id: z.string().uuid().optional(),
  path: z.string().min(1).max(500),
  page_type: pageTypeSchema.optional(),
  title: z.string().max(300).nullable().optional(),
  meta_description: z.string().max(1000).nullable().optional(),
  focus_keyword: z.string().max(200).nullable().optional(),
  canonical_url: z.string().max(2000).nullable().optional(),
  robots_index: z.boolean().optional(),
  robots_follow: z.boolean().optional(),
  og_title: z.string().max(300).nullable().optional(),
  og_description: z.string().max(1000).nullable().optional(),
  og_image: z.string().max(2000).nullable().optional(),
  og_type: z.string().max(100).nullable().optional(),
  twitter_card: z.string().max(100).nullable().optional(),
  twitter_title: z.string().max(300).nullable().optional(),
  twitter_description: z.string().max(1000).nullable().optional(),
  twitter_image: z.string().max(2000).nullable().optional(),
  json_ld: jsonValueSchema.optional(),
  image_alt_defaults: z.record(z.string(), z.string()).nullable().optional(),
  include_in_sitemap: z.boolean().optional(),
  status: publishStatusSchema.optional(),
  scheduled_at: z
    .union([
      z
        .string()
        .refine(
          (value) => !Number.isNaN(Date.parse(value)),
          "Invalid scheduled_at",
        ),
      z.null(),
    ])
    .optional(),
});

const blogOverrideSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(1).max(300),
  title: z.string().max(300).nullable().optional(),
  meta_description: z.string().max(1000).nullable().optional(),
  focus_keyword: z.string().max(200).nullable().optional(),
  canonical_url: z.string().max(2000).nullable().optional(),
  robots_index: z.boolean().optional(),
  robots_follow: z.boolean().optional(),
  og_title: z.string().max(300).nullable().optional(),
  og_description: z.string().max(1000).nullable().optional(),
  og_image: z.string().max(2000).nullable().optional(),
  twitter_title: z.string().max(300).nullable().optional(),
  twitter_description: z.string().max(1000).nullable().optional(),
  twitter_image: z.string().max(2000).nullable().optional(),
  json_ld: jsonValueSchema.optional(),
  include_in_sitemap: z.boolean().optional(),
  status: publishStatusSchema.optional(),
  scheduled_at: z
    .union([
      z
        .string()
        .refine(
          (value) => !Number.isNaN(Date.parse(value)),
          "Invalid scheduled_at",
        ),
      z.null(),
    ])
    .optional(),
});

const redirectSchema = z.object({
  id: z.string().uuid().optional(),
  from_path: z.string().min(1).max(500),
  to_url: z.string().min(1).max(2000),
  status_code: z.union([
    z.literal(301),
    z.literal(302),
    z.literal(307),
    z.literal(308),
  ]),
  enabled: z.boolean().optional(),
});

const settingsSchema = z.object({
  robots_txt: z.string().max(50000).nullable().optional(),
  sitemap_defaults: z.record(z.string(), z.unknown()).nullable().optional(),
  meta_templates: z.record(z.string(), z.unknown()).nullable().optional(),
  crawl_limits: z
    .object({
      max_pages: z.number().int().positive().optional(),
      max_depth: z.number().int().positive().optional(),
      requests_per_second: z.number().positive().optional(),
    })
    .nullable()
    .optional(),
});

const bulkUpdateSchema = z.object({
  ids: z.array(z.string().uuid()).min(1),
  patch: z
    .object({
      robots_index: z.boolean().optional(),
      robots_follow: z.boolean().optional(),
      include_in_sitemap: z.boolean().optional(),
      status: publishStatusSchema.optional(),
      focus_keyword: z.string().max(200).nullable().optional(),
    })
    .refine((value) => Object.keys(value).length > 0, {
      message: "At least one field is required",
    }),
});

function pageSnapshot(page: SeoPage): Record<string, unknown> {
  return { ...page };
}

function boolFromCsv(value: string | undefined, fallback: boolean): boolean {
  if (value == null || value === "") return fallback;
  const normalized = value.trim().toLowerCase();
  if (["1", "true", "yes", "y"].includes(normalized)) return true;
  if (["0", "false", "no", "n"].includes(normalized)) return false;
  return fallback;
}

function pageToCsvRow(page: SeoPage): CsvRow {
  return {
    id: page.id,
    path: page.path,
    page_type: page.page_type,
    title: page.title ?? "",
    meta_description: page.meta_description ?? "",
    focus_keyword: page.focus_keyword ?? "",
    canonical_url: page.canonical_url ?? "",
    robots_index: String(page.robots_index),
    robots_follow: String(page.robots_follow),
    og_title: page.og_title ?? "",
    og_description: page.og_description ?? "",
    og_image: page.og_image ?? "",
    include_in_sitemap: String(page.include_in_sitemap),
    status: page.status,
    seo_score: page.seo_score == null ? "" : String(page.seo_score),
  };
}

export async function listPages(input?: {
  search?: string;
  sort?: "path" | "title" | "seo_score" | "status" | "updated_at";
  direction?: "asc" | "desc";
  status?: SeoPublishStatus;
  page_type?: SeoPageType;
}): Promise<ActionResult<SeoPage[]>> {
  try {
    await requireSeoRole(...READ_ROLES);
    const clientResult = ensureAdminClient();
    if (!clientResult.ok) return clientResult;
    const client = clientResult.data;

    let query = client.from("seo_pages").select("*");

    if (input?.status) query = query.eq("status", input.status);
    if (input?.page_type) query = query.eq("page_type", input.page_type);

    const sort = input?.sort ?? "path";
    const ascending = (input?.direction ?? "asc") === "asc";
    query = query.order(sort, { ascending, nullsFirst: false });

    const { data, error } = await query;
    if (error) return err(error.message);

    let pages = (data ?? []) as SeoPage[];
    const search = input?.search?.trim().toLowerCase();
    if (search) {
      pages = pages.filter((page) => {
        const haystack = [
          page.path,
          page.title,
          page.meta_description,
          page.focus_keyword,
          page.status,
          page.page_type,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return haystack.includes(search);
      });
    }

    return ok(pages);
  } catch (error) {
    return err(asErrorMessage(error, "Failed to list pages."));
  }
}

export async function getPage(
  id: string,
): Promise<
  ActionResult<{ page: SeoPage; revisions: SeoPageRevision[] }>
> {
  try {
    await requireSeoRole(...READ_ROLES);
    const parsed = z.string().uuid().safeParse(id);
    if (!parsed.success) return err("Invalid page id.");

    const clientResult = ensureAdminClient();
    if (!clientResult.ok) return clientResult;
    const client = clientResult.data;

    const { data: page, error } = await client
      .from("seo_pages")
      .select("*")
      .eq("id", parsed.data)
      .maybeSingle();

    if (error) return err(error.message);
    if (!page) return err("Page not found.");

    const { data: revisions, error: revError } = await client
      .from("seo_page_revisions")
      .select("*")
      .eq("page_id", parsed.data)
      .order("created_at", { ascending: false })
      .limit(50);

    if (revError) return err(revError.message);

    return ok({
      page: page as SeoPage,
      revisions: (revisions ?? []) as SeoPageRevision[],
    });
  } catch (error) {
    return err(asErrorMessage(error, "Failed to load page."));
  }
}

export async function savePage(
  input: z.infer<typeof pageFieldsSchema>,
): Promise<ActionResult<SeoPage>> {
  try {
    const session = await requireMutator();
    const parsed = pageFieldsSchema.safeParse(input);
    if (!parsed.success) {
      return err(parsed.error.issues[0]?.message ?? "Invalid page payload.");
    }

    const clientResult = ensureAdminClient();
    if (!clientResult.ok) return clientResult;
    const client = clientResult.data;
    const fields = parsed.data;

    const score = computeSeoScore({
      title: fields.title,
      meta_description: fields.meta_description,
      focus_keyword: fields.focus_keyword,
      canonical_url: fields.canonical_url,
      og_image: fields.og_image,
      robots_index: fields.robots_index,
      robots_follow: fields.robots_follow,
      include_in_sitemap: fields.include_in_sitemap,
    });

    const now = new Date().toISOString();
    let before: SeoPage | null = null;

    if (fields.id) {
      const { data: existing, error: existingError } = await client
        .from("seo_pages")
        .select("*")
        .eq("id", fields.id)
        .maybeSingle();
      if (existingError) return err(existingError.message);
      if (!existing) return err("Page not found.");
      before = existing as SeoPage;
    } else {
      const { data: byPath } = await client
        .from("seo_pages")
        .select("*")
        .eq("path", fields.path)
        .maybeSingle();
      if (byPath) before = byPath as SeoPage;
    }

    const payload = {
      path: fields.path,
      page_type: fields.page_type ?? before?.page_type ?? "other",
      title: fields.title ?? null,
      meta_description: fields.meta_description ?? null,
      focus_keyword: fields.focus_keyword ?? null,
      canonical_url: fields.canonical_url ?? null,
      robots_index: fields.robots_index ?? before?.robots_index ?? true,
      robots_follow: fields.robots_follow ?? before?.robots_follow ?? true,
      og_title: fields.og_title ?? null,
      og_description: fields.og_description ?? null,
      og_image: fields.og_image ?? null,
      og_type: fields.og_type ?? before?.og_type ?? "website",
      twitter_card: fields.twitter_card ?? before?.twitter_card ?? "summary_large_image",
      twitter_title: fields.twitter_title ?? null,
      twitter_description: fields.twitter_description ?? null,
      twitter_image: fields.twitter_image ?? null,
      json_ld: fields.json_ld === undefined ? (before?.json_ld ?? null) : fields.json_ld,
      image_alt_defaults:
        fields.image_alt_defaults === undefined
          ? (before?.image_alt_defaults ?? null)
          : fields.image_alt_defaults,
      include_in_sitemap:
        fields.include_in_sitemap ?? before?.include_in_sitemap ?? true,
      status: fields.status ?? before?.status ?? "draft",
      scheduled_at:
        fields.scheduled_at === undefined
          ? (before?.scheduled_at ?? null)
          : fields.scheduled_at,
      seo_score: score.score,
      updated_at: now,
    };

    const upsertId = fields.id ?? before?.id;
    const writePayload = upsertId
      ? { id: upsertId, ...payload }
      : payload;
    const { data: saved, error } = await client
      .from("seo_pages")
      .upsert(writePayload as never, { onConflict: "path" })
      .select("*")
      .single();

    if (error) return err(error.message);
    const page = saved as SeoPage;

    await client.from("seo_page_revisions").insert({
      page_id: page.id,
      snapshot: pageSnapshot(page),
      actor_id: session.userId,
    });

    await logAction(client, {
      actorId: session.userId,
      action: before ? "page.update" : "page.create",
      entity: "seo_pages",
      entityId: page.id,
      before: before ? pageSnapshot(before) : null,
      after: pageSnapshot(page),
    });

    revalidateSeo(page.path);
    return ok(page);
  } catch (error) {
    return err(asErrorMessage(error, "Failed to save page."));
  }
}

export async function publishPage(
  id: string,
): Promise<ActionResult<SeoPage>> {
  try {
    const session = await requireMutator();
    const parsed = z.string().uuid().safeParse(id);
    if (!parsed.success) return err("Invalid page id.");

    const clientResult = ensureAdminClient();
    if (!clientResult.ok) return clientResult;
    const client = clientResult.data;

    const { data: before, error: loadError } = await client
      .from("seo_pages")
      .select("*")
      .eq("id", parsed.data)
      .maybeSingle();
    if (loadError) return err(loadError.message);
    if (!before) return err("Page not found.");

    const now = new Date().toISOString();
    const { data: saved, error } = await client
      .from("seo_pages")
      .update({
        status: "published",
        published_at: now,
        scheduled_at: null,
        updated_at: now,
      })
      .eq("id", parsed.data)
      .select("*")
      .single();

    if (error) return err(error.message);
    const page = saved as SeoPage;

    await client.from("seo_page_revisions").insert({
      page_id: page.id,
      snapshot: pageSnapshot(page),
      actor_id: session.userId,
    });

    await logAction(client, {
      actorId: session.userId,
      action: "page.publish",
      entity: "seo_pages",
      entityId: page.id,
      before: pageSnapshot(before as SeoPage),
      after: pageSnapshot(page),
    });

    revalidateSeo(page.path);
    return ok(page);
  } catch (error) {
    return err(asErrorMessage(error, "Failed to publish page."));
  }
}

export async function unpublishPage(
  id: string,
): Promise<ActionResult<SeoPage>> {
  try {
    const session = await requireMutator();
    const parsed = z.string().uuid().safeParse(id);
    if (!parsed.success) return err("Invalid page id.");

    const clientResult = ensureAdminClient();
    if (!clientResult.ok) return clientResult;
    const client = clientResult.data;

    const { data: before, error: loadError } = await client
      .from("seo_pages")
      .select("*")
      .eq("id", parsed.data)
      .maybeSingle();
    if (loadError) return err(loadError.message);
    if (!before) return err("Page not found.");

    const now = new Date().toISOString();
    const { data: saved, error } = await client
      .from("seo_pages")
      .update({
        status: "unpublished",
        scheduled_at: null,
        updated_at: now,
      })
      .eq("id", parsed.data)
      .select("*")
      .single();

    if (error) return err(error.message);
    const page = saved as SeoPage;

    await client.from("seo_page_revisions").insert({
      page_id: page.id,
      snapshot: pageSnapshot(page),
      actor_id: session.userId,
    });

    await logAction(client, {
      actorId: session.userId,
      action: "page.unpublish",
      entity: "seo_pages",
      entityId: page.id,
      before: pageSnapshot(before as SeoPage),
      after: pageSnapshot(page),
    });

    revalidateSeo(page.path);
    return ok(page);
  } catch (error) {
    return err(asErrorMessage(error, "Failed to unpublish page."));
  }
}

export async function schedulePage(input: {
  id: string;
  scheduled_at: string;
}): Promise<ActionResult<SeoPage>> {
  try {
    const session = await requireMutator();
    const parsed = z
      .object({
        id: z.string().uuid(),
        scheduled_at: z
          .string()
          .refine(
            (value) => !Number.isNaN(Date.parse(value)),
            "Invalid scheduled_at",
          ),
      })
      .safeParse(input);
    if (!parsed.success) {
      return err(parsed.error.issues[0]?.message ?? "Invalid schedule payload.");
    }

    const clientResult = ensureAdminClient();
    if (!clientResult.ok) return clientResult;
    const client = clientResult.data;

    const { data: before, error: loadError } = await client
      .from("seo_pages")
      .select("*")
      .eq("id", parsed.data.id)
      .maybeSingle();
    if (loadError) return err(loadError.message);
    if (!before) return err("Page not found.");

    const now = new Date().toISOString();
    const { data: saved, error } = await client
      .from("seo_pages")
      .update({
        status: "scheduled",
        scheduled_at: parsed.data.scheduled_at,
        updated_at: now,
      })
      .eq("id", parsed.data.id)
      .select("*")
      .single();

    if (error) return err(error.message);
    const page = saved as SeoPage;

    await client.from("seo_page_revisions").insert({
      page_id: page.id,
      snapshot: pageSnapshot(page),
      actor_id: session.userId,
    });

    await logAction(client, {
      actorId: session.userId,
      action: "page.schedule",
      entity: "seo_pages",
      entityId: page.id,
      before: pageSnapshot(before as SeoPage),
      after: pageSnapshot(page),
    });

    revalidateSeo(page.path);
    return ok(page);
  } catch (error) {
    return err(asErrorMessage(error, "Failed to schedule page."));
  }
}

export async function listBlogOverrides(): Promise<
  ActionResult<SeoBlogOverride[]>
> {
  try {
    await requireSeoRole(...READ_ROLES);
    const clientResult = ensureAdminClient();
    if (!clientResult.ok) return clientResult;
    const client = clientResult.data;

    const { data, error } = await client
      .from("seo_blog_overrides")
      .select("*")
      .order("slug", { ascending: true });

    if (error) return err(error.message);
    return ok((data ?? []) as SeoBlogOverride[]);
  } catch (error) {
    return err(asErrorMessage(error, "Failed to list blog overrides."));
  }
}

export async function saveBlogOverride(
  input: z.infer<typeof blogOverrideSchema>,
): Promise<ActionResult<SeoBlogOverride>> {
  try {
    const session = await requireMutator();
    const parsed = blogOverrideSchema.safeParse(input);
    if (!parsed.success) {
      return err(parsed.error.issues[0]?.message ?? "Invalid blog override.");
    }

    const clientResult = ensureAdminClient();
    if (!clientResult.ok) return clientResult;
    const client = clientResult.data;
    const fields = parsed.data;

    const score = computeSeoScore({
      title: fields.title,
      meta_description: fields.meta_description,
      focus_keyword: fields.focus_keyword,
      canonical_url: fields.canonical_url,
      og_image: fields.og_image,
      robots_index: fields.robots_index,
      robots_follow: fields.robots_follow,
      include_in_sitemap: fields.include_in_sitemap,
    });

    const now = new Date().toISOString();
    const { data: before } = await client
      .from("seo_blog_overrides")
      .select("*")
      .eq("slug", fields.slug)
      .maybeSingle();

    const payload = {
      slug: fields.slug,
      title: fields.title ?? null,
      meta_description: fields.meta_description ?? null,
      focus_keyword: fields.focus_keyword ?? null,
      canonical_url: fields.canonical_url ?? null,
      robots_index: fields.robots_index ?? true,
      robots_follow: fields.robots_follow ?? true,
      og_title: fields.og_title ?? null,
      og_description: fields.og_description ?? null,
      og_image: fields.og_image ?? null,
      twitter_title: fields.twitter_title ?? null,
      twitter_description: fields.twitter_description ?? null,
      twitter_image: fields.twitter_image ?? null,
      json_ld: fields.json_ld ?? null,
      include_in_sitemap: fields.include_in_sitemap ?? true,
      status: fields.status ?? "draft",
      scheduled_at: fields.scheduled_at ?? null,
      published_at:
        (fields.status ?? "draft") === "published"
          ? (((before as SeoBlogOverride | null)?.published_at as
              | string
              | null
              | undefined) ?? now)
          : ((before as SeoBlogOverride | null)?.published_at ?? null),
      seo_score: score.score,
      updated_at: now,
    };

    const writePayload =
      fields.id || before
        ? { id: fields.id ?? (before as SeoBlogOverride).id, ...payload }
        : payload;
    const { data: saved, error } = await client
      .from("seo_blog_overrides")
      .upsert(writePayload as never, { onConflict: "slug" })
      .select("*")
      .single();

    if (error) return err(error.message);
    const override = saved as SeoBlogOverride;

    // Keep matching seo_pages row in sync for /blogs/{slug} when present.
    const blogPath = pathForBlog(override.slug);
    const { data: pageRow } = await client
      .from("seo_pages")
      .select("id")
      .eq("path", blogPath)
      .maybeSingle();

    if (pageRow) {
      const pageScore = computeSeoScore({
        title: override.title,
        meta_description: override.meta_description,
        focus_keyword: override.focus_keyword,
        canonical_url: override.canonical_url,
        og_image: override.og_image,
        robots_index: override.robots_index,
        robots_follow: override.robots_follow,
        include_in_sitemap: override.include_in_sitemap,
      });
      await client
        .from("seo_pages")
        .update({
          title: override.title,
          meta_description: override.meta_description,
          focus_keyword: override.focus_keyword,
          canonical_url: override.canonical_url,
          robots_index: override.robots_index,
          robots_follow: override.robots_follow,
          og_title: override.og_title,
          og_description: override.og_description,
          og_image: override.og_image,
          twitter_title: override.twitter_title,
          twitter_description: override.twitter_description,
          twitter_image: override.twitter_image,
          json_ld: override.json_ld,
          include_in_sitemap: override.include_in_sitemap,
          status: override.status,
          scheduled_at: override.scheduled_at,
          seo_score: pageScore.score,
          updated_at: now,
        })
        .eq("id", (pageRow as { id: string }).id);
    }

    await logAction(client, {
      actorId: session.userId,
      action: before ? "blog_override.update" : "blog_override.create",
      entity: "seo_blog_overrides",
      entityId: override.id,
      before: (before as Record<string, unknown> | null) ?? null,
      after: { ...override },
    });

    revalidateSeo(blogPath);
    return ok(override);
  } catch (error) {
    return err(asErrorMessage(error, "Failed to save blog override."));
  }
}

export async function listRedirects(): Promise<ActionResult<SeoRedirect[]>> {
  try {
    await requireSeoRole(...READ_ROLES);
    const clientResult = ensureAdminClient();
    if (!clientResult.ok) return clientResult;
    const client = clientResult.data;

    const { data, error } = await client
      .from("seo_redirects")
      .select("*")
      .order("from_path", { ascending: true });

    if (error) return err(error.message);
    return ok((data ?? []) as SeoRedirect[]);
  } catch (error) {
    return err(asErrorMessage(error, "Failed to list redirects."));
  }
}

export async function saveRedirect(
  input: z.infer<typeof redirectSchema>,
): Promise<ActionResult<SeoRedirect>> {
  try {
    const session = await requireMutator();
    const parsed = redirectSchema.safeParse(input);
    if (!parsed.success) {
      return err(parsed.error.issues[0]?.message ?? "Invalid redirect.");
    }

    const clientResult = ensureAdminClient();
    if (!clientResult.ok) return clientResult;
    const client = clientResult.data;
    const fields = parsed.data;

    const { data: existing, error: listError } = await client
      .from("seo_redirects")
      .select("id, from_path, to_url");
    if (listError) return err(listError.message);

    const edges = ((existing ?? []) as Array<{
      id: string;
      from_path: string;
      to_url: string;
    }>)
      .filter((row) => row.id !== fields.id)
      .map((row) => ({ from_path: row.from_path, to_url: row.to_url }));

    if (wouldCreateRedirectLoop(fields.from_path, fields.to_url, edges)) {
      return err("This redirect would create a loop.");
    }

    const now = new Date().toISOString();
    const payload = {
      from_path: fields.from_path.trim(),
      to_url: fields.to_url.trim(),
      status_code: fields.status_code as SeoRedirectStatusCode,
      enabled: fields.enabled ?? true,
      updated_at: now,
    };

    const { data: saved, error } = fields.id
      ? await client
          .from("seo_redirects")
          .update(payload)
          .eq("id", fields.id)
          .select("*")
          .single()
      : await client
          .from("seo_redirects")
          .insert(payload)
          .select("*")
          .single();

    if (error) return err(error.message);
    const redirect = saved as SeoRedirect;

    await logAction(client, {
      actorId: session.userId,
      action: fields.id ? "redirect.update" : "redirect.create",
      entity: "seo_redirects",
      entityId: redirect.id,
      after: { ...redirect },
    });

    revalidateSeo();
    return ok(redirect);
  } catch (error) {
    return err(asErrorMessage(error, "Failed to save redirect."));
  }
}

export async function deleteRedirect(
  id: string,
): Promise<ActionResult<{ id: string }>> {
  try {
    const session = await requireMutator();
    const parsed = z.string().uuid().safeParse(id);
    if (!parsed.success) return err("Invalid redirect id.");

    const clientResult = ensureAdminClient();
    if (!clientResult.ok) return clientResult;
    const client = clientResult.data;

    const { data: before, error: loadError } = await client
      .from("seo_redirects")
      .select("*")
      .eq("id", parsed.data)
      .maybeSingle();
    if (loadError) return err(loadError.message);
    if (!before) return err("Redirect not found.");

    const { error } = await client
      .from("seo_redirects")
      .delete()
      .eq("id", parsed.data);
    if (error) return err(error.message);

    await logAction(client, {
      actorId: session.userId,
      action: "redirect.delete",
      entity: "seo_redirects",
      entityId: parsed.data,
      before: before as Record<string, unknown>,
    });

    revalidateSeo();
    return ok({ id: parsed.data });
  } catch (error) {
    return err(asErrorMessage(error, "Failed to delete redirect."));
  }
}

export async function getSettings(): Promise<
  ActionResult<SeoSiteSettings | null>
> {
  try {
    await requireSeoRole(...READ_ROLES);
    const clientResult = ensureAdminClient();
    if (!clientResult.ok) return clientResult;
    const client = clientResult.data;

    const { data, error } = await client
      .from("seo_site_settings")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error) return err(error.message);
    return ok((data as SeoSiteSettings | null) ?? null);
  } catch (error) {
    return err(asErrorMessage(error, "Failed to load settings."));
  }
}

export async function saveSettings(
  input: z.infer<typeof settingsSchema>,
): Promise<ActionResult<SeoSiteSettings>> {
  try {
    const session = await requireManager();
    const parsed = settingsSchema.safeParse(input);
    if (!parsed.success) {
      return err(parsed.error.issues[0]?.message ?? "Invalid settings.");
    }

    const clientResult = ensureAdminClient();
    if (!clientResult.ok) return clientResult;
    const client = clientResult.data;

    const { data: existing } = await client
      .from("seo_site_settings")
      .select("*")
      .limit(1)
      .maybeSingle();

    const now = new Date().toISOString();
    const payload = {
      robots_txt:
        parsed.data.robots_txt === undefined
          ? ((existing as SeoSiteSettings | null)?.robots_txt ?? null)
          : parsed.data.robots_txt,
      sitemap_defaults:
        parsed.data.sitemap_defaults === undefined
          ? ((existing as SeoSiteSettings | null)?.sitemap_defaults ?? null)
          : parsed.data.sitemap_defaults,
      meta_templates:
        parsed.data.meta_templates === undefined
          ? ((existing as SeoSiteSettings | null)?.meta_templates ?? null)
          : parsed.data.meta_templates,
      crawl_limits:
        parsed.data.crawl_limits === undefined
          ? ((existing as SeoSiteSettings | null)?.crawl_limits ?? null)
          : parsed.data.crawl_limits,
      updated_at: now,
    };

    const { data: saved, error } = existing
      ? await client
          .from("seo_site_settings")
          .update(payload)
          .eq("id", (existing as SeoSiteSettings).id)
          .select("*")
          .single()
      : await client
          .from("seo_site_settings")
          .insert({ id: 1, ...payload })
          .select("*")
          .single();

    if (error) return err(error.message);
    const settings = saved as SeoSiteSettings;

    await logAction(client, {
      actorId: session.userId,
      action: "settings.update",
      entity: "seo_site_settings",
      entityId: String(settings.id),
      before: (existing as Record<string, unknown> | null) ?? null,
      after: { ...settings },
    });

    revalidateSeo();
    revalidatePath("/robots.txt");
    revalidatePath("/sitemap.xml");
    return ok(settings);
  } catch (error) {
    return err(asErrorMessage(error, "Failed to save settings."));
  }
}

export async function bulkUpdatePages(
  input: z.infer<typeof bulkUpdateSchema>,
): Promise<ActionResult<{ updated: number }>> {
  try {
    const session = await requireMutator();
    const parsed = bulkUpdateSchema.safeParse(input);
    if (!parsed.success) {
      return err(parsed.error.issues[0]?.message ?? "Invalid bulk update.");
    }

    const clientResult = ensureAdminClient();
    if (!clientResult.ok) return clientResult;
    const client = clientResult.data;

    const { data, error } = await client
      .from("seo_pages")
      .update({
        ...parsed.data.patch,
        updated_at: new Date().toISOString(),
      })
      .in("id", parsed.data.ids)
      .select("id, path");

    if (error) return err(error.message);

    await logAction(client, {
      actorId: session.userId,
      action: "pages.bulk_update",
      entity: "seo_pages",
      after: {
        ids: parsed.data.ids,
        patch: parsed.data.patch,
        updated: data?.length ?? 0,
      },
    });

    revalidateTag(SEO_CACHE_TAG, "max");
    for (const row of data ?? []) {
      revalidatePath((row as { path: string }).path);
    }
    revalidatePath("/admin/pages");

    return ok({ updated: data?.length ?? 0 });
  } catch (error) {
    return err(asErrorMessage(error, "Failed to bulk update pages."));
  }
}

export async function exportPagesCsv(): Promise<ActionResult<string>> {
  try {
    await requireSeoRole(...READ_ROLES);
    const clientResult = ensureAdminClient();
    if (!clientResult.ok) return clientResult;
    const client = clientResult.data;

    const { data, error } = await client
      .from("seo_pages")
      .select("*")
      .order("path", { ascending: true });
    if (error) return err(error.message);

    const rows = ((data ?? []) as SeoPage[]).map(pageToCsvRow);
    return ok(
      serializeCsv(rows, [...SEO_PAGE_CSV_COLUMNS]),
    );
  } catch (error) {
    return err(asErrorMessage(error, "Failed to export pages CSV."));
  }
}

export async function importPagesCsv(
  csvText: string,
): Promise<ActionResult<{ imported: number; errors: string[] }>> {
  try {
    const session = await requireMutator();
    const parsedText = z.string().min(1).safeParse(csvText);
    if (!parsedText.success) return err("CSV text is required.");

    const clientResult = ensureAdminClient();
    if (!clientResult.ok) return clientResult;
    const client = clientResult.data;

    const { rows } = parseCsv(parsedText.data);
    if (rows.length === 0) return err("No data rows found in CSV.");

    let imported = 0;
    const errors: string[] = [];

    for (const [index, row] of rows.entries()) {
      const path = row.path?.trim();
      if (!path) {
        errors.push(`Row ${index + 2}: missing path`);
        continue;
      }

      const result = await savePage({
        id: row.id?.trim() || undefined,
        path,
        page_type: (row.page_type as SeoPageType | undefined) || undefined,
        title: row.title || null,
        meta_description: row.meta_description || null,
        focus_keyword: row.focus_keyword || null,
        canonical_url: row.canonical_url || null,
        robots_index: boolFromCsv(row.robots_index, true),
        robots_follow: boolFromCsv(row.robots_follow, true),
        og_title: row.og_title || null,
        og_description: row.og_description || null,
        og_image: row.og_image || null,
        include_in_sitemap: boolFromCsv(row.include_in_sitemap, true),
        status: (row.status as SeoPublishStatus | undefined) || undefined,
      });

      if (!result.ok) {
        errors.push(`Row ${index + 2} (${path}): ${result.error}`);
      } else {
        imported += 1;
      }
    }

    await logAction(client, {
      actorId: session.userId,
      action: "pages.import_csv",
      entity: "seo_pages",
      after: { imported, errors: errors.length },
    });

    revalidateSeo();
    return ok({ imported, errors });
  } catch (error) {
    return err(asErrorMessage(error, "Failed to import pages CSV."));
  }
}

export async function listActionLogs(input?: {
  limit?: number;
}): Promise<ActionResult<SeoActionLog[]>> {
  try {
    await requireSeoRole(...READ_ROLES);
    const clientResult = ensureAdminClient();
    if (!clientResult.ok) return clientResult;
    const client = clientResult.data;

    const limit = Math.min(Math.max(input?.limit ?? 50, 1), 200);
    const { data, error } = await client
      .from("seo_action_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) return err(error.message);
    return ok((data ?? []) as SeoActionLog[]);
  } catch (error) {
    return err(asErrorMessage(error, "Failed to list action logs."));
  }
}

export async function listProfiles(): Promise<ActionResult<SeoProfile[]>> {
  try {
    await requireSeoRole(...READ_ROLES);
    const clientResult = ensureAdminClient();
    if (!clientResult.ok) return clientResult;
    const client = clientResult.data;

    const { data, error } = await client
      .from("seo_profiles")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) return err(error.message);
    return ok((data ?? []) as SeoProfile[]);
  } catch (error) {
    return err(asErrorMessage(error, "Failed to list profiles."));
  }
}

/**
 * Updates role in seo_profiles and attempts to mirror Clerk publicMetadata.role.
 * Clerk and DB roles must match for middleware/session checks to stay consistent.
 */
export async function updateUserRole(input: {
  userId: string;
  role: SeoRole;
}): Promise<ActionResult<SeoProfile>> {
  try {
    const session = await requireManager();
    const parsed = z
      .object({
        userId: z.string().min(1),
        role: z.enum(["owner", "admin", "editor", "viewer"]),
      })
      .safeParse(input);
    if (!parsed.success) {
      return err(parsed.error.issues[0]?.message ?? "Invalid role update.");
    }
    if (!isSeoRole(parsed.data.role)) return err("Invalid role.");

    const clientResult = ensureAdminClient();
    if (!clientResult.ok) return clientResult;
    const client = clientResult.data;

    const { data: before, error: loadError } = await client
      .from("seo_profiles")
      .select("*")
      .eq("user_id", parsed.data.userId)
      .maybeSingle();
    if (loadError) return err(loadError.message);
    if (!before) return err("Profile not found.");

    const now = new Date().toISOString();
    const { data: saved, error } = await client
      .from("seo_profiles")
      .update({ role: parsed.data.role, updated_at: now })
      .eq("user_id", parsed.data.userId)
      .select("*")
      .single();

    if (error) return err(error.message);
    const profile = saved as SeoProfile;

    let clerkWarning: string | null = null;
    try {
      const clerk = await clerkClient();
      const user = await clerk.users.getUser(parsed.data.userId);
      await clerk.users.updateUser(parsed.data.userId, {
        publicMetadata: {
          ...(user.publicMetadata as Record<string, unknown>),
          role: parsed.data.role,
        },
      });
    } catch (clerkError) {
      clerkWarning = asErrorMessage(
        clerkError,
        "Clerk publicMetadata.role could not be updated. Update it manually so it matches seo_profiles.",
      );
    }

    await logAction(client, {
      actorId: session.userId,
      action: "profile.role_update",
      entity: "seo_profiles",
      entityId: profile.id,
      before: before as Record<string, unknown>,
      after: {
        ...profile,
        clerk_sync: clerkWarning ? "failed" : "ok",
        clerk_error: clerkWarning,
      },
    });

    revalidatePath("/admin/users");

    if (clerkWarning) {
      return err(
        `Role saved in seo_profiles, but Clerk sync failed: ${clerkWarning}. Ensure publicMetadata.role matches.`,
      );
    }

    return ok(profile);
  } catch (error) {
    return err(asErrorMessage(error, "Failed to update user role."));
  }
}
