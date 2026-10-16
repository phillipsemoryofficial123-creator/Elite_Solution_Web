"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Reveal } from "@/components/reveal";

export function ServiceNewsletter() {
  const pathname = usePathname();
  if (pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up")) return null;

  return (
    <section className="sec svc-nl">
      <div className="svc-nl-w">
        <Reveal className="svc-nl-panel">
          <div className="svc-nl-glow svc-nl-glow-l" aria-hidden="true" />
          <div className="svc-nl-glow svc-nl-glow-r" aria-hidden="true" />
          <div className="svc-nl-in">
            <div className="svc-nl-copy">
              <p className="svc-nl-eyebrow">Let&apos;s work together</p>
              <h2>Ready to Build Your Next Project?</h2>
              <p className="svc-nl-lead">
                Have an idea? Let&apos;s turn it into a powerful website. Get in
                touch and start your journey with us today.
              </p>
            </div>
            <div className="svc-nl-actions">
              <Link className="svc-nl-btn primary" href="/contact">
                Get a Free Quote
                <span aria-hidden="true">→</span>
              </Link>
              <Link className="svc-nl-btn ghost" href="/contact">
                Contact Us
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
