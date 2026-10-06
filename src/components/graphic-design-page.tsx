import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { MagButton } from "@/components/interactions";
import {
  graphicDesignPage,
  type GraphicProcessIcon,
  type GraphicServiceIcon,
} from "@/data/graphic-design-page";

function ServiceIcon({ name }: { name: GraphicServiceIcon }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };

  switch (name) {
    case "logo":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
          <path d="M8 12h8" />
          <path d="M12 8v8" />
        </svg>
      );
    case "social":
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="16" rx="3" />
          <path d="M8 10h.01" />
          <path d="M12 10h.01" />
          <path d="M16 10h.01" />
          <path d="M8 14h8" />
        </svg>
      );
    case "brand":
      return (
        <svg {...common}>
          <path d="M4 20V8l8-4 8 4v12" />
          <path d="M4 12h16" />
          <path d="M12 4v16" />
        </svg>
      );
    case "packaging":
      return (
        <svg {...common}>
          <path d="M3 8.5 12 4l9 4.5v7L12 20l-9-4.5v-7z" />
          <path d="M12 20V11" />
          <path d="M3 8.5 12 13l9-4.5" />
        </svg>
      );
    case "print":
      return (
        <svg {...common}>
          <path d="M6 9V3h12v6" />
          <path d="M6 17H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2" />
          <rect x="6" y="13" width="12" height="8" rx="1" />
        </svg>
      );
    case "marketing":
      return (
        <svg {...common}>
          <path d="M3 11v2a2 2 0 0 0 2 2h2l5 4V5L7 9H5a2 2 0 0 0-2 2z" />
          <path d="M16 9.5a3.5 3.5 0 0 1 0 5" />
          <path d="M18.5 7a6.5 6.5 0 0 1 0 10" />
        </svg>
      );
  }
}

function ProcessIcon({ name }: { name: GraphicProcessIcon }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };

  switch (name) {
    case "discuss":
      return (
        <svg {...common}>
          <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5z" />
        </svg>
      );
    case "design":
      return (
        <svg {...common}>
          <path d="m12 12 7-7" />
          <path d="M5 19l4.2-1.2a2 2 0 0 0 .9-.5L17 10a2.1 2.1 0 0 0-3-3l-7.3 7a2 2 0 0 0-.5.9L5 19z" />
        </svg>
      );
    case "review":
      return (
        <svg {...common}>
          <path d="M9 11 5.5 14.5 3 12" />
          <path d="M21 12a9 9 0 1 1-3-6.7" />
          <path d="M21 4v5h-5" />
        </svg>
      );
    case "deliver":
      return (
        <svg {...common}>
          <path d="M12 3v12" />
          <path d="m7 10 5 5 5-5" />
          <path d="M5 21h14" />
        </svg>
      );
  }
}

function GradientTitle({
  before,
  accent,
  as: Tag = "h2",
}: {
  before: string;
  accent: string;
  as?: "h1" | "h2";
}) {
  return (
    <Tag className="gfx-title">
      {before} <span className="gfx-title-accent">{accent}</span>
    </Tag>
  );
}

export function GraphicDesignPage() {
  const { hero, services, process } = graphicDesignPage;

  return (
    <div className="gfx-studio">
      <section className="gfx-hero">
        <div className="gfx-hero-bg" aria-hidden="true">
          <Image
            src={hero.visual}
            alt=""
            fill
            priority
            sizes="100vw"
            className="gfx-hero-bg-img"
          />
        </div>
        <div className="w gfx-hero-in">
          <div className="gfx-hero-copy">
            <Reveal>
              <h1 className="gfx-title gfx-hero-title">
                {hero.titleBefore}{" "}
                <span className="gfx-title-sky">{hero.titleSky}</span>{" "}
                <span className="gfx-title-gold">{hero.titleGold}</span>
              </h1>
            </Reveal>
            <Reveal as="p" className="gfx-hero-lead" delay="80ms">
              {hero.lead}
            </Reveal>
            <Reveal className="gfx-hero-actions" delay="140ms">
              <MagButton>
                <Link className="btn gold mag" href={hero.primaryCta.href}>
                  {hero.primaryCta.label}
                  <span aria-hidden="true"> →</span>
                </Link>
              </MagButton>
              <MagButton>
                <Link className="btn ghost mag gfx-hero-ghost" href={hero.secondaryCta.href}>
                  {hero.secondaryCta.label}
                </Link>
              </MagButton>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="sec gfx-services">
        <div className="w">
          <Reveal className="gfx-sec-head">
            <GradientTitle
              before={services.titleBefore}
              accent={services.titleAccent}
            />
          </Reveal>
          <ul className="gfx-services-grid">
            {services.items.map((item, i) => (
              <Reveal
                key={item.title}
                as="li"
                className="gfx-service-card"
                delay={`${Math.min(i * 60, 240)}ms`}
              >
                <span className="gfx-service-ic" aria-hidden="true">
                  <ServiceIcon name={item.icon} />
                </span>
                <strong>{item.title}</strong>
                <p>{item.body}</p>
                <span className="gfx-service-arrow" aria-hidden="true">
                  →
                </span>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="sec gfx-process">
        <div className="w">
          <Reveal className="gfx-sec-head">
            <GradientTitle
              before={process.titleBefore}
              accent={process.titleAccent}
            />
          </Reveal>
          <ol className="gfx-process-track">
            {process.steps.map((step, i) => (
              <Reveal
                key={step.title}
                as="li"
                className="gfx-process-card"
                delay={`${Math.min(i * 60, 240)}ms`}
              >
                <span className="gfx-process-num" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="gfx-process-ic" aria-hidden="true">
                  <ProcessIcon name={step.icon} />
                </span>
                <strong>{step.title}</strong>
                <p>{step.body}</p>
                {i < process.steps.length - 1 ? (
                  <span className="gfx-process-arrow" aria-hidden="true">
                    →
                  </span>
                ) : null}
              </Reveal>
            ))}
          </ol>
          <Reveal className="gfx-process-cta-wrap" delay="180ms">
            <MagButton>
              <Link className="btn gold mag" href={process.ctaHref}>
                {process.ctaLabel}
                <span aria-hidden="true"> →</span>
              </Link>
            </MagButton>
          </Reveal>
        </div>
      </section>

    </div>
  );
}
