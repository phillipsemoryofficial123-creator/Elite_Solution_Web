export type RedirectEdge = {
  from_path: string;
  to_url: string;
};

function normalizePath(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "/";

  try {
    if (/^https?:\/\//i.test(trimmed)) {
      const url = new URL(trimmed);
      const path = url.pathname || "/";
      return path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;
    }
  } catch {
    // Fall through to path normalization.
  }

  let path = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  if (path.length > 1 && path.endsWith("/")) {
    path = path.slice(0, -1);
  }
  return path;
}

function toPathKey(fromOrTo: string): string | null {
  const trimmed = fromOrTo.trim();
  if (!trimmed) return null;

  if (/^https?:\/\//i.test(trimmed)) {
    try {
      return normalizePath(new URL(trimmed).pathname);
    } catch {
      return null;
    }
  }

  return normalizePath(trimmed);
}

/**
 * Returns true if adding (or updating) a redirect from → to would create a cycle
 * when composed with the existing redirect set.
 */
export function wouldCreateRedirectLoop(
  from: string,
  to: string,
  existing: RedirectEdge[],
): boolean {
  const fromPath = normalizePath(from);
  const toKey = toPathKey(to);

  if (!toKey) {
    // External / unparseable absolute URL — no internal loop possible.
    if (/^https?:\/\//i.test(to.trim())) return false;
    return false;
  }

  if (fromPath === toKey) return true;

  const map = new Map<string, string>();
  for (const edge of existing) {
    const edgeFrom = normalizePath(edge.from_path);
    if (edgeFrom === fromPath) continue;
    const edgeTo = toPathKey(edge.to_url);
    if (edgeTo) map.set(edgeFrom, edgeTo);
  }
  map.set(fromPath, toKey);

  const visited = new Set<string>();
  let current: string | undefined = fromPath;

  while (current) {
    if (visited.has(current)) return true;
    visited.add(current);
    current = map.get(current);
  }

  return false;
}
