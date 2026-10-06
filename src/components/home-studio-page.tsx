import Image from "next/image";
import Link from "next/link";
import { HomeFeaturedProjects } from "@/components/home/featured-projects";
import { MagButton, TiltCard } from "@/components/interactions";
import { Reveal } from "@/components/reveal";
import { ServiceGrid } from "@/components/service-card";
import { Typewriter } from "@/components/typewriter";
import { homePage } from "@/data/home-page";
import { servicesHeroWords } from "@/data/site";

export function HomeStudioPage() {
  const { hero, services, about, portfolio, pricing, process, cta } = homePage;

  return (
    <div className="home-studio">
      <section className="home-hero">
        <div className="home-hero-bg" aria-hidden="true">
          <Image
            src={hero.image}
            alt=""
            fill
            priority
            quality={90}
            sizes="100vw"
            className="home-hero-bg-img"
          />
        </div>
        <div className="w home-hero-in">
          <div className="home-hero-copy">
            <p className="home-eyebrow">{hero.eyebrow}</p>
            <h1 className="home-hero-heading">
              <span className="home-hero-line">Empowering Your</span>
              <span className="home-hero-line">{hero.titleLine2}</span>
              <Typewriter words={servicesHeroWords} />
            </h1>
            <p className="home-lead">{hero.lead}</p>
            <div className="home-actions">
              <Link className="btn gold" href={hero.primaryHref}>
                {hero.primaryLabel}
                <span aria-hidden="true"> →</span>
              </Link>
              <Link className="btn ghost" href={hero.secondaryHref}>
                {hero.secondaryLabel}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="sec home-services" id="services">
        <div className="w">
          <div className="home-sec-head">
            <Reveal as="p" className="home-eyebrow">
              {services.eyebrow}
            </Reveal>
            <Reveal>
              <h2 className="home-title">
                {services.titleBefore}{" "}
                <span className="home-accent">{services.titleAccent}</span>
              </h2>
            </Reveal>
            <Reveal as="p" className="home-lead" delay="80ms">
              {services.lead}
            </Reveal>
          </div>

          {services.groups.map((group) => (
            <div key={group.id} className="home-svc-group">
              <Reveal as="p" className="home-svc-label">
                {group.label}
              </Reveal>
              <ServiceGrid items={[...group.items]} showMore={false} />
            </div>
          ))}

          <Reveal className="home-sec-cta">
            <MagButton>
              <Link className="btn gold mag" href={services.ctaHref}>
                {services.ctaLabel}
                <span aria-hidden="true"> →</span>
              </Link>
            </MagButton>
          </Reveal>
        </div>
      </section>

      <section className="sec home-about" id="about">
        <div className="w home-about-grid">
          <Reveal className="home-about-visual" delay="80ms">
            <div className="home-about-frame">
              <Image
                src={about.image}
                alt=""
                fill
                sizes="(max-width:980px) 100vw, 46vw"
                className="home-about-img"
              />
            </div>
          </Reveal>
          <div className="home-about-copy">
            <Reveal as="p" className="home-eyebrow">
              {about.eyebrow}
            </Reveal>
            <Reveal>
              <h2 className="home-title">
                {about.titleBefore}{" "}
                <span className="home-accent">{about.titleAccent}</span>
              </h2>
            </Reveal>
            <Reveal as="p" className="home-lead" delay="80ms">
              {about.lead}
            </Reveal>
            <Reveal className="home-actions" delay="120ms">
              <MagButton>
                <Link className="btn gold mag" href={about.ctaHref}>
                  {about.ctaLabel}
                  <span aria-hidden="true"> →</span>
                </Link>
              </MagButton>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="sec home-portfolio" id="portfolio">
        <div className="w">
          <div className="home-sec-head">
            <Reveal as="p" className="home-eyebrow">
              {portfolio.eyebrow}
            </Reveal>
            <Reveal>
              <h2 className="home-title">
                {portfolio.titleBefore}{" "}
                <span className="home-accent">{portfolio.titleAccent}</span>
              </h2>
            </Reveal>
            <Reveal as="p" className="home-lead" delay="80ms">
              {portfolio.lead}
            </Reveal>
          </div>
          <HomeFeaturedProjects projects={portfolio.projects} />
          <Reveal className="home-sec-cta">
            <MagButton>
              <Link className="btn gold mag" href={portfolio.ctaHref}>
                {portfolio.ctaLabel}
                <span aria-hidden="true"> →</span>
              </Link>
            </MagButton>
          </Reveal>
        </div>
      </section>

      <section className="sec home-pricing" id="pricing">
        <div className="w">
          <div className="home-sec-head">
            <Reveal as="p" className="home-eyebrow">
              {pricing.eyebrow}
            </Reveal>
            <Reveal>
              <h2 className="home-title">
                {pricing.titleBefore}{" "}
                <span className="home-accent">{pricing.titleAccent}</span>
              </h2>
            </Reveal>
            <Reveal as="p" className="home-lead" delay="80ms">
              {pricing.lead}
            </Reveal>
            <Reveal className="home-price-highlights" delay="120ms">
              {pricing.highlights.map((label) => (
                <span key={label} className="home-price-chip">
                  {label}
                </span>
              ))}
            </Reveal>
          </div>
          <ul className="home-price-grid">
            {pricing.cards.map((card, i) => (
              <li key={card.title}>
                <Reveal delay={`${i * 70}ms`}>
                  <Link className="home-price-card" href={card.href}>
                    <strong>{card.title}</strong>
                    <p>{card.body}</p>
                    <span>
                      Learn more
                      <span aria-hidden="true"> →</span>
                    </span>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
          <Reveal className="home-sec-cta">
            <MagButton>
              <Link className="btn gold mag" href={pricing.ctaHref}>
                {pricing.ctaLabel}
                <span aria-hidden="true"> →</span>
              </Link>
            </MagButton>
          </Reveal>
        </div>
      </section>

      <section className="sec home-process">
        <div className="w">
          <div className="home-sec-head">
            <Reveal as="p" className="home-eyebrow">
              {process.eyebrow}
            </Reveal>
            <Reveal>
              <h2 className="home-title">
                {process.titleBefore}{" "}
                <span className="home-accent">{process.titleAccent}</span>
              </h2>
            </Reveal>
          </div>
          <ul className="home-process-grid">
            {process.items.map((item, i) => (
              <Reveal as="li" key={item.num} delay={`${i * 80}ms`}>
                <div className="home-process-card">
                  <span className="home-process-num">{item.num}</span>
                  <strong>{item.title}</strong>
                  <p>{item.body}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="sec home-cta">
        <div className="w">
          <div className="home-cta-panel">
            <div className="home-cta-copy">
              <Reveal as="p" className="home-eyebrow">
                {cta.eyebrow}
              </Reveal>
              <Reveal>
                <h2 className="home-title">
                  {cta.titleBefore}{" "}
                  <span className="home-accent">{cta.titleAccent}</span>
                </h2>
              </Reveal>
              <Reveal as="p" className="home-lead" delay="80ms">
                {cta.lead}
              </Reveal>
              <Reveal className="home-actions" delay="140ms">
                <MagButton>
                  <Link className="btn gold mag" href={cta.primaryHref}>
                    {cta.primaryLabel}
                    <span aria-hidden="true"> →</span>
                  </Link>
                </MagButton>
                <MagButton>
                  <a className="btn ghost mag home-cta-ghost" href={cta.secondaryHref}>
                    {cta.secondaryLabel}
                  </a>
                </MagButton>
              </Reveal>
            </div>
            <Reveal className="home-cta-frame" delay="100ms">
              <Image
                src={cta.image}
                alt=""
                fill
                sizes="(max-width:900px) 100vw, 40vw"
                className="home-cta-img"
              />
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
