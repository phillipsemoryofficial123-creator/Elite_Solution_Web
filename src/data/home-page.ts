import { portfolioStudioPage } from "@/data/portfolio-page";
import { pricingPage } from "@/data/pricing-page";
import { aboutPage } from "@/data/about-page";
import { financialServices, nonFinancialServices } from "@/data/services";

const featuredIds = ["hussain-catering", "burger-buz", "butt-karahi"];
const featuredPortfolio = featuredIds.map((id) =>
  portfolioStudioPage.projects.find((project) => project.id === id),
).filter((project) => project != null);

export const homePage = {
  hero: {
    eyebrow: "Elite Solutions USA",
    titleLine2: "Business Growth",
    lead: "Comprehensive Financial and Non-Financial Services to Empower Growth and Success.",
    primaryLabel: "Get Started",
    primaryHref: "/contact",
    secondaryLabel: "Explore Services",
    secondaryHref: "/services",
    image: "/images/home-hero-consultation.jpg",
  },
  services: {
    eyebrow: "What We Do",
    titleBefore: "Services that",
    titleAccent: "move you forward",
    lead: "Two service groups, one team. Use them together or separately.",
    ctaLabel: "View all services",
    ctaHref: "/services",
    groups: [
      {
        id: "financial",
        label: "Financial",
        items: financialServices
          .filter(
            (s) => s.slug !== "cfo-services" && s.slug !== "audit-and-review",
          )
          .slice(0, 3),
      },
      {
        id: "non-financial",
        label: "Non-financial",
        items: nonFinancialServices
          .filter(
            (s) =>
              s.slug !== "seo-services" &&
              s.slug !== "email-marketing" &&
              s.slug !== "help-line-services",
          )
          .slice(0, 3),
      },
    ],
  },
  about: {
    eyebrow: aboutPage.story.eyebrow,
    titleBefore: "We aren't just accountants —",
    titleAccent: "we're your success partners",
    lead: aboutPage.story.paragraphs[0],
    points: aboutPage.mission.cards.map((c) => ({
      title: c.title,
      body: c.body,
    })),
    stats: aboutPage.stats.slice(0, 3),
    ctaLabel: "About Elite Solutions",
    ctaHref: "/about",
    image: "/images/about-team-meeting-dark.jpg",
  },
  portfolio: {
    eyebrow: portfolioStudioPage.hero.eyebrow,
    titleBefore: "Work that",
    titleAccent: "speaks for itself",
    lead: portfolioStudioPage.hero.lead,
    ctaLabel: "View full portfolio",
    ctaHref: "/portfolio",
    projects: featuredPortfolio,
  },
  pricing: {
    eyebrow: pricingPage.hero.eyebrow,
    titleBefore: "Clear pricing for",
    titleAccent: "tailored solutions",
    lead: pricingPage.hero.lead,
    highlights: pricingPage.hero.highlights.map((h) => h.label),
    cards: [
      {
        title: "Financial Planning",
        body: pricingPage.financial.panelLead,
        href: "/pricing",
      },
      {
        title: "Discovery Calls",
        body: "Complimentary 2-part discovery so we understand your goals before we recommend a plan.",
        href: "/pricing",
      },
      {
        title: "Digital Growth",
        body: "Web, SEO, design, and marketing services that strengthen your presence and performance.",
        href: "/pricing",
      },
    ],
    ctaLabel: "See pricing",
    ctaHref: "/pricing",
  },
  process: {
    eyebrow: "How It Works",
    titleBefore: "Simple",
    titleAccent: "next steps",
    items: [
      {
        num: "01",
        title: "Tell us what you need",
        body: "Share your goals by call, email, or form — financial, digital, or both.",
      },
      {
        num: "02",
        title: "Get a clear plan",
        body: "We reply with scope, timeline, and pricing written down — no surprises.",
      },
      {
        num: "03",
        title: "We deliver and support",
        body: "Work gets done, and we stay available for changes and questions.",
      },
    ],
  },
} as const;
