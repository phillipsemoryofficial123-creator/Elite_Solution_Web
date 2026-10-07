export const careersCategories = [
  { id: "all", label: "All Positions" },
  { id: "development", label: "Development" },
  { id: "design", label: "Design" },
  { id: "marketing", label: "Marketing" },
  { id: "sales", label: "Sales" },
  { id: "support", label: "Support" },
] as const;

export type CareersCategoryId = (typeof careersCategories)[number]["id"];

export type CareersJob = {
  id: string;
  title: string;
  category: Exclude<CareersCategoryId, "all">;
  type: string;
  mode: string;
  location: string;
  salary?: string;
  status: "open" | "closed";
  description: string;
  href: string;
};

export const careersPage = {
  hero: {
    eyebrow: "Careers",
    titleBefore: "Join",
    titleAccent: "Elite Solutions",
    lead: "At Elite Solutions, we're not just about numbers — we're about people, innovation, and making an impact. Join a team where your skills are valued, growth is encouraged, and every day presents an opportunity to make a difference.",
    values: [
      {
        icon: "culture",
        title: "Great Culture",
        body: "People, innovation, and impact.",
      },
      {
        icon: "growth",
        title: "Growth Opportunities",
        body: "Skills valued. Growth encouraged.",
      },
    ],
    image: "/images/careers-hero-team.jpg",
  },
  openings: {
    eyebrow: "Join Our Team",
    title: "Current Openings",
    lead: "Explore exciting career opportunities and grow with us.",
    jobs: [
      {
        id: "nextjs-dev",
        title: "Next.js Developer",
        category: "development",
        type: "Full-time",
        mode: "On-site",
        location: "Gulshan-e-Iqbal Phase 5",
        salary: "80,000",
        status: "closed" as CareersJob["status"],
        description:
          "We are seeking a talented and motivated Next.js Developer to join our team. In this role, you will be responsible for building and maintaining modern web applications with clean, scalable front-end architecture.",
        href: "/contact",
      },
    ] satisfies CareersJob[],
  },
  why: {
    eyebrow: "Why Work With Us",
    titleBefore: "More Than a Workplace — It's a",
    titleAccent: "Community",
    lead: "Our success in creating business solutions is due in large part to our talented and highly committed team. Join people who value quality, ownership, and growth.",
    ctaLabel: "Learn More About Us",
    ctaHref: "/about",
    cards: [
      {
        icon: "salary",
        title: "Competitive Salary",
        body: "Fair pay aligned with skill and impact.",
      },
      {
        icon: "career",
        title: "Career Growth",
        body: "Clear paths to advance your role.",
      },
      {
        icon: "tools",
        title: "Modern Tools",
        body: "Ship with the stack professionals use.",
      },
      {
        icon: "balance",
        title: "Work-Life Balance",
        body: "Flexible schedules that respect life.",
      },
      {
        icon: "learning",
        title: "Learning Budget",
        body: "Courses, books, and skill support.",
      },
      {
        icon: "team",
        title: "Supportive Team",
        body: "Mentors and teammates who help you win.",
      },
    ],
  },
} as const;

export type CareersValueIcon =
  (typeof careersPage.hero.values)[number]["icon"];
export type CareersWhyIcon = (typeof careersPage.why.cards)[number]["icon"];
