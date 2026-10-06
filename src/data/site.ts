export const site = {
  name: "Elite Solutions USA",
  shortName: "ELITE SOLUTIONS",
  tagline:
    "Comprehensive financial and non-financial services to empower growth and success.",
  phone: "+1 832-951-2823",
  phoneHref: "tel:+18329512823",
  email: "info@elitesolutionscpa.com",
  website: "https://www.elitesolutionusa.com",
  websiteLabel: "www.elitesolutionusa.com",
  location: "Naperville, Illinois",
  address: "Naperville, Illinois 60563",
  offices: [
    {
      id: "usa",
      label: "USA Office",
      email: "usa@elitesolutionusa.com",
      phone: "+1 (832) 951-2823",
      phoneHref: "tel:+18329512823",
      address: "Naperville, Illinois 60563",
    },
    {
      id: "ksa",
      label: "KSA Office",
      email: "ksa@elitesolutionusa.com",
      phone: "(+966) 56-1377801",
      phoneHref: "tel:+966561377801",
      address:
        "Prince Nawaf Street, Building No 32, Suit No 201, Al Khobar, Saudi Arabia",
    },
    {
      id: "pakistan",
      label: "Pakistan Office",
      email: "pak@elitesolutionusa.com",
      phone: "(+92) 336-2129231",
      phoneHref: "tel:+923362129231",
      address:
        "Good Time Apartments, Office No# M4, Besides B-10 Main University Rd, Gulshan 13-B Block 13 B Gulshan-e-Iqbal, Karachi, Pakistan",
    },
  ],
  founder: {
    name: "Usman Tehseen",
    qualifications: "ACCA, MBA (Marketing), University of Oxford",
    basedIn: "Naperville, Illinois",
    focus: "Finance, technology, offshore talent and digital growth",
  },
  social: [
    {
      id: "facebook",
      label: "Facebook",
      href: "https://www.facebook.com/people/Elite-Solutions/61569394719342/",
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      href: "https://www.linkedin.com/company/elitesolutionusa",
    },
    {
      id: "instagram",
      label: "Instagram",
      href: "https://www.instagram.com/elite.solutions3",
    },
  ],
} as const;

export const nav: {
  href: string;
  label: string;
  cta?: boolean;
  external?: boolean;
}[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/pricing", label: "Pricing" },
  { href: "/careers", label: "Careers" },
  { href: "/csr", label: "CSR" },
  {
    href: "https://elitebase-neon.vercel.app/",
    label: "E-portal",
    external: true,
  },
  { href: "/contact", label: "Contact Us" },
  { href: "/contact", label: "Get Started", cta: true },
];

export const heroWords = [
  "accounting",
  "websites",
  "branding",
  "marketing",
  "payroll",
  "SEO",
] as const;

export const servicesHeroWords = [
  "accounting",
  "tax & payroll",
  "websites Dev",
  "branding & design",
  "marketing & SEO",
  "Digital Growth",
] as const;

export const processSteps = [
  {
    threshold: 0.05,
    title: "Tell us what you need",
    body: "Send a message or call. Describe your business and what you want done.",
  },
  {
    threshold: 0.45,
    title: "Get a plan and a quote",
    body: "We reply with the scope, the timeline and the price.",
  },
  {
    threshold: 0.85,
    title: "We deliver and support",
    body: "Your work is completed and we stay available for changes and questions.",
  },
] as const;

export const pillars = [
  {
    icon: "cfo" as const,
    title: "Finance",
    body: "Accounting, tax, payroll and CFO guidance.",
  },
  {
    icon: "web" as const,
    title: "Technology",
    body: "Websites and digital tools built for your business.",
  },
  {
    icon: "mkt" as const,
    title: "Digital growth",
    body: "Branding, SEO and marketing that bring in customers.",
  },
] as const;
