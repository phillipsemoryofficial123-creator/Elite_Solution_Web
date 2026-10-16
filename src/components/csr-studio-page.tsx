import Image from "next/image";
import { MagButton } from "@/components/interactions";
import { Reveal } from "@/components/reveal";
import { csrPage } from "@/data/csr-page";

function FeatureCheck() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" aria-hidden="true">
      <path d="M5.2 12.4 9.6 16.6 18.8 7.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CsrStudioPage() {
  const { hero, story, tools, details, close } = csrPage;

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
                <span>{hero.titleBefore}</span>
                <span className="csr-accent">{hero.titleAccent}</span>
              </h1>
            </Reveal>
            <Reveal as="p" className="csr-lead" delay="80ms">
              {hero.lead}
            </Reveal>
            <Reveal className="csr-highlights" delay="140ms">
              {tools.map((tool) => (
                <MagButton key={tool.id}>
                  <a className="btn mag gold" href={`#${tool.id}`}>
                    {tool.name}
                    <span aria-hidden="true"> →</span>
                  </a>
                </MagButton>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      <section className="sec csr-story">
        <div className="w">
          <div className="csr-intro">
            {story.sections.map((section, index) => (
              <Reveal
                key={section.title}
                className="csr-story-block"
                delay={`${index * 60}ms`}
              >
                <h3>{section.title}</h3>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </Reveal>
            ))}
          </div>
          <div className="csr-commit">
            <Reveal className="csr-commit-title">
              <h3>{story.commitmentTitle}</h3>
            </Reveal>
            {story.commitments.map((item, index) => {
              const action = story.actions[index];
              const featureId = index === 0 ? "resume" : index === 1 ? "seo" : null;
              const features = featureId ? details.find((detail) => detail.id === featureId) : null;
              return (
                <Reveal
                  key={item.title}
                  className={`csr-story-item${features ? " has-features" : ""}`}
                  delay={`${index * 60}ms`}
                >
                  <div id={featureId ?? undefined}>
                    <h4>{item.title}</h4>
                    {item.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                    {action ? (
                      <div className="csr-story-actions">
                        <MagButton>
                          <a
                            className="btn mag gold"
                            href={action.href}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {action.label}
                            <span aria-hidden="true"> →</span>
                          </a>
                        </MagButton>
                      </div>
                    ) : null}
                  </div>
                  {features ? (
                    <div className="csr-feature-panel">
                      <h3>{features.featuresLabel}</h3>
                      <ul className="csr-features">
                        {features.features.map((feature) => (
                          <li key={feature}>
                            <span className="csr-feature-check">
                              <FeatureCheck />
                            </span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

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
