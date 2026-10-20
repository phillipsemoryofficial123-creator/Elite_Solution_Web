import type { Metadata } from "next";
import { AboutStudioPage } from "@/components/about-studio-page";
import { JsonLd } from "@/components/seo/json-ld";
import { buildMetadataFromSeo } from "@/lib/seo/build-metadata";
import { getPublishedPageSeo } from "@/lib/seo/get-page-seo";

const defaults: Metadata = {
  title: "About",
  description:
    "Your partner in financial and business growth — specialized accounting, tax, payroll, and digital services from Elite Solutions USA.",
};

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPublishedPageSeo("/about");
  return buildMetadataFromSeo(defaults, seo);
}

export default async function AboutPage() {
  const seo = await getPublishedPageSeo("/about");
  return (
    <>
      <JsonLd data={seo?.json_ld} />
      <AboutStudioPage />
    </>
  );
}
