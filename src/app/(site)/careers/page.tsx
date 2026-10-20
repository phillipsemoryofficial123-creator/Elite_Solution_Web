import type { Metadata } from "next";
import { CareersStudioPage } from "@/components/careers-studio-page";
import { JsonLd } from "@/components/seo/json-ld";
import { buildMetadataFromSeo } from "@/lib/seo/build-metadata";
import { getPublishedPageSeo } from "@/lib/seo/get-page-seo";

const defaults: Metadata = {
  title: "Careers",
  description:
    "Join Elite Solutions — explore career opportunities where skills are valued, growth is encouraged, and every day makes an impact.",
};

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPublishedPageSeo("/careers");
  return buildMetadataFromSeo(defaults, seo);
}

export default async function CareersPage() {
  const seo = await getPublishedPageSeo("/careers");
  return (
    <>
      <JsonLd data={seo?.json_ld} />
      <CareersStudioPage />
    </>
  );
}
