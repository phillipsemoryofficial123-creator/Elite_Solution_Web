import type { Metadata } from "next";
import { HomeStudioPage } from "@/components/home-studio-page";
import { JsonLd } from "@/components/seo/json-ld";
import { site } from "@/data/site";
import { buildMetadataFromSeo } from "@/lib/seo/build-metadata";
import { getPublishedPageSeo } from "@/lib/seo/get-page-seo";

const defaults: Metadata = {
  title: {
    absolute: `${site.name} | Financial and Non-Financial Services`,
  },
  description: site.tagline,
};

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPublishedPageSeo("/");
  return buildMetadataFromSeo(defaults, seo);
}

export default async function HomePage() {
  const seo = await getPublishedPageSeo("/");
  return (
    <>
      <JsonLd data={seo?.json_ld} />
      <HomeStudioPage />
    </>
  );
}
