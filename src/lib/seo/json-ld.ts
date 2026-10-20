import type { JsonLdValue } from "@/lib/seo/types";

export type JsonLdValidationResult =
  | { ok: true; value: JsonLdValue }
  | { ok: false; error: string };

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isJsonLdValue(value: unknown): value is JsonLdValue {
  if (isPlainObject(value)) return true;
  if (Array.isArray(value)) {
    return value.length > 0 && value.every(isPlainObject);
  }
  return false;
}

/**
 * Validates JSON-LD input as a parseable object or non-empty array of objects.
 */
export function validateJsonLd(
  input: string | object,
): JsonLdValidationResult {
  let parsed: unknown;

  if (typeof input === "string") {
    const trimmed = input.trim();
    if (!trimmed) {
      return { ok: false, error: "JSON-LD is empty." };
    }
    try {
      parsed = JSON.parse(trimmed);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Invalid JSON syntax.";
      return { ok: false, error: `JSON-LD parse error: ${message}` };
    }
  } else {
    parsed = input;
  }

  if (!isJsonLdValue(parsed)) {
    return {
      ok: false,
      error:
        "JSON-LD must be a JSON object or a non-empty array of objects.",
    };
  }

  return { ok: true, value: parsed };
}
