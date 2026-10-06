"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { PortfolioStudioProject } from "@/data/portfolio-page";

export function ProjectDetailDialog({
  project,
  onClose,
}: {
  project: PortfolioStudioProject | null;
  onClose: () => void;
}) {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!project) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCloseRef.current();
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [project]);

  if (!project) return null;

  return (
    <div
      className="pf-detail"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pf-detail-title"
      onClick={() => onCloseRef.current()}
    >
      <article
        className="pf-card pf-detail-card"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="pf-card-media">
          <Image
            src={project.image}
            alt=""
            fill
            sizes="640px"
            className={`pf-card-img${project.imageFit === "contain" ? " fit-contain" : ""}`}
          />
        </div>
        <h3 id="pf-detail-title" className="pf-card-title">
          {project.title}
        </h3>
        <div className="pf-detail-copy">
          {project.details ? (
            <>
              <p>{project.details.intro}</p>
              {project.details.sections.map((section) => (
                <section key={section.heading}>
                  <h4>{section.heading}</h4>
                  {section.paragraphs?.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  {section.items?.map((item) => (
                    <p key={item.label}>
                      <strong>{item.label}: </strong>
                      {item.text}
                    </p>
                  ))}
                </section>
              ))}
            </>
          ) : (
            <p>{project.description}</p>
          )}
        </div>
        <button type="button" className="pf-card-btn" onClick={() => onCloseRef.current()}>
          Close
        </button>
      </article>
    </div>
  );
}
