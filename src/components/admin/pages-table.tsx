"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { SeoPage, SeoPageType, SeoPublishStatus } from "@/lib/seo/types";
import { StatusPill } from "@/components/admin/status-pill";
import { EmptyState } from "@/components/admin/empty-state";

type SortKey = "path" | "title" | "seo_score" | "status" | "updated_at";

type PagesTableProps = {
  pages: SeoPage[];
};

export function PagesTable({ pages }: PagesTableProps) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("path");
  const [direction, setDirection] = useState<"asc" | "desc">("asc");
  const [status, setStatus] = useState<SeoPublishStatus | "">("");
  const [pageType, setPageType] = useState<SeoPageType | "">("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let rows = [...pages];
    if (status) rows = rows.filter((p) => p.status === status);
    if (pageType) rows = rows.filter((p) => p.page_type === pageType);
    if (q) {
      rows = rows.filter((p) =>
        [p.path, p.title, p.focus_keyword, p.meta_description]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(q),
      );
    }
    rows.sort((a, b) => {
      const av = a[sort];
      const bv = b[sort];
      const aVal = av == null ? "" : String(av).toLowerCase();
      const bVal = bv == null ? "" : String(bv).toLowerCase();
      if (sort === "seo_score") {
        const an = a.seo_score ?? -1;
        const bn = b.seo_score ?? -1;
        return direction === "asc" ? an - bn : bn - an;
      }
      if (aVal < bVal) return direction === "asc" ? -1 : 1;
      if (aVal > bVal) return direction === "asc" ? 1 : -1;
      return 0;
    });
    return rows;
  }, [pages, search, sort, direction, status, pageType]);

  function toggleSort(key: SortKey) {
    if (sort === key) {
      setDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSort(key);
      setDirection("asc");
    }
  }

  return (
    <div>
      <div className="admin-toolbar">
        <input
          className="admin-toolbar__search"
          placeholder="Search path, title, keyword…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as SeoPublishStatus | "")}
        >
          <option value="">All statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="scheduled">Scheduled</option>
          <option value="unpublished">Unpublished</option>
        </select>
        <select
          value={pageType}
          onChange={(e) => setPageType(e.target.value as SeoPageType | "")}
        >
          <option value="">All types</option>
          <option value="static">Static</option>
          <option value="service">Service</option>
          <option value="blog">Blog</option>
          <option value="other">Other</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No pages match"
          description="Adjust search or filters, or seed seo_pages from known site paths."
        />
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                {(
                  [
                    ["path", "Path"],
                    ["title", "Title"],
                    ["seo_score", "Score"],
                    ["status", "Status"],
                    ["updated_at", "Updated"],
                  ] as const
                ).map(([key, label]) => (
                  <th key={key}>
                    <button
                      type="button"
                      className="admin-sort-btn"
                      onClick={() => toggleSort(key)}
                    >
                      {label}
                      {sort === key ? (direction === "asc" ? " ↑" : " ↓") : ""}
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((page) => (
                <tr key={page.id}>
                  <td>
                    <Link href={`/admin/pages/${page.id}`}>{page.path}</Link>
                  </td>
                  <td>{page.title ?? "—"}</td>
                  <td>{page.seo_score ?? "—"}</td>
                  <td>
                    <StatusPill status={page.status} />
                  </td>
                  <td>{new Date(page.updated_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
