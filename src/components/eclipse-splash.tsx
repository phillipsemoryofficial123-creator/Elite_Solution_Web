"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Cormorant_Garamond } from "next/font/google";
import "./eclipse-splash.css";

const serif = Cormorant_Garamond({ subsets: ["latin"], weight: ["600"] });

type Props = {
  /** Minimum time the splash stays visible (ms). */
  minDuration?: number;
  /** Show only once per browser session. */
  once?: boolean;
  /** Called after the splash has fully faded out. */
  onDone?: () => void;
};

const KEY = "elite-splash-seen";

export default function EclipseSplash({
  minDuration = 2600,
  once = true,
  onDone,
}: Props) {
  const [phase, setPhase] = useState<"show" | "leave" | "gone">("show");

  useEffect(() => {
    if (once && sessionStorage.getItem(KEY)) {
      setPhase("gone");
      onDone?.();
      return;
    }

    let alive = true;
    document.body.style.overflow = "hidden";

    const pageReady = new Promise<void>((resolve) => {
      if (document.readyState === "complete") resolve();
      else window.addEventListener("load", () => resolve(), { once: true });
    });
    const minWait = new Promise<void>((resolve) =>
      setTimeout(resolve, minDuration)
    );

    Promise.all([pageReady, minWait]).then(() => {
      if (!alive) return;
      setPhase("leave");
      setTimeout(() => {
        if (!alive) return;
        sessionStorage.setItem(KEY, "1");
        setPhase("gone");
        onDone?.();
      }, 700);
    });

    return () => {
      alive = false;
      document.body.style.overflow = "";
    };
  }, [minDuration, once, onDone]);

  useEffect(() => {
    if (phase === "gone") document.body.style.overflow = "";
  }, [phase]);

  if (phase === "gone") return null;

  return (
    <div
      className={`es-root ${phase === "leave" ? "es-leave" : ""}`}
      role="status"
      aria-label="Loading Elite Solutions"
    >
      <div className="es-col">
        <div className="es-eclipse">
          <i className="es-ring" />
          <Image
            className="es-logo"
            src="/logo-mark.png"
            alt="Elite Solutions logo"
            width={344}
            height={362}
            priority
          />
        </div>
        <h1 className={`es-title ${serif.className}`}>Elite Solutions</h1>
      </div>
    </div>
  );
}
