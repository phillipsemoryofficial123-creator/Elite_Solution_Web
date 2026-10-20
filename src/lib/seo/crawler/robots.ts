/**
 * Minimal robots.txt parser for User-agent: * Allow/Disallow rules.
 */

export type RobotsRule = {
  type: "allow" | "disallow";
  path: string;
};

export type RobotsParseResult = {
  rules: RobotsRule[];
  sitemaps: string[];
};

function decodePath(path: string): string {
  try {
    return decodeURIComponent(path);
  } catch {
    return path;
  }
}

/**
 * Parses robots.txt and returns Allow/Disallow rules for User-agent: *.
 * Group-specific agents other than * are ignored.
 */
export function parseRobotsTxt(text: string): RobotsParseResult {
  const lines = text.split(/\r?\n/);
  const sitemaps: string[] = [];
  const groups: Array<{ agents: string[]; rules: RobotsRule[] }> = [];
  let current: { agents: string[]; rules: RobotsRule[] } | null = null;
  let expectingAgents = false;

  for (const rawLine of lines) {
    const line = rawLine.replace(/#.*$/, "").trim();
    if (!line) continue;

    const colon = line.indexOf(":");
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim().toLowerCase();
    const value = line.slice(colon + 1).trim();

    if (key === "sitemap" && value) {
      sitemaps.push(value);
      continue;
    }

    if (key === "user-agent") {
      const agent = value.toLowerCase();
      if (!current || !expectingAgents) {
        current = { agents: [agent], rules: [] };
        groups.push(current);
      } else {
        current.agents.push(agent);
      }
      expectingAgents = true;
      continue;
    }

    expectingAgents = false;
    if (!current) continue;

    if (key === "allow") {
      current.rules.push({ type: "allow", path: decodePath(value || "/") });
    } else if (key === "disallow") {
      // Empty Disallow means allow all for that rule — skip empty.
      if (value === "") continue;
      current.rules.push({ type: "disallow", path: decodePath(value) });
    }
  }

  const star = groups.find((g) => g.agents.includes("*"));
  return {
    rules: star?.rules ?? [],
    sitemaps,
  };
}

function pathMatches(rulePath: string, path: string): boolean {
  if (rulePath === "") return false;
  if (rulePath === "/") return true;

  // Support trailing * wildcard used by many robots.txt files.
  if (rulePath.endsWith("*")) {
    const prefix = rulePath.slice(0, -1);
    return path.startsWith(prefix);
  }

  return path.startsWith(rulePath);
}

/**
 * Returns whether `path` (pathname + optional search) is allowed by rules.
 * Longest matching rule wins; Allow and Disallow compete by length.
 * Default is allowed when no rule matches.
 */
export function isPathAllowed(path: string, rules: RobotsRule[]): boolean {
  const pathname = path.startsWith("/") ? path : `/${path}`;

  let best: RobotsRule | null = null;
  for (const rule of rules) {
    if (!pathMatches(rule.path, pathname)) continue;
    if (!best || rule.path.length > best.path.length) {
      best = rule;
    } else if (
      best &&
      rule.path.length === best.path.length &&
      rule.type === "allow"
    ) {
      // Tie → Allow wins (common crawler convention).
      best = rule;
    }
  }

  if (!best) return true;
  return best.type === "allow";
}
