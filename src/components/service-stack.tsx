import Image from "next/image";
import Link from "next/link";
import { MagButton } from "@/components/interactions";
import { Reveal } from "@/components/reveal";
import { ServiceFeatureGrid } from "@/components/service-feature-grid";
import { ServiceProcess } from "@/components/service-process";
import { ServiceSteps } from "@/components/service-steps";
import type { ServiceDetailContent } from "@/data/service-details";

export function ServiceStack({ detail }: { detail: ServiceDetailContent }) {
  const bodyIntro = detail.intro.slice(1);

  return (
    <div className="svc-pro">
      {bodyIntro.length > 0 ? (
        <div className="sec svc-pro-intro-sec">
          <div className="w svc-pro-intro">
            {bodyIntro.map((p) => (
              <Reveal as="p" key={p.slice(0, 48)}>
                {p}
              </Reveal>
            ))}
          </div>
        </div>
      ) : null}

      <div className="w svc-pro-list">
        {detail.sections
          .filter((section) => !section.projects?.length)
          .map((section, i) => {
          const hasSteps = Boolean(section.steps?.length);
          const hasSpecialties = Boolean(section.specialties?.length);
          const hasFeatures = Boolean(section.features?.length);
          const hasProcess = Boolean(section.process?.length);

          if (hasProcess) {
            return (
              <Reveal
                key={section.heading}
                className="svc-pro-section has-process"
                delay={`${Math.min(i * 50, 200)}ms`}
              >
                <ServiceProcess
                  eyebrow={section.eyebrow}
                  heading={section.heading}
                  lead={section.paragraphs[0] ?? ""}
                  ctaLabel={section.ctaLabel}
                  ctaHref={section.ctaHref}
                  steps={section.process!}
                />
              </Reveal>
            );
          }

          return (
            <Reveal
              key={section.heading}
              className={`svc-pro-section${section.image ? " has-media" : ""}${hasSteps ? " has-steps" : ""}${hasSpecialties ? " has-caps" : ""}${hasFeatures ? " has-features" : ""}`}
              delay={`${Math.min(i * 50, 200)}ms`}
            >
              <div className="svc-pro-content">
                {section.eyebrow ? (
                  <p className="svc-pro-section-eyebrow">{section.eyebrow}</p>
                ) : null}
                <h3>{section.heading}</h3>
                {section.paragraphs.map((p) => (
                  <p key={p.slice(0, 40)}>{p}</p>
                ))}
                {section.image ? (
                  <div className="svc-pro-intro-cta">
                    <MagButton>
                      <Link className="btn gold mag" href="/contact">
                        Get Started
                        <span aria-hidden="true"> →</span>
                      </Link>
                    </MagButton>
                  </div>
                ) : null}
                {hasSteps ? <ServiceSteps steps={section.steps!} /> : null}
                {hasFeatures ? (
                  <ServiceFeatureGrid features={section.features!} />
                ) : null}
                {hasSpecialties ? (
                  <ul className="svc-pro-caps">
                    {section.specialties!.map((item) => (
                      <li key={item.title} className="svc-pro-cap">
                        <strong>{item.title}</strong>
                        <p>{item.body}</p>
                      </li>
                    ))}
                  </ul>
                ) : null}
                {!hasSteps &&
                !hasSpecialties &&
                !hasFeatures &&
                section.bullets?.length ? (
                  <ul>
                    {section.bullets.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
              {section.image ? (
                <div className="svc-pro-media">
                  <Image
                    src={section.image}
                    alt=""
                    fill
                    sizes="(max-width:900px) 100vw, 52vw"
                    className="svc-pro-img"
                    priority={i === 0}
                  />
                </div>
              ) : null}
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
