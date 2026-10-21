export const ADMIN_COOKIE = "elite_admin";
export const ADMIN_USERNAME = "admin";
export const ADMIN_PASSWORD = "Webadmin@786";

const SESSION_SECRET = "elite-admin-session-v1";
const SESSION_MS = 7 * 24 * 60 * 60 * 1000;

function bytesToBase64Url(bytes: ArrayBuffer): string {
  const bin = String.fromCharCode(...new Uint8Array(bytes));
  return btoa(bin).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function timingSafeEqual(a: string, b: string): boolean {
  const left = new TextEncoder().encode(a);
  const right = new TextEncoder().encode(b);
  const len = Math.max(left.length, right.length, 1);
  const padL = new Uint8Array(len);
  const padR = new Uint8Array(len);
  padL.set(left.subarray(0, len));
  padR.set(right.subarray(0, len));
  let diff = left.length === right.length ? 0 : 1;
  for (let i = 0; i < len; i += 1) diff |= padL[i]! ^ padR[i]!;
  return diff === 0;
}

async function sign(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(SESSION_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return bytesToBase64Url(sig);
}

export function credentialsMatch(username: string, password: string): boolean {
  const userOk = timingSafeEqual(username.trim().toLowerCase(), ADMIN_USERNAME);
  const passOk = timingSafeEqual(password, ADMIN_PASSWORD);
  return userOk && passOk;
}

export async function createAdminToken(): Promise<string> {
  const exp = Date.now() + SESSION_MS;
  const payload = `v1.${exp}`;
  const sig = await sign(payload);
  return `${payload}.${sig}`;
}

export async function verifyAdminToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [version, exp, sig] = parts;
  if (version !== "v1" || !exp || !sig) return false;
  const expires = Number(exp);
  if (!Number.isFinite(expires) || expires < Date.now()) return false;
  const expected = await sign(`v1.${exp}`);
  return timingSafeEqual(expected, sig);
}

export const ADMIN_COOKIE_MAX_AGE = SESSION_MS / 1000;
