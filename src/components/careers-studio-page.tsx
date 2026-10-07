"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { MagButton } from "@/components/interactions";
import { Reveal } from "@/components/reveal";
import {
  careersCategories,
  careersPage,
  type CareersCategoryId,
  type CareersValueIcon,
  type CareersWhyIcon,
} from "@/data/careers-page";

const svgCommon = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true as const,
};

function ValueIcon({ name }: { name: CareersValueIcon }) {
  switch (name) {
    case "culture":
      return (
        <svg {...svgCommon}>
          <path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.5-7 10-7 10z" />
        </svg>
      );
    case "growth":
      return (
        <svg {...svgCommon}>
          <path d="M3 17l6-6 4 4 7-7" />
          <path d="M14 8h6v6" />
        </svg>
      );
  }
}

function WhyIcon({ name }: { name: CareersWhyIcon }) {
  switch (name) {
    case "salary":
      return (
        <svg {...svgCommon}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v10M9.5 9.5c.6-1 1.5-1.5 2.5-1.5 1.4 0 2.5.9 2.5 2s-1.1 2-2.5 2h-1c-1.4 0-2.5.9-2.5 2s1.1 2 2.5 2c1 0 1.9-.5 2.5-1.5" />
        </svg>
      );
    case "career":
      return (
        <svg {...svgCommon}>
          <path d="M4 19V9l8-5 8 5v10" />
          <path d="M9 19v-6h6v6" />
        </svg>
      );
    case "tools":
      return (
        <svg {...svgCommon}>
          <path d="M14.7 6.3a4 4 0 0 0-5.6 5.6L3 18l3 3 6.1-6.1a4 4 0 0 0 5.6-5.6l-2.5 2.5-2.5-2.5 2.5-2.5z" />
        </svg>
      );
    case "balance":
      return (
        <svg {...svgCommon}>
          <path d="M12 3v18" />
          <path d="M5 8h14" />
          <path d="M6 8l-3 7h6l-3-7z" />
          <path d="M18 8l-3 7h6l-3-7z" />
        </svg>
      );
    case "learning":
      return (
        <svg {...svgCommon}>
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      );
    case "team":
      return (
        <svg {...svgCommon}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
  }
}

function JobIcon() {
  return (
    <svg {...svgCommon}>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg {...svgCommon} strokeWidth={1.8}>
      <path d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

export function CareersStudioPage() {
  const { hero, openings, why } = careersPage;
  const [cat, setCat] = useState<CareersCategoryId>("all");

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: openings.jobs.length };
    for (const c of careersCategories) {
      if (c.id === "all") continue;
      map[c.id] = openings.jobs.filter((j) => j.category === c.id).length;
    }
    return map;
  }, [openings.jobs]);

  const filtered = useMemo(() => {
    if (cat === "all") return openings.jobs;
    return openings.jobs.filter((j) => j.category === cat);
  }, [cat, openings.jobs]);

  return (
    <div className="careers-studio">
      <section className="careers-hero">
        <div className="careers-hero-bg" aria-hidden="true">
          <Image
            src={hero.image}
            alt=""
            fill
            priority
            quality={90}
            sizes="100vw"
            className="careers-hero-bg-img"
          />
        </div>
        <div className="w careers-hero-in">
          <div className="careers-hero-copy">
            <Reveal as="p" className="careers-eyebrow">
              {hero.eyebrow}
            </Reveal>
            <Reveal>
              <h1 className="careers-title careers-hero-title">
                {hero.titleBefore}{" "}
                <span className="careers-accent">{hero.titleAccent}</span>
              </h1>
            </Reveal>
            <Reveal as="p" className="careers-lead" delay="80ms">
              {hero.lead}
            </Reveal>
            <Reveal className="careers-values" delay="140ms">
              {hero.values.map((item) => (
                <div key={item.title} className="careers-value">
                  <span className="careers-value-ic" aria-hidden="true">
                    <ValueIcon name={item.icon} />
                  </span>
                  <div>
                    <strong>{item.title}</strong>
                    <span>{item.body}</span>
                  </div>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      <section className="sec careers-openings" id="openings">
        <div className="w">
          <div className="careers-openings-head">
            <div>
              <Reveal as="p" className="careers-eyebrow">
                {openings.eyebrow}
              </Reveal>
              <Reveal>
                <h2 className="careers-title">{openings.title}</h2>
              </Reveal>
              <Reveal as="p" className="careers-lead" delay="60ms">
                {openings.lead}
              </Reveal>
            </div>
            <Reveal delay="100ms">
              <span className="careers-count-pill">
                {
                  openings.jobs.filter((j) => j.status === "open").length
                }{" "}
                Open Positions
              </span>
            </Reveal>
          </div>

          <div className="careers-openings-grid">
            <aside className="careers-cats" aria-label="Job categories">
              {careersCategories.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`careers-cat${cat === item.id ? " on" : ""}`}
                  aria-pressed={cat === item.id}
                  onClick={() => setCat(item.id)}
                >
                  <span>{item.label}</span>
                  <span className="careers-cat-count">{counts[item.id] ?? 0}</span>
                </button>
              ))}
            </aside>

            <ul className="careers-jobs">
              {filtered.length === 0 ? (
                <li className="careers-jobs-empty">
                  <h3>No openings in this category</h3>
                  <p>Check back soon or browse all positions.</p>
                </li>
              ) : (
                filtered.map((job, i) => (
                  <Reveal
                    key={job.id}
                    as="li"
                    className={`careers-job${job.status === "closed" ? " closed" : ""}`}
                    delay={`${Math.min(i * 50, 250)}ms`}
                  >
                    <span className="careers-job-ic" aria-hidden="true">
                      <JobIcon />
                    </span>
                    <div className="careers-job-copy">
                      <div className="careers-job-title-row">
                        <strong>{job.title}</strong>
                        <span
                          className={`careers-status ${job.status}`}
                        >
                          {job.status === "open" ? "Open" : "Closed"}
                        </span>
                      </div>
                      <div className="careers-job-meta">
                        <span className="careers-tag">{job.type}</span>
                        <span className="careers-tag">{job.mode}</span>
                        {job.salary ? (
                          <span className="careers-tag">💰 {job.salary}</span>
                        ) : null}
                        <span className="careers-loc">
                          <PinIcon />
                          {job.location}
                        </span>
                      </div>
                      <p className="careers-job-desc">{job.description}</p>
                    </div>
                    <MagButton>
                      <Link
                        className={`btn mag careers-job-cta${job.status === "open" ? " gold" : " ghost"}`}
                        href={job.href}
                      >
                        {job.status === "open" ? "Apply Now" : "View Details"}
                        <span aria-hidden="true"> →</span>
                      </Link>
                    </MagButton>
                  </Reveal>
                ))
              )}
            </ul>
          </div>
        </div>
      </section>

      <section className="sec careers-why">
        <div className="w careers-why-grid">
          <div className="careers-why-copy">
            <Reveal as="p" className="careers-eyebrow">
              {why.eyebrow}
            </Reveal>
            <Reveal>
              <h2 className="careers-title">
                {why.titleBefore}{" "}
                <span className="careers-accent">{why.titleAccent}</span>
              </h2>
            </Reveal>
            <Reveal as="p" className="careers-lead" delay="80ms">
              {why.lead}
            </Reveal>
            <Reveal className="careers-actions" delay="140ms">
              <MagButton>
                <Link className="btn gold mag" href={why.ctaHref}>
                  {why.ctaLabel}
                  <span aria-hidden="true"> →</span>
                </Link>
              </MagButton>
            </Reveal>
          </div>
          <ul className="careers-why-cards">
            {why.cards.map((card, i) => (
              <Reveal
                key={card.title}
                as="li"
                className="careers-why-card"
                delay={`${Math.min(i * 50, 250)}ms`}
              >
                <span className="careers-why-ic" aria-hidden="true">
                  <WhyIcon name={card.icon} />
                </span>
                <strong>{card.title}</strong>
                <p>{card.body}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
