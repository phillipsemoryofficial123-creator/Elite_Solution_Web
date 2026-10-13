"use client";

import { useEffect, useRef } from "react";

const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY?.trim() ?? "";

type GrecaptchaRender = {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      theme: "light";
      callback: (token: string) => void;
      "expired-callback": () => void;
      "error-callback": () => void;
    },
  ) => number;
  reset: (widgetId?: number) => void;
};

declare global {
  interface Window {
    grecaptcha?: GrecaptchaRender;
    onRecaptchaLoad?: () => void;
  }
}

export function RecaptchaWidget({
  resetKey = 0,
  onChange,
}: {
  resetKey?: number;
  onChange: (token: string) => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<number | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    if (!recaptchaSiteKey || !hostRef.current) return;
    let cancelled = false;

    const render = () => {
      if (cancelled || !hostRef.current || widgetId.current !== null) return;
      const grecaptcha = window.grecaptcha;
      if (!grecaptcha?.render) return;
      widgetId.current = grecaptcha.render(hostRef.current, {
        sitekey: recaptchaSiteKey,
        theme: "light",
        callback: (token) => onChangeRef.current(token),
        "expired-callback": () => onChangeRef.current(""),
        "error-callback": () => onChangeRef.current(""),
      });
    };

    if (window.grecaptcha?.render) {
      render();
      return () => {
        cancelled = true;
      };
    }

    window.onRecaptchaLoad = render;
    if (!document.querySelector("script[data-recaptcha='v2']")) {
      const script = document.createElement("script");
      script.src =
        "https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit";
      script.async = true;
      script.defer = true;
      script.dataset.recaptcha = "v2";
      document.head.appendChild(script);
    }

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (resetKey === 0 || widgetId.current === null) return;
    window.grecaptcha?.reset(widgetId.current);
  }, [resetKey]);

  if (!recaptchaSiteKey) {
    return (
      <p className="auth-recaptcha-error" role="alert">
        reCAPTCHA is not configured yet.
      </p>
    );
  }

  return <div ref={hostRef} className="auth-recaptcha" />;
}
