import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceSinglePage } from "@/components/service-single-page";
import { JsonLd } from "@/components/seo/json-ld";
import {
  financialServices,
  getServiceInGroup,
} from "@/data/services";
import { buildMetadataFromSeo } from "@/lib/seo/build-metadata";
import { getPublishedPageSeo } from "@/lib/seo/get-page-seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return financialServices.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const found = getServiceInGroup("financial", slug);
  const defaults: Metadata = found
    ? { title: found.service.name, description: found.service.summary }
    : { title: "Service" };
  const seo = await getPublishedPageSeo(`/services/financial/${slug}`);
  return buildMetadataFromSeo(defaults, seo);
}

export default async function FinancialServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const found = getServiceInGroup("financial", slug);
  if (!found) notFound();
  const seo = await getPublishedPageSeo(`/services/financial/${slug}`);
  return (
    <>
      <JsonLd data={seo?.json_ld} />
      <ServiceSinglePage group={found.group} service={found.service} />
    </>
  );
}
