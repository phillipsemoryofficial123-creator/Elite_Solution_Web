import { site } from "@/data/site";

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  body: string[];
};

export const blogsPage = {
  hero: {
    eyebrow: "Blogs",
    titleBefore: "Insights that",
    titleAccent: "grow with you",
    lead: site.tagline,
    image: "/images/hero-bg-marketing.jpg",
  },
  listing: {
    eyebrow: "Latest Articles",
    titleBefore: "Practical guides for",
    titleAccent: "finance and growth",
    lead: "Clear takes on accounting, tax, websites, SEO, and digital marketing—written for business owners who want results, not jargon.",
  },
  posts: [
    {
      id: "year-end-books",
      slug: "year-end-bookkeeping-checklist",
      title: "A Year-End Bookkeeping Checklist for Small Businesses",
      excerpt:
        "Close the year with clean books, clear records, and fewer surprises when tax season arrives.",
      category: "Accounting",
      date: "October 8, 2026",
      readTime: "6 min read",
      image: "/images/acct-bookkeeping.jpg",
      body: [
        "Year-end is when small gaps in your books turn into big headaches. A simple checklist keeps your records ready for tax filing, funding conversations, and next year’s planning.",
        "Start by reconciling every bank and credit card account. Match statements to your ledger, flag unmatched transactions, and clear old outstanding items that no longer belong.",
        "Next, review receivables and payables. Confirm what clients still owe you, what you still owe vendors, and which invoices need follow-up before the year closes.",
        "Finally, archive receipts, categorize large purchases, and note any one-time expenses. Clean books make tax prep faster and give you a clearer view of where the business stands.",
      ],
    },
    {
      id: "payroll-basics",
      slug: "payroll-compliance-basics-for-growing-teams",
      title: "Payroll Compliance Basics for Growing Teams",
      excerpt:
        "As you hire, payroll rules get tighter. Here is what to keep straight from day one.",
      category: "Payroll",
      date: "September 24, 2026",
      readTime: "5 min read",
      image: "/images/hero-bg-payroll.jpg",
      body: [
        "Growth is exciting until payroll errors start costing trust, time, and penalties. A few fundamentals protect both your team and your business.",
        "Collect complete employee information before the first paycheck: tax forms, banking details, pay rate, and classification as employee or contractor.",
        "Run payroll on a consistent schedule and keep deductions accurate. Late or incorrect withholdings create cleanup work that grows quickly.",
        "Keep a simple audit trail for every pay run. When questions come up, clear records help you answer fast and stay compliant.",
      ],
    },
    {
      id: "seo-local",
      slug: "local-seo-moves-that-attract-nearby-customers",
      title: "Local SEO Moves That Attract Nearby Customers",
      excerpt:
        "Show up when local buyers search. These practical steps strengthen your presence where it counts.",
      category: "SEO",
      date: "September 12, 2026",
      readTime: "7 min read",
      image: "/images/seo-project-content.jpg",
      body: [
        "Local search is often the difference between a full calendar and an empty one. People nearby are already looking—your job is to be easy to find and easy to trust.",
        "Claim and complete your Google Business Profile with accurate hours, photos, services, and a clear description of what you offer.",
        "Build service pages that speak to your area and your offer. Generic homepage copy rarely ranks as well as focused, useful local pages.",
        "Ask happy clients for reviews and reply to them. Consistent reviews and NAP accuracy across the web help search engines and customers trust your business.",
      ],
    },
    {
      id: "website-trust",
      slug: "website-signals-that-build-client-trust",
      title: "Website Signals That Build Client Trust Fast",
      excerpt:
        "Your site has seconds to prove you are credible. These design and content signals do the heavy lifting.",
      category: "Web Design",
      date: "August 29, 2026",
      readTime: "5 min read",
      image: "/images/hero-bg-web.jpg",
      body: [
        "Visitors decide quickly whether a business feels professional. Trust is not only about looking polished—it is about making the next step obvious.",
        "Lead with a clear promise, real proof, and contact options above the fold. People should know what you do and how to reach you without hunting.",
        "Use strong case studies, client logos, and specific outcomes instead of vague claims. Concrete detail reads as confidence.",
        "Keep forms short, pages fast, and mobile layouts clean. Friction loses opportunities before a conversation ever starts.",
      ],
    },
    {
      id: "tax-planning",
      slug: "simple-tax-planning-habits-for-business-owners",
      title: "Simple Tax Planning Habits for Business Owners",
      excerpt:
        "Tax planning works best as a year-round habit, not a last-minute scramble in April.",
      category: "Tax",
      date: "August 14, 2026",
      readTime: "6 min read",
      image: "/images/hero-bg-tax.jpg",
      body: [
        "Waiting until filing season to think about tax usually means missed deductions and more stress. Small monthly habits create better outcomes.",
        "Separate personal and business spending completely. Clear accounts make deductible expenses easier to track and harder to miss.",
        "Review estimated payments and major purchases with your advisor before you commit. Timing can change the tax impact.",
        "Keep a running notes file for unusual income, new hires, and equipment buys. That context makes year-end planning sharper and faster.",
      ],
    },
    {
      id: "content-marketing",
      slug: "content-that-supports-sales-not-just-traffic",
      title: "Content That Supports Sales, Not Just Traffic",
      excerpt:
        "More visitors are not enough. Build content that answers buying questions and moves people forward.",
      category: "Marketing",
      date: "July 30, 2026",
      readTime: "6 min read",
      image: "/images/marketing-project-content.jpg",
      body: [
        "Traffic without intent rarely becomes revenue. The best content helps prospects understand your offer and feel ready to take the next step.",
        "Map topics to real questions: pricing, process, timelines, and results. Those pages attract people who are closer to buying.",
        "Pair each article with a clear call to action—consultation, quote, or portfolio view—so interest has somewhere to go.",
        "Measure what leads to inquiries, not only pageviews. Then double down on the topics and formats that actually support sales.",
      ],
    },
  ] satisfies BlogPost[],
} as const;

export function getBlogPost(slug: string) {
  return blogsPage.posts.find((post) => post.slug === slug);
}

export const featuredBlogIds = [
  "year-end-books",
  "seo-local",
  "website-trust",
] as const;
