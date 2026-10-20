import type { Metadata } from "next";
import { CsrStudioPage } from "@/components/csr-studio-page";
import { JsonLd } from "@/components/seo/json-ld";
import { buildMetadataFromSeo } from "@/lib/seo/build-metadata";
import { getPublishedPageSeo } from "@/lib/seo/get-page-seo";

const defaults: Metadata = {
  title: "CSR",
  description:
    "Free Elite Solutions tools to build a professional resume and improve your website's search visibility.",
};

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPublishedPageSeo("/csr");
  return buildMetadataFromSeo(defaults, seo);
}

export default async function CsrPage() {
  const seo = await getPublishedPageSeo("/csr");
  return (
    <>
      <JsonLd data={seo?.json_ld} />
      <CsrStudioPage />
    </>
  );
}
