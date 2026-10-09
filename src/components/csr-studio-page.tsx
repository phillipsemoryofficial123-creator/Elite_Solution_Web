import Image from "next/image";
import { MagButton } from "@/components/interactions";
import { Reveal } from "@/components/reveal";
import { csrPage, type CsrToolId } from "@/data/csr-page";

const svgCommon = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true as const,
};

function ToolIcon({ id }: { id: CsrToolId }) {
  if (id === "resume") {
    return (
      <svg {...svgCommon}>
        <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
        <path d="M14 3v5h5" />
        <path d="M8 13h8" />
        <path d="M8 17h5" />
      </svg>
    );
  }

  return (
    <svg {...svgCommon}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16.5 20.5 21" />
      <path d="M8.5 11h5" />
      <path d="M11 8.5v5" />
    </svg>
  );
}

function FeatureCheck() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" aria-hidden="true">
      <path d="M5.2 12.4 9.6 16.6 18.8 7.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CsrStudioPage() {
  const { hero, tools, details, close } = csrPage;

  return (
    <div className="csr-studio">
      <section className="csr-hero">
        <div className="csr-hero-bg" aria-hidden="true">
          <Image
            src={hero.image}
            alt=""
            fill
            priority
            quality={90}
            sizes="100vw"
            className="csr-hero-bg-img"
          />
        </div>
        <div className="w csr-hero-in">
          <div className="csr-hero-copy">
            <Reveal as="p" className="csr-eyebrow">
              {hero.eyebrow}
            </Reveal>
            <Reveal>
              <h1 className="csr-title csr-hero-title">
                {hero.titleBefore}{" "}
                <span className="csr-accent">{hero.titleAccent}</span>
              </h1>
            </Reveal>
            <Reveal as="p" className="csr-lead" delay="80ms">
              {hero.lead}
            </Reveal>
            <Reveal className="csr-highlights" delay="140ms">
              {tools.map((tool) => (
                <a key={tool.id} className="csr-highlight" href={`#${tool.id}`}>
                  <span className="csr-highlight-ic" aria-hidden="true">
                    <ToolIcon id={tool.id} />
                  </span>
                  <span>{tool.name}</span>
                </a>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      {details.map((detail) => {
        const tool = tools.find((item) => item.id === detail.id);
        return (
          <section
            key={detail.id}
            className="sec csr-detail"
            id={detail.id}
          >
            <div className="w csr-detail-grid">
              <div className="csr-detail-copy">
                <Reveal as="p" className="csr-eyebrow">
                  {detail.eyebrow}
                </Reveal>
                <Reveal>
                  <h2 className="csr-title">
                    {detail.titleBefore}{" "}
                    <span className="csr-accent">{detail.titleAccent}</span>
                  </h2>
                </Reveal>
                <Reveal as="p" className="csr-detail-body" delay="60ms">
                  {detail.body}
                </Reveal>
                <Reveal as="p" className="csr-detail-close" delay="100ms">
                  {detail.close}
                </Reveal>
                {tool ? (
                  <Reveal className="csr-detail-actions" delay="140ms">
                    <MagButton>
                      <a
                        className="btn gold mag"
                        href={tool.href}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {tool.cta}
                        <span aria-hidden="true"> →</span>
                      </a>
                    </MagButton>
                  </Reveal>
                ) : null}
              </div>
              <Reveal className="csr-feature-panel" delay="80ms">
                <h3>{detail.featuresLabel}</h3>
                <ul className="csr-features">
                  {detail.features.map((feature) => (
                    <li key={feature}>
                      <span className="csr-feature-check">
                        <FeatureCheck />
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </section>
        );
      })}

      <section className="sec csr-close">
        <div className="w">
          <div className="csr-sec-head">
            <Reveal>
              <h2 className="csr-title">
                {close.titleBefore}{" "}
                <span className="csr-accent">{close.titleAccent}</span>
              </h2>
            </Reveal>
            <Reveal as="p" className="csr-lead" delay="60ms">
              {close.body}
            </Reveal>
            <Reveal as="p" className="csr-close-line" delay="120ms">
              {close.line}
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
