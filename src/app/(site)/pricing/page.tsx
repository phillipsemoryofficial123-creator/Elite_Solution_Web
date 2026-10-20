import type { Metadata } from "next";
import { PricingStudioPage } from "@/components/pricing-studio-page";
import { JsonLd } from "@/components/seo/json-ld";
import { buildMetadataFromSeo } from "@/lib/seo/build-metadata";
import { getPublishedPageSeo } from "@/lib/seo/get-page-seo";

const defaults: Metadata = {
  title: "Pricing",
  description:
    "Affordable, transparent pricing for tailored financial and non-financial solutions — book a complimentary 2-part discovery call with Elite Solutions USA.",
};

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPublishedPageSeo("/pricing");
  return buildMetadataFromSeo(defaults, seo);
}

export default async function PricingPage() {
  const seo = await getPublishedPageSeo("/pricing");
  return (
    <>
      <JsonLd data={seo?.json_ld} />
      <PricingStudioPage />
    </>
  );
}
