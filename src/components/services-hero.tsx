"use client";

import Image from "next/image";
import { SpotSurface } from "@/components/interactions";
import { Typewriter } from "@/components/typewriter";
import { servicesHeroWords, site } from "@/data/site";

export function ServicesHero() {
  return (
    <SpotSurface className="dk phero services-hero">
      <div className="services-hero-bg" aria-hidden="true">
        <Image
          src="/images/hero-bg-services.jpg"
          alt=""
          fill
          priority
          quality={100}
          sizes="100vw"
          className="services-hero-bg-img"
        />
      </div>
      <div className="orbw" aria-hidden="true">
        <div className="orb o1" />
        <div className="orb o2" />
      </div>
      <div className="w services-hero-in">
        <div className="services-hero-copy">
          <h1 className="enter page-enter">
            <span className="services-hero-lead">
              Services for every stage of your
            </span>
            <Typewriter words={servicesHeroWords} />
          </h1>
          <p className="enter e2 page-enter">{site.tagline}</p>
          <div className="services-hero-ctas enter e3 page-enter">
            <a className="services-hero-cta" href="/services#financial">
              Financial
            </a>
            <a className="services-hero-cta" href="/services#non-financial">
              Non-financial
            </a>
          </div>
        </div>
      </div>
    </SpotSurface>
  );
}
