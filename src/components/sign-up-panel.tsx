"use client";

import { SignUp } from "@clerk/nextjs";
import { useEffect, useRef, useState } from "react";
import { RecaptchaWidget } from "@/components/recaptcha-widget";

export function SignUpPanel() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [top, setTop] = useState<number | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const place = () => {
      const button = root.querySelector(".cl-formButtonPrimary");
      if (!button) return;
      const next = Math.round(
        button.getBoundingClientRect().top - root.getBoundingClientRect().top - 94,
      );
      setTop((current) => (current !== null && Math.abs(current - next) < 2 ? current : next));
    };

    place();
    const observer = new MutationObserver(place);
    observer.observe(root, { childList: true, subtree: true });
    window.addEventListener("resize", place);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", place);
    };
  }, []);

  async function onCaptcha(token: string) {
    if (!token) {
      setUnlocked(false);
      return;
    }
    setError("");
    try {
      const response = await fetch("/api/recaptcha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      if (!response.ok) {
        setUnlocked(false);
        setError("Confirm you are not a robot.");
        return;
      }
      setUnlocked(true);
    } catch {
      setUnlocked(false);
      setError("Confirm you are not a robot.");
    }
  }

  return (
    <div className={`auth-sign${unlocked ? "" : " is-locked"}`} ref={rootRef}>
      <SignUp
        appearance={{
          elements: {
            rootBox: "auth-box",
            card: "auth-card",
          },
        }}
      />
      <div
        className={`auth-captcha${top === null ? "" : " is-inside"}`}
        style={top === null ? undefined : { top }}
      >
        <RecaptchaWidget onChange={onCaptcha} />
        {error ? (
          <p className="auth-recaptcha-error" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    </div>
  );
}
