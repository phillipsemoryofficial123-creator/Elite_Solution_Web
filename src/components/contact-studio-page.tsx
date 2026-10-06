"use client";

import Image from "next/image";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { MagButton } from "@/components/interactions";
import { Reveal } from "@/components/reveal";
import {
  contactPage,
  type ContactChannelIcon,
} from "@/data/contact-page";
import { services } from "@/data/services";
import { site } from "@/data/site";

function ChannelIcon({ name }: { name: ContactChannelIcon }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };

  switch (name) {
    case "phone":
      return (
        <svg {...common}>
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.81.36 1.6.68 2.35a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.75.32 1.54.55 2.35.68A2 2 0 0 1 22 16.92z" />
        </svg>
      );
    case "email":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M3 7l9 6 9-6" />
        </svg>
      );
    case "location":
      return (
        <svg {...common}>
          <path d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
      );
    case "hours":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );
  }
}

const serviceOptions = [
  ...services.map((s) => s.name),
  "Not sure yet",
];

function ServiceDropdown({
  value,
  onChange,
  labelledBy,
}: {
  value: string;
  onChange: (value: string) => void;
  labelledBy: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className={`contact-dd${open ? " open" : ""}`} ref={rootRef}>
      <button
        type="button"
        className="contact-dd-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-labelledby={labelledBy}
        onClick={() => setOpen((v) => !v)}
      >
        <span>{value}</span>
        <svg
          className="contact-dd-chevron"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open ? (
        <ul
          className="contact-dd-menu"
          id={listId}
          role="listbox"
          aria-labelledby={labelledBy}
        >
          {serviceOptions.map((opt) => {
            const selected = opt === value;
            return (
              <li key={opt} role="option" aria-selected={selected}>
                <button
                  type="button"
                  className={`contact-dd-option${selected ? " selected" : ""}`}
                  onClick={() => {
                    onChange(opt);
                    setOpen(false);
                  }}
                >
                  {opt}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

type ContactField = "name" | "email" | "message" | "captcha";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const captchaChars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function createCaptchaCode() {
  const bytes = new Uint32Array(5);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (n) => captchaChars[n % captchaChars.length]).join("");
}

function contactFieldErrors(values: {
  name: string;
  email: string;
  message: string;
  captcha: string;
  captchaCode: string;
}): Partial<Record<ContactField, string>> {
  const errors: Partial<Record<ContactField, string>> = {};
  const name = values.name.trim();
  const email = values.email.trim();
  const message = values.message.trim();
  const captcha = values.captcha.trim().toUpperCase();

  if (!name) errors.name = "Enter your name.";
  else if (name.length < 2) errors.name = "Enter your full name.";

  if (!email) errors.email = "Enter your email.";
  else if (!emailPattern.test(email)) errors.email = "Enter a valid email address.";

  if (!message) errors.message = "Enter a message.";
  else if (message.length < 10) errors.message = "Write at least 10 characters.";

  if (!captcha) errors.captcha = "Complete the captcha.";
  else if (captcha !== values.captchaCode) errors.captcha = "Those characters don't match. Try again.";

  return errors;
}

function ContactCaptcha({
  code,
  onRefresh,
}: {
  code: string;
  onRefresh: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !code) return;
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#0c1330";
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < 7; i++) {
      ctx.strokeStyle = i % 2 === 0 ? "rgba(201,162,39,.45)" : "rgba(127,161,230,.4)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(Math.random() * width, Math.random() * height);
      ctx.lineTo(Math.random() * width, Math.random() * height);
      ctx.stroke();
    }

    ctx.textBaseline = "middle";
    ctx.font = "700 28px Georgia, serif";
    code.split("").forEach((char, i) => {
      const x = 18 + i * 30;
      const y = height / 2 + (Math.random() * 8 - 4);
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((Math.random() - 0.5) * 0.45);
      ctx.fillStyle = i % 2 === 0 ? "#F3D77A" : "#E7EAF3";
      ctx.fillText(char, 0, 0);
      ctx.restore();
    });

    for (let i = 0; i < 28; i++) {
      ctx.fillStyle = "rgba(231,234,243,.35)";
      ctx.fillRect(Math.random() * width, Math.random() * height, 2, 2);
    }
  }, [code]);

  return (
    <div className="contact-fm-captcha">
      <canvas ref={canvasRef} width={168} height={56} aria-hidden="true" />
      <button type="button" className="contact-fm-captcha-refresh" onClick={onRefresh}>
        New code
      </button>
    </div>
  );
}

function ContactFormPanel() {
  const { form } = contactPage;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState(serviceOptions[0] ?? "");
  const [message, setMessage] = useState("");
  const [captchaCode, setCaptchaCode] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [tried, setTried] = useState(false);
  const errors = tried
    ? contactFieldErrors({
        name,
        email,
        message,
        captcha: captchaInput,
        captchaCode,
      })
    : {};

  useEffect(() => {
    setCaptchaCode(createCaptchaCode());
  }, []);

  function refreshCaptcha() {
    setCaptchaCode(createCaptchaCode());
    setCaptchaInput("");
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const next = contactFieldErrors({
      name,
      email,
      message,
      captcha: captchaInput,
      captchaCode,
    });
    setTried(true);
    const first = (Object.keys(next) as ContactField[])[0];
    if (first) {
      const fieldId =
        first === "name"
          ? "contact-name"
          : first === "email"
            ? "contact-email"
            : first === "message"
              ? "contact-message"
              : "contact-captcha";
      document.getElementById(fieldId)?.focus();
      return;
    }
    const body = `Name: ${name.trim()}\nEmail: ${email.trim()}\nService: ${service}\n\n${message.trim()}`;
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(
      `Consultation request: ${service}`,
    )}&body=${encodeURIComponent(body)}`;
  }

  return (
    <form className="contact-fm" noValidate onSubmit={onSubmit}>
      <div className="contact-fm-row">
        <div className="contact-fm-field">
          <label htmlFor="contact-name">Your name</label>
          <input
            id="contact-name"
            type="text"
            autoComplete="name"
            value={name}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name ? (
            <p className="contact-fm-error" id="contact-name-error" role="alert">
              {errors.name}
            </p>
          ) : null}
        </div>
        <div className="contact-fm-field">
          <label htmlFor="contact-email">Your email</label>
          <input
            id="contact-email"
            type="email"
            autoComplete="email"
            value={email}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email ? (
            <p className="contact-fm-error" id="contact-email-error" role="alert">
              {errors.email}
            </p>
          ) : null}
        </div>
      </div>
      <div className="contact-fm-field">
        <label id="contact-service-label">Service you need</label>
        <ServiceDropdown
          value={service}
          onChange={setService}
          labelledBy="contact-service-label"
        />
      </div>
      <div className="contact-fm-field">
        <label htmlFor="contact-message">Message</label>
        <textarea
          id="contact-message"
          value={message}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
        />
        {errors.message ? (
          <p className="contact-fm-error" id="contact-message-error" role="alert">
            {errors.message}
          </p>
        ) : null}
      </div>
      <div className="contact-fm-field">
        <label htmlFor="contact-captcha">Captcha</label>
        <ContactCaptcha code={captchaCode} onRefresh={refreshCaptcha} />
        <input
          id="contact-captcha"
          type="text"
          autoComplete="off"
          spellCheck={false}
          value={captchaInput}
          aria-invalid={errors.captcha ? true : undefined}
          aria-describedby={errors.captcha ? "contact-captcha-error" : undefined}
          placeholder="Type the characters"
          onChange={(e) => setCaptchaInput(e.target.value)}
        />
        {errors.captcha ? (
          <p className="contact-fm-error" id="contact-captcha-error" role="alert">
            {errors.captcha}
          </p>
        ) : null}
      </div>
      <div className="contact-fm-actions">
        <MagButton>
          <button className="btn gold mag" type="submit">
            {form.submitLabel}
          </button>
        </MagButton>
      </div>
    </form>
  );
}

export function ContactStudioPage() {
  const { hero } = contactPage;

  return (
    <div className="contact-studio">
      <section className="contact-hero">
        <div className="contact-hero-bg" aria-hidden="true">
          <Image
            src={hero.image}
            alt=""
            fill
            priority
            quality={90}
            sizes="100vw"
            className="contact-hero-bg-img"
          />
        </div>
        <div className="w contact-hero-in">
          <div className="contact-hero-copy">
            <Reveal as="p" className="contact-eyebrow">
              {hero.eyebrow}
            </Reveal>
            <Reveal>
              <h1 className="contact-title contact-hero-title">
                {hero.titleBefore}{" "}
                <span className="contact-accent">{hero.titleAccent}</span>
              </h1>
            </Reveal>
            <Reveal as="p" className="contact-lead" delay="80ms">
              {hero.lead}
            </Reveal>
            <Reveal className="contact-highlights" delay="140ms">
              {hero.highlights.map((item) => (
                <div key={item.label} className="contact-highlight">
                  <span className="contact-highlight-ic" aria-hidden="true">
                    <ChannelIcon name={item.icon} />
                  </span>
                  <span>{item.label}</span>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      <section className="sec contact-form-sec" id="consultation">
        <div className="w contact-form-layout">
          <div className="contact-office-col">
            <div className="contact-office-list">
              {site.offices.map((office, i) => (
                <Reveal key={office.id} delay={`${60 + i * 50}ms`}>
                  <div className="contact-channel">
                    <span className="contact-channel-ic" aria-hidden="true">
                      <ChannelIcon name="location" />
                    </span>
                    <span className="contact-channel-label">{office.label}</span>
                    <strong className="contact-channel-value">{office.address}</strong>
                    <span className="contact-office-links">
                      <a href={`mailto:${office.email}`}>{office.email}</a>
                      <a href={office.phoneHref}>{office.phone}</a>
                    </span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
          <div className="contact-form-main">
            <Reveal delay="100ms">
              <ContactFormPanel />
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
