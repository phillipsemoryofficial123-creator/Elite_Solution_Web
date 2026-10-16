import { site } from "@/data/site";

export const aboutPage = {
  hero: {
    eyebrow: "About Us",
    title: "Your Partner in Financial & Business Growth",
    lead: site.tagline,
    ctaLabel: "Get in Touch",
    ctaHref: "/contact",
    image: "/images/hero-bg-about.jpg",
  },
  story: {
    eyebrow: "About Us",
    title: "From a Small Idea to a Growing Digital Partner",
    paragraphs: [
      "Elite Solutions offers small business owners specialized, customized accounting and financial services. From financial guidance, bookkeeping, fiscal reporting, payroll processing to tax submissions, we assist you in getting your business operationally smooth and lawful.",
      "In addition, we create and implement strategic marketing plans that are aligned with your business' goals, enabling you to reach your desired audience efficiently. We also provide personalized tax services for individuals, meticulously managing all financial aspects with accuracy and diligence.",
      "We believe in minimizing the burden of operational tasks and bringing down overheads that are sometimes unreasonably high, to enable you to focus on your core business of growing and meeting your aspirations. At Elite Solutions, we aren't accountants; we're your success partners.",
    ],
    ctaLabel: "Our Journey",
    ctaHref: "/portfolio",
    image: "/images/about-lobby-logo-wall.jpg",
  },
  stats: [
    { icon: "clients", value: "50k+", label: "Users Worldwide" },
    { icon: "satisfaction", value: "81.5%", label: "Client Retention" },
    { icon: "projects", value: "8+", label: "Industries Served" },
    { icon: "years", value: "3", label: "Global Offices" },
  ],
  mission: {
    eyebrow: "Our Promise",
    title: "Excellence, Expertise & Mission-Driven Growth",
    lead: "Comprehensive financial and non-financial services to empower growth and success.",
    ctaLabel: "Explore Our Services",
    ctaHref: "/services",
    cards: [
      {
        icon: "promise",
        title: "Our Promise",
        body: "We are committed to excellence, reliability and satisfaction.",
      },
      {
        icon: "expertise",
        title: "Our Expertise",
        body: "Years of experience driving excellence across industries with precision.",
      },
      {
        icon: "mission",
        title: "Our Mission",
        body: "Delivering tailored solutions to empower success and growth globally.",
      },
    ],
  },
  industries: {
    eyebrow: "Industries",
    title: "Industry-Specific Financial Knowledge",
    lead: "Elite Solutions has an 81.5% client retention ratio due to our commitment to customized solutions and services. Our industry-specific financial knowledge ensures each client receives support tailored to their unique financial needs.",
    items: [
      {
        title: "Restaurant Industry",
        body: "Enhance efficiency and profitability.",
      },
      {
        title: "Catering Industry",
        body: "Solutions specific to event-driven and seasonal business models.",
      },
      {
        title: "Grocery Chains",
        body: "Oversee complex financial reporting and inventory control.",
      },
      {
        title: "Distribution Companies",
        body: "Guide process improvement initiatives to ensure financial accuracy and operational success.",
      },
      {
        title: "Meat Packaging & Slaughtering",
        body: "Provide specific financial solutions for challenges unique to their industry.",
      },
      {
        title: "Non-Profit Organizations",
        body: "Guarantee adherence to regulations, optimize fund allocation, and formulate efficient financial strategies.",
      },
      {
        title: "Real Estate Investment Companies",
        body: "Provide proficiency in wealth management, tax optimization, and asset reporting.",
      },
      {
        title: "Charitable Organizations",
        body: "Build trust through transparent financial management and reliable compliance solutions, so they can focus on making a greater impact.",
      },
    ],
  },
  growth: {
    eyebrow: "Growth",
    title: "Smart Solutions for Continuous Growth",
    lead: "Custom strategy design to ensure not only growth but prosperity, too.",
    highlights: [
      {
        title: "Abattoirs and Meat Processing Companies",
        body: "Specialised financial service solutions to meet the particular challenges of the industry.",
      },
      {
        title: "Charitable Organisations",
        body: "Ensuring compliance, using your funds efficiently, and making a difference in financial planning.",
      },
      {
        title: "Property Investment Companies",
        body: "Proficient in financial management, tax optimisation, and portfolio appraisal.",
      },
    ],
  },
  team: {
    eyebrow: "Our Team",
    title: "Trusted by a Growing Community of Clients",
    lead: "Our success in creating business solutions is due in large part to our talented and highly committed team.",
    ctaLabel: "Join Our Team",
    ctaHref: "/contact",
    members: [
      {
        name: "Usman Tehseen",
        role: "CEO & Founder",
        image: "/images/about-team-1.jpg",
      },
      {
        name: "Sarah Malik",
        role: "Lead Designer",
        image: "/images/about-team-2.jpg",
      },
      {
        name: "Ahmed Khan",
        role: "Lead Developer",
        image: "/images/about-team-3.jpg",
      },
      {
        name: "Omar Farooq",
        role: "Marketing Lead",
        image: "/images/about-team-4.jpg",
      },
      {
        name: "Ayesha Noor",
        role: "Finance Specialist",
        image: "/images/about-team-5.jpg",
      },
    ],
  },
  cta: {
    title: "Ready to Start Your Project?",
    lead: "Tell us what you need. We will reply with a clear plan, timeline, and quote.",
    primaryLabel: "Get a Free Quote",
    primaryHref: "/contact",
    secondaryLabel: "Contact Us",
    secondaryHref: "/contact",
    image: "/images/about-cta-laptop.jpg",
  },
} as const;

export type AboutStatIcon = (typeof aboutPage.stats)[number]["icon"];
export type AboutMissionIcon = (typeof aboutPage.mission.cards)[number]["icon"];
