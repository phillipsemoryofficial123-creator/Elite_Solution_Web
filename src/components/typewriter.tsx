"use client";

import { useEffect, useRef } from "react";
import { heroWords } from "@/data/site";
import { heroDisplayFont } from "@/fonts/hero";

export function Typewriter({
  words = heroWords,
  fallback,
}: {
  words?: readonly string[];
  fallback?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const list = words.length ? words : heroWords;
  const reduced = fallback ?? list.slice(0, 2).join(" and ");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = reduced;
      return;
    }

    let wi = 0;
    let ci = 0;
    let del = false;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      const w = list[wi];
      let t = 85;
      el.textContent = w.slice(0, ci);
      if (!del && ci < w.length) ci++;
      else if (!del) {
        del = true;
        t = 1500;
      } else if (ci > 0) {
        ci--;
        t = 40;
      } else {
        del = false;
        wi = (wi + 1) % list.length;
        t = 320;
      }
      timer = setTimeout(tick, t);
    };

    timer = setTimeout(tick, 600);
    return () => clearTimeout(timer);
  }, [list, reduced]);

  return (
    <span className={`rotline ${heroDisplayFont.className}`}>
      <span className="grad" ref={ref}>
        {list[0]}
      </span>
      <span className="caret" />
    </span>
  );
}
