export const csrPage = {
  hero: {
    eyebrow: "CSR",
    titleBefore: "Free tools for",
    titleAccent: "your next step",
    lead: "Build a resume or check your search presence with tools from Elite Solutions USA. Each one opens on its own site.",
    image: "/images/seo-hero-premium.jpg",
  },
  tools: [
    {
      id: "resume",
      name: "Resume Builder",
      body: "A free AI resume builder for a clear, role-ready resume you can tailor and download.",
      cta: "Open Resume Builder",
      href: "https://resume.elitesolutionusa.com/",
    },
    {
      id: "seo",
      name: "SEO Tools",
      body: "A free SEO suite for rankings, rewriting, grammar, summaries, and everyday content checks.",
      cta: "Open SEO Tools",
      href: "https://eliteseotools.elitesolutionusa.com/",
    },
  ],
  details: [
    {
      id: "resume" as const,
      eyebrow: "Resume Builder",
      titleBefore: "Build Your",
      titleAccent: "Professional Future",
      body: "Create a professional resume with ease using our Resume Builder. Whether you are a fresh graduate, an experienced professional, or looking for a career change, our tool helps you present your skills, qualifications, and work experience effectively.",
      featuresLabel: "Key Features",
      features: [
        "Easy-to-use resume creation process",
        "Professional resume templates and layouts",
        "Organized sections for skills, education, and experience",
        "Career-focused formatting to highlight your strengths",
        "Download-ready resumes for job applications",
      ],
      close:
        "Start building your resume today and take the next step toward your career goals.",
    },
    {
      id: "seo" as const,
      eyebrow: "SEO Tools",
      titleBefore: "Improve Your",
      titleAccent: "Online Visibility",
      body: "Our SEO Tools help businesses, marketers, and website owners understand and improve their website performance. Discover opportunities to optimize your content, strengthen search engine visibility, and attract relevant visitors.",
      featuresLabel: "Key Features",
      features: [
        "Keyword research and optimization",
        "Website SEO analysis",
        "Meta title and meta description guidance",
        "On-page SEO recommendations",
        "Content optimization insights",
        "Website performance and search visibility checks",
      ],
      close:
        "Make smarter SEO decisions and help your website reach its full potential.",
    },
  ],
  close: {
    titleBefore: "Empower Your Next Step",
    titleAccent: "with Elite Solutions",
    body: "Whether you are building your career or growing your online presence, Elite Solutions provides practical tools to support your goals. Explore our resources and take a step toward greater professional and digital success.",
    line: "Build Better. Optimize Smarter. Grow with Elite Solutions.",
  },
} as const;

export type CsrToolId = (typeof csrPage.tools)[number]["id"];
