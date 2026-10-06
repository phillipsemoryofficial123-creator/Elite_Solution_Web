export const csrPage = {
  hero: {
    eyebrow: "CSR",
    titleBefore: "Free tools for",
    titleAccent: "your next step",
    lead: "Build a resume or check your search presence with tools from Elite Solutions USA. Each one opens on its own site.",
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
} as const;

export type CsrToolId = (typeof csrPage.tools)[number]["id"];
