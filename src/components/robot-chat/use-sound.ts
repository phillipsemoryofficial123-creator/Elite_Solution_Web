"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

type Chime = "open" | "send" | "reply" | "on";

const STORAGE_KEY = "ronot-sound";

function subscribe(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  return () => window.removeEventListener("storage", onStoreChange);
}

function soundEnabled() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "on";
  } catch {
    return false;
  }
}

export function useSound() {
  const enabled = useSyncExternalStore(subscribe, soundEnabled, () => false);
  const [local, setLocal] = useState<boolean | null>(null);
  const on = local ?? enabled;
  const muted = !on;
  const mutedRef = useRef(true);
  const ctxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);

  const play = useCallback((kind: Chime) => {
    if (mutedRef.current || typeof window === "undefined") return;
    const Ctx =
      window.AudioContext ||
      (window as Window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctx) return;

    if (!ctxRef.current) ctxRef.current = new Ctx();
    const ctx = ctxRef.current;
    if (ctx.state === "suspended") void ctx.resume();

    const notes =
      kind === "open"
        ? [494, 740]
        : kind === "reply"
          ? [440, 660]
          : kind === "on"
            ? [587]
            : [680];

    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      const start = ctx.currentTime + index * 0.07;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.028, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.16);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.18);
    });
  }, []);

  const toggle = useCallback(() => {
    const nextOn = !(local ?? enabled);
    mutedRef.current = !nextOn;
    setLocal(nextOn);
    try {
      window.localStorage.setItem(STORAGE_KEY, nextOn ? "on" : "off");
    } catch {
      /* ignore */
    }
    if (nextOn) window.setTimeout(() => play("on"), 0);
  }, [enabled, local, play]);

  return { muted, toggle, play };
}
