"use client";

import Image from "next/image";
import { useState } from "react";
import { TiltCard } from "@/components/interactions";
import { ProjectDetailDialog } from "@/components/portfolio/project-detail-dialog";
import { Reveal } from "@/components/reveal";
import type { PortfolioStudioProject } from "@/data/portfolio-page";

export function HomeFeaturedProjects({
  projects,
}: {
  projects: readonly PortfolioStudioProject[];
}) {
  const [active, setActive] = useState<PortfolioStudioProject | null>(null);

  return (
    <>
      <ul className="home-pf-grid">
        {projects.map((project, i) => (
          <li key={project.id}>
            <Reveal delay={`${i * 70}ms`}>
              <TiltCard className="home-pf-card">
                <div className="home-pf-card-link">
                  <div className="home-pf-media">
                    <Image
                      src={project.image}
                      alt=""
                      fill
                      sizes="(max-width:900px) 100vw, 33vw"
                      className="home-pf-img"
                    />
                  </div>
                  <strong className="home-pf-title">{project.title}</strong>
                  <p className="home-pf-body">{project.description}</p>
                  <button
                    type="button"
                    className="home-pf-link"
                    onClick={() => setActive(project)}
                  >
                    View project
                    <span aria-hidden="true"> →</span>
                  </button>
                </div>
              </TiltCard>
            </Reveal>
          </li>
        ))}
      </ul>
      <ProjectDetailDialog project={active} onClose={() => setActive(null)} />
    </>
  );
}
