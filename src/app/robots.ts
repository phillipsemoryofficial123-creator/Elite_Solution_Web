import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { getSiteSettings } from "@/lib/seo/get-page-seo";

type RobotsRule = {
  userAgent: string;
  allow?: string | string[];
  disallow?: string | string[];
};

function defaultRobots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${site.website.replace(/\/$/, "")}/sitemap.xml`,
  };
}

/**
 * Very small robots.txt parser for User-agent / Allow / Disallow groups.
 * Falls back to Allow-all when parsing yields nothing useful.
 */
function parseRobotsTxt(robotsTxt: string): RobotsRule[] {
  const lines = robotsTxt
    .split(/\r?\n/)
    .map((line) => line.replace(/#.*$/, "").trim())
    .filter(Boolean);

  const rules: RobotsRule[] = [];
  let current: RobotsRule | null = null;

  const flush = () => {
    if (current) {
      rules.push(current);
      current = null;
    }
  };

  for (const line of lines) {
    const colon = line.indexOf(":");
    if (colon === -1) continue;

    const key = line.slice(0, colon).trim().toLowerCase();
    const value = line.slice(colon + 1).trim();
    if (!value) continue;

    if (key === "user-agent") {
      if (current && current.userAgent !== value) {
        flush();
      }
      if (!current) {
        current = { userAgent: value };
      } else {
        current.userAgent = value;
      }
      continue;
    }

    if (!current) {
      current = { userAgent: "*" };
    }

    if (key === "allow") {
      const existing = current.allow;
      if (!existing) current.allow = value;
      else if (Array.isArray(existing)) existing.push(value);
      else current.allow = [existing, value];
    } else if (key === "disallow") {
      const existing = current.disallow;
      if (!existing) current.disallow = value;
      else if (Array.isArray(existing)) existing.push(value);
      else current.disallow = [existing, value];
    }
  }

  flush();
  return rules;
}

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getSiteSettings();
  const robotsTxt = settings?.robots_txt?.trim();

  if (!robotsTxt) {
    return defaultRobots();
  }

  const rules = parseRobotsTxt(robotsTxt);
  if (rules.length === 0) {
    return defaultRobots();
  }

  return {
    rules: rules.length === 1 ? rules[0] : rules,
    sitemap: `${site.website.replace(/\/$/, "")}/sitemap.xml`,
  };
}
