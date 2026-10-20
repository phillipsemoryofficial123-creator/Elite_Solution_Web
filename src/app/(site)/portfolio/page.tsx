import type { Metadata } from "next";
import { PortfolioStudioPage } from "@/components/portfolio/portfolio-studio-page";
import { JsonLd } from "@/components/seo/json-ld";
import { buildMetadataFromSeo } from "@/lib/seo/build-metadata";
import { getPublishedPageSeo } from "@/lib/seo/get-page-seo";

const defaults: Metadata = {
  title: "Portfolio",
  description:
    "Explore recent Elite Solutions USA projects across web development, apps, UI/UX, e-commerce, and branding.",
};

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPublishedPageSeo("/portfolio");
  return buildMetadataFromSeo(defaults, seo);
}

export default async function PortfolioPage() {
  const seo = await getPublishedPageSeo("/portfolio");
  return (
    <>
      <JsonLd data={seo?.json_ld} />
      <PortfolioStudioPage />
    </>
  );
}
