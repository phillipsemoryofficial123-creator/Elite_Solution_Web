import "server-only";

import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;
const KEY_LENGTH = 32;

function resolveEncryptionKey(): Buffer {
  const raw = process.env.SEO_TOKEN_ENCRYPTION_KEY;
  if (!raw || !raw.trim()) {
    throw new Error(
      "Missing SEO_TOKEN_ENCRYPTION_KEY. Set a 32-byte key as 64-char hex or base64 for Google token encryption.",
    );
  }

  const trimmed = raw.trim();

  if (/^[0-9a-fA-F]{64}$/.test(trimmed)) {
    return Buffer.from(trimmed, "hex");
  }

  try {
    const fromBase64 = Buffer.from(trimmed, "base64");
    if (fromBase64.length === KEY_LENGTH) {
      return fromBase64;
    }
  } catch {
    // Fall through to length error.
  }

  const asUtf8 = Buffer.from(trimmed, "utf8");
  if (asUtf8.length === KEY_LENGTH) {
    return asUtf8;
  }

  throw new Error(
    "SEO_TOKEN_ENCRYPTION_KEY must be 32 bytes (64-char hex or base64-encoded).",
  );
}

/**
 * Encrypts a secret with AES-256-GCM.
 * Output format: base64url(iv).base64url(ciphertext).base64url(authTag)
 */
export function encryptSecret(plaintext: string): string {
  const key = resolveEncryptionKey();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });

  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  return [
    iv.toString("base64url"),
    encrypted.toString("base64url"),
    authTag.toString("base64url"),
  ].join(".");
}

/**
 * Decrypts a payload produced by encryptSecret.
 */
export function decryptSecret(payload: string): string {
  const key = resolveEncryptionKey();
  const parts = payload.split(".");
  if (parts.length !== 3) {
    throw new Error("Invalid encrypted secret format.");
  }

  const [ivPart, dataPart, tagPart] = parts;
  const iv = Buffer.from(ivPart, "base64url");
  const data = Buffer.from(dataPart, "base64url");
  const authTag = Buffer.from(tagPart, "base64url");

  if (iv.length !== IV_LENGTH) {
    throw new Error("Invalid encrypted secret IV length.");
  }

  if (authTag.length !== AUTH_TAG_LENGTH) {
    throw new Error("Invalid encrypted secret auth tag length.");
  }

  const decipher = createDecipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
  return decrypted.toString("utf8");
}

/** Constant-time compare helper for secrets (e.g. CRON_SECRET). */
export function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}
