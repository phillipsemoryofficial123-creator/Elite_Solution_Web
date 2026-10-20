/**
 * Lightweight CSV parse/serialize for SEO page bulk import/export.
 * Handles quoted fields, commas, and newlines inside quotes.
 */

export type CsvRow = Record<string, string>;

function escapeCell(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function serializeCsv(
  rows: CsvRow[],
  columns?: string[],
): string {
  if (rows.length === 0 && (!columns || columns.length === 0)) {
    return "";
  }

  const cols =
    columns ??
    Array.from(
      rows.reduce((set, row) => {
        Object.keys(row).forEach((key) => set.add(key));
        return set;
      }, new Set<string>()),
    );

  const lines = [
    cols.map(escapeCell).join(","),
    ...rows.map((row) =>
      cols.map((col) => escapeCell(row[col] ?? "")).join(","),
    ),
  ];

  return `${lines.join("\n")}\n`;
}

export function parseCsv(text: string): { columns: string[]; rows: CsvRow[] } {
  const input = text.replace(/^\uFEFF/, "").trim();
  if (!input) return { columns: [], rows: [] };

  const rows: string[][] = [];
  let current: string[] = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    const next = input[i + 1];

    if (inQuotes) {
      if (ch === '"' && next === '"') {
        cell += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        cell += ch;
      }
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
      continue;
    }

    if (ch === ",") {
      current.push(cell);
      cell = "";
      continue;
    }

    if (ch === "\n" || (ch === "\r" && next === "\n")) {
      if (ch === "\r") i++;
      current.push(cell);
      rows.push(current);
      current = [];
      cell = "";
      continue;
    }

    if (ch === "\r") {
      current.push(cell);
      rows.push(current);
      current = [];
      cell = "";
      continue;
    }

    cell += ch;
  }

  current.push(cell);
  if (current.length > 1 || current[0] !== "" || rows.length === 0) {
    rows.push(current);
  }

  const [header, ...body] = rows;
  if (!header) return { columns: [], rows: [] };

  const columns = header.map((h) => h.trim());
  const parsed = body
    .filter((line) => line.some((c) => c.trim() !== ""))
    .map((line) => {
      const row: CsvRow = {};
      columns.forEach((col, idx) => {
        row[col] = (line[idx] ?? "").trim();
      });
      return row;
    });

  return { columns, rows: parsed };
}

export const SEO_PAGE_CSV_COLUMNS = [
  "id",
  "path",
  "page_type",
  "title",
  "meta_description",
  "focus_keyword",
  "canonical_url",
  "robots_index",
  "robots_follow",
  "og_title",
  "og_description",
  "og_image",
  "include_in_sitemap",
  "status",
  "seo_score",
] as const;
