import Image from "next/image";
import { Reveal } from "@/components/reveal";
import { GraphicDesignPage } from "@/components/graphic-design-page";
import { ServiceDetailHero } from "@/components/service-detail-hero";
import { ServiceStack } from "@/components/service-stack";
import { ServiceZigzag } from "@/components/service-zigzag";
import { getServiceDetail } from "@/data/service-details";
import {
  serviceGroupHref,
  type Service,
  type ServiceGroupMeta,
} from "@/data/services";

export function ServiceSinglePage({
  group,
  service,
}: {
  group: ServiceGroupMeta;
  service: Service;
}) {
  const detail = getServiceDetail(service.slug);
  const pageBg = detail?.pageBg;
  const isNonFin = group.id === "non";

  if (service.slug === "graphic-designing") {
    return <GraphicDesignPage />;
  }

  const content = (
    <>
      <ServiceDetailHero
        title={detail?.pageTitle ?? service.name}
        subtitle={detail?.intro[0] ?? service.summary}
        imageSrc={
          detail?.heroBg !== undefined
            ? detail.heroBg || undefined
            : service.image
        }
        groupLabel={group.shortName}
        groupHref={serviceGroupHref(group)}
        {...(service.slug === "web-development" ||
        service.slug === "marketing-strategies" ||
        service.slug === "seo-services" ||
        service.slug === "email-marketing" ||
        service.slug === "help-line-services"
          ? {
              primaryCta: {
                label: "Get Started",
                href: "/contact",
                variant: "gold" as const,
                arrow: true,
              },
              secondaryCta: {
                label: "See client results",
                href: "/portfolio",
                variant: "ghost" as const,
              },
            }
          : null)}
      />

      {detail ? (
        isNonFin ? (
          <>
            <div className="sec svc-pro-head">
              <div className="w">
                <Reveal as="p" className="svc-pro-eyebrow">
                  Service overview
                </Reveal>
                <Reveal as="h2">What we deliver</Reveal>
                <Reveal as="p" className="sub svc-pro-lead">
                  {detail.offerLead ??
                    `Explore the ${service.name.toLowerCase()} work we deliver — clear process, strong craft, and support that helps your brand grow.`}
                </Reveal>
              </div>
            </div>
            <ServiceStack detail={detail} />
          </>
        ) : (
          <>
            <div className="sec svc-offer-head">
              <div className="w">
                <Reveal as="h2">What We Offer</Reveal>
                <Reveal as="p" className="sub svc-offer-lead">
                  {detail.offerLead ??
                    `Explore the ${service.name.toLowerCase()} services we deliver for growing businesses — clear process, careful compliance, and support that frees you to focus on what matters.`}
                </Reveal>
              </div>
            </div>
            <ServiceZigzag detail={detail} />
          </>
        )
      ) : (
        <div className="sec svc-simple-sec">
          <div className="w">
            <Reveal className="svc-detail-card svc-simple-card">
              <div className="svc-simple-grid">
                <div className="svc-simple-copy">
                  <h2>{service.name}</h2>
                  <p className="svc-detail-summary">{service.summary}</p>
                  <div className="svc-detail-cols">
                    <div>
                      <h4>Includes</h4>
                      <ul>
                        {service.includes.map((line) => (
                          <li key={line}>{line}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4>You get</h4>
                      <ul>
                        {service.outcomes.map((line) => (
                          <li key={line}>{line}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="svc-simple-media">
                  <Image
                    src={service.image}
                    alt=""
                    fill
                    sizes="(max-width:900px) 100vw, 42vw"
                    className="svc-simple-img"
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      )}

    </>
  );

  if (pageBg) {
    return (
      <div className="svc-page-bg">
        <div className="svc-page-bg-layer" aria-hidden="true">
          <Image
            src={pageBg}
            alt=""
            fill
            priority
            quality={100}
            sizes="100vw"
            className="svc-page-bg-img"
          />
        </div>
        <div className="svc-page-bg-content">{content}</div>
      </div>
    );
  }

  return <div className="svc-detail-page">{content}</div>;
}
