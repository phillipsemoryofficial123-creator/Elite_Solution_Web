import type { Metadata } from "next";
import { BlogsStudioPage } from "@/components/blogs-studio-page";
import { JsonLd } from "@/components/seo/json-ld";
import { buildMetadataFromSeo } from "@/lib/seo/build-metadata";
import { getPublishedPageSeo } from "@/lib/seo/get-page-seo";

const defaults: Metadata = {
  title: "Blogs",
  description:
    "Practical insights on accounting, tax, payroll, websites, SEO, and digital marketing from Elite Solutions USA.",
};

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPublishedPageSeo("/blogs");
  return buildMetadataFromSeo(defaults, seo);
}

export default async function BlogsPage() {
  const seo = await getPublishedPageSeo("/blogs");
  return (
    <>
      <JsonLd data={seo?.json_ld} />
      <BlogsStudioPage />
    </>
  );
}
