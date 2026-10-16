import { site } from "@/data/site";

export const csrPage = {
  hero: {
    eyebrow: "Corporate Social Responsibility",
    titleBefore: "Giving Back,",
    titleAccent: "Because Business Is About People",
    lead: site.tagline,
    image: "/images/hero-bg-csr-people.jpg",
  },
  story: {
    sections: [
      {
        title: "What Is Corporate Social Responsibility (CSR)?",
        paragraphs: [
          "Corporate Social Responsibility (CSR) is about businesses making a positive difference in the communities they serve. At Elite Solutions, we believe our responsibility goes beyond business. We use our skills, technology, and expertise to provide practical resources that help people grow and succeed.",
        ],
      },
      {
        title: "Why Is CSR Important for Businesses?",
        paragraphs: [
          "Every business has the opportunity to create a positive impact, whether through its expertise, resources, time, or services. CSR is not just about donations or one-time initiatives; it’s about making a meaningful, lasting difference by providing value and creating opportunities for others.",
        ],
      },
    ],
    commitmentTitle: "Our Commitment to Giving Back",
    commitments: [
      {
        title: "Free Resume Builder",
        paragraphs: [
          "Building a professional resume can be challenging, especially for job seekers facing financial pressure. Many online platforms charge fees just to download a completed resume. We believe everyone deserves access to the tools they need to pursue career opportunities. That’s why we offer a free resume builder, helping individuals create professional resumes without hidden charges or unnecessary costs.",
        ],
      },
      {
        title: "Free Online Tools",
        paragraphs: [
          "As part of our commitment to supporting individuals, freelancers, startups, and small businesses, Elite Solutions provides access to a range of online tools directly through our website. Our existing SEO tools help users improve their online visibility, optimize their content, and strengthen their digital presence.",
          "We aim to make useful digital resources more accessible, helping entrepreneurs and creators save time, work efficiently, and grow their businesses without unnecessary expenses.",
        ],
      },
    ],
    actions: [
      {
        label: "Build Your Free Resume",
        href: "https://resume.elitesolutionusa.com/",
      },
      {
        label: "Explore Our Free SEO Tools",
        href: "https://eliteseotools.elitesolutionusa.com/",
      },
    ],
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
    body: "At Elite Solutions, we believe that when people have access to the right resources, they have more opportunities to succeed—and that success can create a positive impact across the wider community.",
    line: "Build Better. Optimize Smarter. Grow with Elite Solutions.",
  },
} as const;

export type CsrToolId = (typeof csrPage.tools)[number]["id"];
