export type ContactChannelIcon = "phone" | "email" | "location" | "hours";

export const contactPage = {
  hero: {
    eyebrow: "Contact Us",
    titleBefore: "Let's grow your",
    titleAccent: "business together",
    lead: "Book a free consultation. Tell us what you need — we reply with a clear plan, timeline, and quote.",
    image: "/images/helpline-hero-premium.jpg",
    highlights: [
      { icon: "phone" as const, label: "Same-day reply on business hours" },
      { icon: "email" as const, label: "Free consultation — no obligation" },
      { icon: "hours" as const, label: "Financial & digital services under one roof" },
    ],
  },
  channels: {
    eyebrow: "Reach Us",
    titleBefore: "Talk to",
    titleAccent: "Elite Solutions",
    lead: "Prefer a call, email, or a short form? Pick what works — we are easy to reach.",
  },
  form: {
    eyebrow: "Consultation",
    titleBefore: "Send a",
    titleAccent: "message",
    lead: "Share a few details and we will open your email app with everything filled in — ready to send.",
    submitLabel: "Send message",
  },
} as const;
