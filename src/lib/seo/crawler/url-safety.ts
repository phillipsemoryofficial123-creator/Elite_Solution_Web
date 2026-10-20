/**
 * URL safety checks for the SEO crawler frontier.
 * Pure helpers — safe to unit test without network I/O.
 */

const LOCALHOST_HOSTS = new Set([
  "localhost",
  "localhost.",
  "0.0.0.0",
  "[::1]",
  "::1",
]);

export type UrlSafetyReason =
  | "invalid_url"
  | "non_http"
  | "credentials"
  | "localhost"
  | "private_ip"
  | "link_local"
  | "off_origin";

export type UrlSafetyResult =
  | { ok: true; url: URL }
  | { ok: false; reason: UrlSafetyReason };

function normalizeIpv4(hostname: string): number[] | null {
  const parts = hostname.split(".");
  if (parts.length !== 4) return null;
  const octets: number[] = [];
  for (const part of parts) {
    if (!/^\d{1,3}$/.test(part)) return null;
    const n = Number(part);
    if (n < 0 || n > 255) return null;
    octets.push(n);
  }
  return octets;
}

/** True for 127.0.0.0/8 loopback. */
export function isLoopbackIpv4(hostname: string): boolean {
  const octets = normalizeIpv4(hostname);
  return octets != null && octets[0] === 127;
}

/** True for 10/8, 172.16–31/12, 192.168/16. */
export function isPrivateIpv4(hostname: string): boolean {
  const octets = normalizeIpv4(hostname);
  if (!octets) return false;
  const [a, b] = octets;
  if (a === 10) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  return false;
}

/** True for 169.254.0.0/16 link-local. */
export function isLinkLocalIpv4(hostname: string): boolean {
  const octets = normalizeIpv4(hostname);
  return octets != null && octets[0] === 169 && octets[1] === 254;
}

/** True for ::1 and fc00::/7 / fe80::/10 when hostname is a literal IPv6. */
export function isPrivateOrLocalIpv6(hostname: string): boolean {
  const raw = hostname.replace(/^\[|\]$/g, "").toLowerCase();
  if (raw === "::1") return true;
  if (raw.startsWith("fe80:")) return true; // link-local
  if (raw.startsWith("fc") || raw.startsWith("fd")) return true; // unique local
  return false;
}

export function isLocalhostHostname(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/\.$/, "");
  if (LOCALHOST_HOSTS.has(host) || LOCALHOST_HOSTS.has(hostname.toLowerCase())) {
    return true;
  }
  if (host.endsWith(".localhost")) return true;
  if (isLoopbackIpv4(host)) return true;
  if (host === "::1" || host === "[::1]") return true;
  return false;
}

export function isBlockedHostname(hostname: string): UrlSafetyReason | null {
  const host = hostname.toLowerCase().replace(/\.$/, "");
  if (isLocalhostHostname(host) || isLocalhostHostname(hostname)) {
    return "localhost";
  }
  if (isPrivateIpv4(host)) return "private_ip";
  if (isLinkLocalIpv4(host)) return "link_local";
  if (isPrivateOrLocalIpv6(host) || isPrivateOrLocalIpv6(hostname)) {
    if (host === "::1" || hostname.toLowerCase() === "[::1]") {
      return "localhost";
    }
    if (host.startsWith("fe80") || hostname.toLowerCase().includes("fe80")) {
      return "link_local";
    }
    return "private_ip";
  }
  return null;
}

/**
 * Validates a candidate crawl URL against an allowed site origin.
 * When `requireSameOrigin` is true (frontier), off-origin URLs are rejected.
 */
export function evaluateCrawlUrl(
  url: string,
  origin: string,
  options?: { requireSameOrigin?: boolean },
): UrlSafetyResult {
  let parsed: URL;
  let originUrl: URL;
  try {
    parsed = new URL(url);
    originUrl = new URL(origin);
  } catch {
    return { ok: false, reason: "invalid_url" };
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return { ok: false, reason: "non_http" };
  }

  if (parsed.username || parsed.password) {
    return { ok: false, reason: "credentials" };
  }

  const blocked = isBlockedHostname(parsed.hostname);
  if (blocked) return { ok: false, reason: blocked };

  const requireSameOrigin = options?.requireSameOrigin ?? true;
  if (requireSameOrigin) {
    if (parsed.origin !== originUrl.origin) {
      return { ok: false, reason: "off_origin" };
    }
  }

  return { ok: true, url: parsed };
}

/** Frontier-safe: same origin, http(s), no credentials, no private/localhost. */
export function isSafeCrawlUrl(url: string, origin: string): boolean {
  return evaluateCrawlUrl(url, origin, { requireSameOrigin: true }).ok;
}

/** External HEAD checks: http(s), no credentials, no private/localhost (any origin). */
export function isSafeExternalCheckUrl(url: string, origin: string): boolean {
  return evaluateCrawlUrl(url, origin, { requireSameOrigin: false }).ok;
}

export function normalizeOrigin(origin: string): string {
  const url = new URL(origin);
  return url.origin;
}

export function absoluteUrlFromPath(path: string, origin: string): string {
  const base = normalizeOrigin(origin);
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalized, `${base}/`).href;
}
