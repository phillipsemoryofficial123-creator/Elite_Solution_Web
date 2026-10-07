"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/brand-logo";
import { GetStartedMenu } from "@/components/auth-controls";
import { nav } from "@/data/site";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setShown(window.scrollY > 48);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const links = nav.filter((item) => !item.cta);
  const cta = nav.find((item) => item.cta);

  return (
    <header className={`top${shown || open ? " on" : ""}`} id="top">
      <div className="bar">
        <Link className="brand" href="/" aria-label="Elite Solution home">
          <BrandLogo priority />
        </Link>
        <nav
          className={`nav${open ? " open" : ""}`}
          id="nav"
          aria-label="Main"
        >
          {links.map((item) => {
            if (item.external) {
              return (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {item.label}
                </a>
              );
            }
            const current =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                aria-current={current ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
          {cta ? (
            <GetStartedMenu label={cta.label} className="nav-call-mobile" />
          ) : null}
        </nav>
        <div className="bar-end">
          <button
            className="burger"
            type="button"
            aria-expanded={open}
            aria-controls="nav"
            onClick={() => setOpen((v) => !v)}
          >
            Menu
          </button>
          {cta ? (
            <span className="nav-cta">
              <GetStartedMenu label={cta.label} />
            </span>
          ) : null}
        </div>
      </div>
    </header>
  );
}
