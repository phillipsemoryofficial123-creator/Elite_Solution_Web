"use client";

import Image from "next/image";
import { useState } from "react";
import { TiltCard } from "@/components/interactions";
import { ProjectDetailDialog } from "@/components/portfolio/project-detail-dialog";
import { Reveal } from "@/components/reveal";
import {
  portfolioStudioPage,
  type PortfolioStudioProject,
} from "@/data/portfolio-page";

export function PortfolioStudioPage() {
  const { hero, projects, process } = portfolioStudioPage;
  const [active, setActive] = useState<PortfolioStudioProject | null>(null);

  return (
    <div className="pf-studio">
      <section className="pf-hero">
        <div className="pf-hero-bg" aria-hidden="true">
          <Image
            src={hero.image}
            alt=""
            fill
            priority
            quality={90}
            sizes="100vw"
            className="pf-hero-bg-img"
          />
        </div>
        <div className="w pf-hero-in">
          <div className="pf-hero-copy">
            <Reveal as="p" className="pf-eyebrow">
              {hero.eyebrow}
            </Reveal>
            <Reveal>
              <h1 className="pf-title pf-hero-title">{hero.title}</h1>
            </Reveal>
            <Reveal as="p" className="pf-lead" delay="80ms">
              {hero.lead}
            </Reveal>
          </div>
        </div>
      </section>

      <section className="sec pf-work">
        <div className="w">
          <div className="pf-process-head">
            <Reveal as="p" className="pf-eyebrow">
              Our Clients
            </Reveal>
            <Reveal>
              <h2 className="pf-title">Client Success Stories</h2>
            </Reveal>
          </div>

          <ul className="pf-grid">
              {projects.map((project, i) => (
                <Reveal
                  key={project.id}
                  as="li"
                  className="pf-card-slot"
                  delay={`${Math.min(i * 50, 250)}ms`}
                >
                  <TiltCard className="pf-card">
                    <div className="pf-card-media">
                      <Image
                        src={project.image}
                        alt=""
                        fill
                        sizes="(max-width:900px) 100vw, 33vw"
                        className={`pf-card-img${project.imageFit === "contain" ? " fit-contain" : ""}`}
                      />
                    </div>
                    <h3 className="pf-card-title">{project.title}</h3>
                    <p className="pf-card-body">{project.description}</p>
                    <button
                      type="button"
                      className="pf-card-btn"
                      onClick={() => setActive(project)}
                    >
                      View details
                    </button>
                  </TiltCard>
                </Reveal>
              ))}
          </ul>
        </div>
      </section>

      <section className="sec pf-process">
        <div className="w">
          <div className="pf-process-head">
            <Reveal as="p" className="pf-eyebrow">
              {process.eyebrow}
            </Reveal>
            <Reveal>
              <h2 className="pf-title">{process.title}</h2>
            </Reveal>
            <Reveal as="p" className="pf-lead" delay="60ms">
              {process.lead}
            </Reveal>
          </div>
          <ol className="pf-process-grid">
            {process.steps.map((step, i) => (
              <Reveal
                key={step.num}
                as="li"
                className="pf-process-card"
                delay={`${Math.min(i * 60, 240)}ms`}
              >
                <span className="pf-process-num" aria-hidden="true">
                  {step.num}
                </span>
                <strong>{step.title}</strong>
                <p>{step.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <ProjectDetailDialog project={active} onClose={() => setActive(null)} />
    </div>
  );
}
