export const graphicDesignPage = {
  hero: {
    titleBefore: "Turning Ideas Into",
    titleSky: "Stunning",
    titleGold: "Visuals",
    lead: "We craft logos, brand systems, and marketing creatives that make your business look sharp, memorable, and ready to grow.",
    primaryCta: { label: "Get Started", href: "/contact" },
    secondaryCta: { label: "See client results", href: "/portfolio" },
    visual: "/images/hero-bg-graphic.jpg",
  },
  services: {
    titleBefore: "Design Solutions for",
    titleAccent: "Every Need",
    items: [
      {
        icon: "logo",
        title: "Logo Design",
        body: "Distinctive marks that capture your brand and stay memorable across every touchpoint.",
      },
      {
        icon: "social",
        title: "Social Media Graphics",
        body: "Scroll-stopping posts, stories, and ads that keep your brand consistent and engaging.",
      },
      {
        icon: "brand",
        title: "Brand Identity",
        body: "Full visual systems — colors, type, and guidelines that make your brand feel cohesive.",
      },
      {
        icon: "packaging",
        title: "Packaging Design",
        body: "Product packaging that stands out on the shelf and tells your story at a glance.",
      },
      {
        icon: "print",
        title: "Print Design",
        body: "Brochures, flyers, menus, and stationery crafted for clean print and strong impact.",
      },
      {
        icon: "marketing",
        title: "Marketing Materials",
        body: "Campaign visuals and promotional assets designed to support launches and growth.",
      },
    ],
  },
  projects: {
    title: "Featured Projects",
    items: [
      {
        title: "Velora Chocolate",
        subtitle: "Logo, packaging & brand identity",
        category: "Branding",
        image: "/images/graphic-project-velora.jpg",
        href: "/portfolio",
      },
      {
        title: "Nova Fitness",
        subtitle: "Social creatives & campaign visuals",
        category: "Social Media",
        image: "/images/graphic-project-nova.jpg",
        href: "/portfolio",
      },
      {
        title: "Luxe Interiors",
        subtitle: "Brand system & presentation design",
        category: "Branding",
        image: "/images/graphic-project-luxe.jpg",
        href: "/portfolio",
      },
      {
        title: "Brew & Bean",
        subtitle: "Logo, menu & digital presence",
        category: "Web",
        image: "/images/graphic-project-brew.jpg",
        href: "/portfolio",
      },
    ],
  },
  process: {
    titleBefore: "Simple Process,",
    titleAccent: "Stunning Results",
    ctaLabel: "Get Started",
    ctaHref: "/contact",
    steps: [
      {
        icon: "discuss",
        title: "Discuss Your Idea",
        body: "We learn your goals, audience, and the look you want to achieve.",
      },
      {
        icon: "design",
        title: "Design & Create",
        body: "Our team crafts polished concepts shaped around your brand direction.",
      },
      {
        icon: "review",
        title: "Review & Refine",
        body: "You review the work and we refine every detail until it feels right.",
      },
      {
        icon: "deliver",
        title: "Deliver & Support",
        body: "Final files are delivered ready to use — with support when you need it.",
      },
    ],
  },
} as const;

export type GraphicServiceIcon =
  (typeof graphicDesignPage.services.items)[number]["icon"];
export type GraphicProcessIcon =
  (typeof graphicDesignPage.process.steps)[number]["icon"];
