/**
 * Lightweight HTML extraction for technical SEO audits.
 * Regex-based — intentionally conservative; never invents content.
 */

export type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export type ParsedHeading = {
  level: number;
  tag: HeadingTag;
  text: string;
};

export type ParsedLink = {
  href: string;
  absolute: string;
  isInternal: boolean;
};

export type ParsedImage = {
  src: string | null;
  alt: string | null;
  missingAlt: boolean;
};

export type ParsedHtml = {
  title: string | null;
  metaDescription: string | null;
  canonical: string | null;
  robotsMeta: string | null;
  headings: ParsedHeading[];
  headingCounts: Record<HeadingTag, number>;
  headingOrderIssues: string[];
  imagesMissingAlt: ParsedImage[];
  jsonLdScripts: string[];
  jsonLdParseErrors: Array<{ index: number; message: string }>;
  links: ParsedLink[];
};

function decodeBasicEntities(text: string): string {
  return text
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function attr(tag: string, name: string): string | null {
  const re = new RegExp(
    `\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`,
    "i",
  );
  const match = tag.match(re);
  if (!match) return null;
  return match[1] ?? match[2] ?? match[3] ?? null;
}

function stripTags(html: string): string {
  return decodeBasicEntities(html.replace(/<[^>]+>/g, " "));
}

function resolveUrl(href: string, pageUrl: string): string | null {
  try {
    return new URL(href, pageUrl).href;
  } catch {
    return null;
  }
}

function sameOrigin(a: string, b: string): boolean {
  try {
    return new URL(a).origin === new URL(b).origin;
  } catch {
    return false;
  }
}

export function analyzeHeadingOrder(headings: ParsedHeading[]): string[] {
  const issues: string[] = [];
  if (headings.length === 0) return issues;

  let prev = headings[0].level;
  for (let i = 1; i < headings.length; i++) {
    const level = headings[i].level;
    if (level > prev + 1) {
      issues.push(
        `Heading level skipped: h${prev} followed by h${level} (order index ${i}).`,
      );
    }
    prev = level;
  }
  return issues;
}

export function parseHtmlDocument(html: string, pageUrl: string): ParsedHtml {
  const titleMatch = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? stripTags(titleMatch[1]) || null : null;

  let metaDescription: string | null = null;
  let robotsMeta: string | null = null;
  let canonical: string | null = null;

  const metaRe = /<meta\b[^>]*>/gi;
  let metaTag: RegExpExecArray | null;
  while ((metaTag = metaRe.exec(html)) !== null) {
    const tag = metaTag[0];
    const name = (attr(tag, "name") ?? attr(tag, "property") ?? "").toLowerCase();
    const content = attr(tag, "content");
    if (name === "description" && content != null) {
      metaDescription = decodeBasicEntities(content);
    }
    if (name === "robots" && content != null) {
      robotsMeta = decodeBasicEntities(content);
    }
  }

  const linkRe = /<link\b[^>]*>/gi;
  let linkTag: RegExpExecArray | null;
  while ((linkTag = linkRe.exec(html)) !== null) {
    const tag = linkTag[0];
    const rel = (attr(tag, "rel") ?? "").toLowerCase();
    if (rel.split(/\s+/).includes("canonical")) {
      const href = attr(tag, "href");
      if (href) {
        canonical = resolveUrl(href, pageUrl) ?? href;
      }
    }
  }

  const headings: ParsedHeading[] = [];
  const headingRe = /<(h[1-6])\b[^>]*>([\s\S]*?)<\/\1>/gi;
  let headingMatch: RegExpExecArray | null;
  while ((headingMatch = headingRe.exec(html)) !== null) {
    const tag = headingMatch[1].toLowerCase() as HeadingTag;
    const level = Number(tag.slice(1));
    headings.push({
      level,
      tag,
      text: stripTags(headingMatch[2]),
    });
  }

  const headingCounts: Record<HeadingTag, number> = {
    h1: 0,
    h2: 0,
    h3: 0,
    h4: 0,
    h5: 0,
    h6: 0,
  };
  for (const h of headings) {
    headingCounts[h.tag] += 1;
  }

  const imagesMissingAlt: ParsedImage[] = [];
  const imgRe = /<img\b[^>]*>/gi;
  let imgTag: RegExpExecArray | null;
  while ((imgTag = imgRe.exec(html)) !== null) {
    const tag = imgTag[0];
    const hasAlt = /\balt\s*=/i.test(tag);
    const alt = hasAlt ? attr(tag, "alt") : null;
    if (!hasAlt || alt === null) {
      imagesMissingAlt.push({
        src: attr(tag, "src"),
        alt: null,
        missingAlt: true,
      });
    }
  }

  const jsonLdScripts: string[] = [];
  const jsonLdParseErrors: Array<{ index: number; message: string }> = [];
  const scriptRe =
    /<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let scriptMatch: RegExpExecArray | null;
  let scriptIndex = 0;
  while ((scriptMatch = scriptRe.exec(html)) !== null) {
    const raw = scriptMatch[1].trim();
    jsonLdScripts.push(raw);
    try {
      JSON.parse(raw);
    } catch (error) {
      jsonLdParseErrors.push({
        index: scriptIndex,
        message: error instanceof Error ? error.message : "Invalid JSON",
      });
    }
    scriptIndex += 1;
  }

  const links: ParsedLink[] = [];
  const anchorRe = /<a\b[^>]*>/gi;
  let anchorTag: RegExpExecArray | null;
  while ((anchorTag = anchorRe.exec(html)) !== null) {
    const tag = anchorTag[0];
    const href = attr(tag, "href");
    if (!href) continue;
    const trimmed = href.trim();
    if (
      !trimmed ||
      trimmed.startsWith("#") ||
      trimmed.startsWith("mailto:") ||
      trimmed.startsWith("tel:") ||
      trimmed.startsWith("javascript:")
    ) {
      continue;
    }
    const absolute = resolveUrl(trimmed, pageUrl);
    if (!absolute) continue;
    links.push({
      href: trimmed,
      absolute,
      isInternal: sameOrigin(absolute, pageUrl),
    });
  }

  return {
    title,
    metaDescription,
    canonical,
    robotsMeta,
    headings,
    headingCounts,
    headingOrderIssues: analyzeHeadingOrder(headings),
    imagesMissingAlt,
    jsonLdScripts,
    jsonLdParseErrors,
    links,
  };
}

export function robotsMetaHasNoindex(robotsMeta: string | null): boolean {
  if (!robotsMeta) return false;
  return /\bnoindex\b/i.test(robotsMeta);
}
