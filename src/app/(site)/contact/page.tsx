import type { Metadata } from "next";
import { ContactStudioPage } from "@/components/contact-studio-page";
import { JsonLd } from "@/components/seo/json-ld";
import { buildMetadataFromSeo } from "@/lib/seo/build-metadata";
import { getPublishedPageSeo } from "@/lib/seo/get-page-seo";

const defaults: Metadata = {
  title: "Contact Us",
  description:
    "Book a free consultation with Elite Solutions USA. Tell us what you need and we will reply with a plan and a quote.",
};

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPublishedPageSeo("/contact");
  return buildMetadataFromSeo(defaults, seo);
}

export default async function ContactPage() {
  const seo = await getPublishedPageSeo("/contact");
  return (
    <>
      <JsonLd data={seo?.json_ld} />
      <ContactStudioPage />
    </>
  );
}
