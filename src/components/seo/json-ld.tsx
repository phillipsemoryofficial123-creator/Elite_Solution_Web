import { validateJsonLd } from "@/lib/seo/json-ld";
import type { JsonLdValue } from "@/lib/seo/types";

type JsonLdProps = {
  data: string | JsonLdValue | null | undefined;
};

/**
 * Server component: renders a valid application/ld+json script, or nothing.
 */
export function JsonLd({ data }: JsonLdProps) {
  if (data == null) return null;

  const result = validateJsonLd(data);
  if (!result.ok) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(result.value),
      }}
    />
  );
}
