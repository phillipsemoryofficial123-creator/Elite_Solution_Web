"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export function PageLoader() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setShow(false);
      return;
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => {
      document.body.style.overflow = previousOverflow;
      setShow(false);
    }, 3400);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  if (!show) return null;

  return (
    <div className="loader" role="status" aria-label="Loading Elite Solutions USA">
      <div className="loader-in">
        <p className="loader-kicker">Elite Solutions USA</p>
        <div className="loader-mark">
          <span className="loader-glow" />
          <div className="loader-plate">
            <Image
              src="/images/elite-logo.png"
              alt="Elite Solution"
              width={839}
              height={288}
              priority
              className="loader-logo"
            />
          </div>
        </div>
        <span className="loader-line" />
        <p className="loader-tag">Financial and non-financial services</p>
      </div>
    </div>
  );
}
