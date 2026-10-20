import type { Metadata } from "next";
import Link from "next/link";
import { MagButton } from "@/components/interactions";
import { ServicesHero } from "@/components/services-hero";
import { ServiceGrid } from "@/components/service-card";
import { Reveal } from "@/components/reveal";
import { JsonLd } from "@/components/seo/json-ld";
import {
  financialServices,
  nonFinancialServices,
} from "@/data/services";
import { buildMetadataFromSeo } from "@/lib/seo/build-metadata";
import { getPublishedPageSeo } from "@/lib/seo/get-page-seo";

const defaults: Metadata = {
  title: "Services",
  description:
    "Financial and non-financial services handled by one team — accounting, tax, payroll, CFO, web, design, marketing and SEO.",
};

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPublishedPageSeo("/services");
  return buildMetadataFromSeo(defaults, seo);
}

export default async function ServicesPage() {
  const seo = await getPublishedPageSeo("/services");

  return (
    <>
      <JsonLd data={seo?.json_ld} />
      <ServicesHero />

      <div className="sec services-block" id="financial">
        <div className="w">
          <h2 className="services-block-title">Financial services</h2>
          <p className="sub">
            The numbers side — accurate books, tax, payroll and senior finance
            guidance.
          </p>
          <ServiceGrid items={financialServices} columns={3} />
        </div>
      </div>

      <div className="sec alt services-block" id="non-financial">
        <div className="w">
          <h2 className="services-block-title">Non-financial services</h2>
          <p className="sub">
            The brand and marketing side — websites, design, SEO and campaigns
            that bring customers in.
          </p>
          <ServiceGrid items={nonFinancialServices} columns={3} />
        </div>
      </div>

      <div className="sec services-cta">
        <div className="w services-cta-in">
          <Reveal as="h2">Not sure where to start?</Reveal>
          <Reveal as="p" className="sub">
            Tell us what you need. We reply with a clear plan and a quote.
          </Reveal>
          <Reveal className="btns">
            <MagButton>
              <Link className="btn gold mag" href="/contact">
                Book a free consultation
              </Link>
            </MagButton>
            <MagButton>
              <Link className="btn blue mag" href="/portfolio">
                See our work
              </Link>
            </MagButton>
          </Reveal>
        </div>
      </div>
    </>
  );
}
