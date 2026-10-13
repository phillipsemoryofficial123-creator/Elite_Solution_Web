export type ServiceDetailStep = {
  title: string;
  body: string;
};

export type ServiceDetailSpecialty = {
  title: string;
  body: string;
};

export type ServiceFeatureIcon =
  | "frontend"
  | "backend"
  | "database"
  | "fullstack"
  | "webapp"
  | "ecommerce"
  | "api"
  | "deploy"
  | "brand"
  | "audience"
  | "content"
  | "social"
  | "campaign"
  | "analytics"
  | "funnel"
  | "growth";

export type ServiceDetailFeature = {
  title: string;
  body: string;
  icon: ServiceFeatureIcon;
};

export type ServiceProcessIcon =
  | "discuss"
  | "design"
  | "develop"
  | "launch";

export type ServiceProcessStep = {
  title: string;
  body: string;
  icon: ServiceProcessIcon;
};

export type ServiceFeaturedProject = {
  title: string;
  description: string;
  image: string;
  href: string;
  liveHref?: string;
  linkLabel?: string;
};

export type ServiceDetailSection = {
  heading: string;
  paragraphs: string[];
  eyebrow?: string;
  ctaLabel?: string;
  ctaHref?: string;
  bullets?: string[];
  steps?: ServiceDetailStep[];
  specialties?: ServiceDetailSpecialty[];
  features?: ServiceDetailFeature[];
  process?: ServiceProcessStep[];
  projects?: ServiceFeaturedProject[];
  image?: string;
};

export type ServiceDetailContent = {
  slug: string;
  pageTitle: string;
  intro: string[];
  offerLead?: string;
  pageBg?: string;
  heroBg?: string;
  sections: ServiceDetailSection[];
};

/** Accounting content adapted from https://elitesolutionusa.com/accounting-bookkeeping/ */
export const serviceDetails: ServiceDetailContent[] = [
  {
    slug: "accounting-and-bookkeeping",
    pageTitle: "Accounting & Bookkeeping",
    heroBg: "/images/hero-bg-accounting.jpg",
    intro: [
      "Our expert accounting and bookkeeping services are designed to help businesses manage their financial records with accuracy and efficiency.",
    ],
    offerLead:
      "From day-to-day books to reporting and controls, we keep your financial operations accurate, compliant, and ready for growth.",
    sections: [
      {
        heading: "Accounting Services",
        image: "/images/acct-premium-accounting.jpg",
        paragraphs: [
          "Accounting is a cornerstone of every business, ensuring financial transparency, operational efficiency, and sound decision-making. It helps organizations monitor transactions, assess financial health, and plan for future growth.",
          "At Elite Solutions Accounting and Bookkeeping, we recognize the importance of maintaining accurate financial records tailored to U.S. regulations and business practices. We specialize in streamlining accounting processes for businesses of all sizes, ensuring compliance and enabling decision-makers to act on reliable financial data. Our services not only reduce overhead costs but also enhance the efficiency of year-end reporting, leaving you more time to focus on your core business objectives.",
        ],
      },
      {
        heading: "Bookkeeping Services",
        image: "/images/acct-premium-bookkeeping.jpg",
        paragraphs: [
          "Efficient bookkeeping ensures that daily transactions and financial records are well-organized and accurate. Our outsourced bookkeeping services keep your financial data up to date so operations stay seamless.",
        ],
        bullets: [
          "Setting up and reviewing the Chart of Accounts",
          "Recording daily financial transactions with precision",
          "Flexible service schedules (daily, weekly, monthly, or quarterly)",
          "Managing accounts payable and receivable",
          "Performing bank reconciliations",
          "Ensuring compliance with tax regulations",
          "Creating detailed MIS reports for better business insights",
        ],
      },
      {
        heading: "Accounts Payable Outsourcing",
        image: "/images/acct-premium-payable.jpg",
        paragraphs: [
          "In today’s competitive business environment, optimizing costs without compromising quality is essential. Outsourcing accounts payable allows businesses to focus on strategic goals while leaving tedious financial processes to experts.",
          "Our team at Elite Accounting handles accounts payable efficiently, offering tailored services on a weekly, monthly, or annual basis, depending on transaction volume. By entrusting us with your payable process, you gain a reliable partner who prioritizes accuracy and confidentiality, ensuring that your creditors’ data is secure and managed professionally.",
        ],
      },
      {
        heading: "Financial Reporting",
        image: "/images/acct-premium-reporting.jpg",
        paragraphs: [
          "Accurate financial reporting reflects your company’s performance and future potential. Investors, banks, and other stakeholders rely on these reports to evaluate profitability and make key decisions.",
          "We specialize in preparing comprehensive financial statements that adhere to regulatory standards. Our reports provide insights into your organization’s financial position, enabling strategic planning and fostering confidence among investors and lenders. With us, your business’s financial health is always represented accurately and transparently.",
        ],
      },
      {
        heading: "Internal Controls Testing and Implementation",
        image: "/images/acct-premium-controls.jpg",
        paragraphs: [
          "Maintaining integrity in financial reporting is critical to avoiding fraud or mismanagement. Our team conducts thorough internal control testing to detect vulnerabilities in your financial processes.",
          "At Elite Accounting, we implement robust controls to safeguard your financial data and ensure compliance. By acting as an unbiased third party, we bring fresh perspectives and a commitment to ethical accounting practices. Regular assessments of bookkeeping and financial reporting prevent costly mistakes and help secure your business’s future.",
        ],
      },
      {
        heading: "Software Implementation",
        image: "/images/acct-premium-software.jpg",
        paragraphs: [
          "Adopting the right accounting software can transform the way you manage finances. Our team specializes in selecting, deploying, and customizing software solutions to align with your business needs.",
        ],
        bullets: [
          "Detailed requirement analysis to select the best software",
          "Data migration with minimal disruption",
          "Staff training to maximize software utilization",
          "Ongoing technical support for troubleshooting and upgrades",
        ],
      },
      {
        heading: "Sales, Invoicing, and Receivables Management",
        image: "/images/acct-premium-invoicing.jpg",
        paragraphs: [
          "Managing sales and receivables effectively is vital for maintaining healthy cash flow. We offer comprehensive solutions to streamline your invoicing process and ensure timely payment collection.",
        ],
        bullets: [
          "Automated invoicing and billing setup",
          "Tracking outstanding receivables with detailed reporting",
          "Implementing strategies to reduce overdue payments",
          "Integrating invoicing with accounting software for efficiency",
        ],
      },
    ],
  },
  {
    slug: "payroll-outsourcing",
    pageTitle: "Payroll Outsourcing Services",
    heroBg: "/images/hero-bg-payroll.jpg",
    intro: [
      "Elite Solutions CPA offers payroll outsourcing services to businesses, allowing them to focus on core operations while ensuring accurate, timely payroll processing.",
    ],
    offerLead:
      "Accurate, on-time payroll with tax withholdings and filings handled for you — so your team gets paid and you stay compliant.",
    sections: [
      {
        heading: "Payroll Outsourcing Services",
        image: "/images/payroll-premium-overview.jpg",
        paragraphs: [
          "Elite Solutions CPA offers payroll outsourcing services to businesses, allowing them to focus on core operations while ensuring accurate, timely payroll processing. This service helps businesses manage payroll efficiently, ensuring compliance and freeing up resources for innovation and growth.",
        ],
      },
      {
        heading: "What’s included",
        image: "/images/payroll-premium-included.jpg",
        paragraphs: [
          "We handle the full payroll cycle so your team gets paid on time and your records stay clean.",
        ],
        bullets: [
          "Scheduled payroll processing",
          "Tax withholdings and employer filings",
          "Employee pay stubs and records",
          "Onboarding and offboarding support",
        ],
      },
      {
        heading: "What you get",
        image: "/images/payroll-premium-outcomes.jpg",
        paragraphs: [
          "Outsourcing payroll with Elite Solutions helps you stay compliant while your internal team focuses on growth.",
        ],
        bullets: [
          "On-time pay every cycle",
          "Less payroll admin on your plate",
          "Cleaner compliance trail",
        ],
      },
    ],
  },
  {
    slug: "tax",
    pageTitle: "Tax",
    heroBg: "/images/hero-bg-tax.jpg",
    intro: [
      "Elite Solutions CPA offers expert tax services, helping businesses navigate state and federal tax laws.",
    ],
    offerLead:
      "Professional tax services for U.S. businesses — filings, projections, and compliance that help you plan ahead and reduce year-end surprises.",
    sections: [
      {
        heading: "Professional Tax Services for U.S. Businesses",
        paragraphs: [
          "Elite Solutions CPA offers expert tax services, helping businesses navigate state and federal tax laws. Their services include tax return filings, projections, and compliance to ensure businesses save money through tax-efficient strategies while meeting all legal requirements.",
          "Whether you own a corporation, LLC, partnership, or sole proprietorship, Elite Solutions is here to help with all your tax needs. We ensure your tax filings are accurate and efficient.",
        ],
      },
      {
        heading: "What we cover",
        paragraphs: [
          "With in-depth knowledge of both state and federal tax laws, we help your business take full advantage of available opportunities to reduce your tax burden.",
        ],
        bullets: [
          "Business income tax returns",
          "Tax projections and year-end planning",
          "Estimated tax calculations",
          "State income taxes",
          "Sales taxes",
          "Payroll taxes",
          "Responding to IRS notices",
          "Extension forms",
          "Quarterly tax payments",
        ],
      },
    ],
  },
  {
    slug: "cfo-services",
    pageTitle: "CFO Services",
    heroBg: "/images/hero-bg-cfo.jpg",
    intro: [
      "Outsourced CFO services from Elite Solutions CPA provide businesses with in-depth financial analysis, cash flow management, and strategic guidance.",
    ],
    offerLead:
      "Senior finance leadership without a full-time hire — analysis, cash-flow management, and strategic guidance that strengthen overall financial health.",
    sections: [
      {
        heading: "CFO Services",
        paragraphs: [
          "Outsourced CFO services from Elite Solutions CPA provide businesses with in-depth financial analysis, cash flow management, and strategic guidance. These services help businesses identify growth opportunities, set financial goals, and improve overall financial health without the cost of a full-time CFO.",
          "Our CFO services dive deep into your financial data, uncovering actionable opportunities for growth and cost savings. We provide strategic consulting that delivers greater value than hiring a full-time CFO.",
        ],
      },
      {
        heading: "What we cover",
        paragraphs: [
          "Strategic consulting for entrepreneurs and small business owners — focused on cash flow, cost control, and goals that support sustainable growth.",
        ],
        bullets: [
          "Strategic consulting for entrepreneurs and small business owners",
          "Cash flow analysis to optimize revenue management",
          "Identifying areas for cost-cutting and growth",
          "Setting financial goals to ensure business growth",
        ],
      },
    ],
  },
  {
    slug: "audit-and-review",
    pageTitle: "Audit & Review",
    heroBg: "/images/hero-bg-audit.jpg",
    intro: [
      "Effective audits and reviews provide clarity and confidence in your financial performance. Our professional services ensure compliance with regulations while identifying opportunities for improvement.",
    ],
    offerLead:
      "Independent, risk-based audit and review services — external, internal, and IT — so your reports stay accurate, controls improve, and stakeholders can trust the numbers.",
    sections: [
      {
        heading: "Audit & Review",
        paragraphs: [
          "Elite Solutions CPA provides comprehensive audit services, including external audits, internal audits, and IT audits, to evaluate financial accuracy, operational efficiency, and compliance. Their independent and risk-based approach helps businesses identify inefficiencies, improve internal controls, and mitigate risks.",
          "External audits focus on financial statement accuracy and fraud detection, internal audits assess internal controls and compliance, and IT audits ensure the security and effectiveness of IT systems in line with industry standards.",
          "We employ a risk-based audit approach, fully aligned with International Standards, ensuring an efficient and objective audit delivered within the required timeframes. Whether you’re an entrepreneurial start-up, a family-run business, or a large corporate organization, Elite Solutions offers dependable financial advice and timely reporting for all your stakeholders.",
        ],
        bullets: [
          "Audits, reviews, and compilations",
          "Other attestation services",
          "Agreed-upon procedures",
        ],
      },
      {
        heading: "External Audit",
        paragraphs: [
          "Gain a comprehensive understanding of your business’s financial health with the support of top external auditors in the United States. This process typically begins with a detailed review of your accounting records to verify their accuracy. The auditor’s analysis is then compared against the financial statements to determine the true state of your business finances.",
          "External audits help both small and large businesses assess management competence, safeguard investments, identify fraudulent practices, and ensure statutory compliance. At Elite Solutions, we present a transparent and accurate view of your financial statements, align documentation with the appropriate reporting standards, and provide strategic recommendations that support operational improvements.",
        ],
      },
      {
        heading: "Internal Audit",
        paragraphs: [
          "Internal auditing evaluates the effectiveness of your company’s internal controls, financial reporting, and regulatory compliance. Our internal auditors review every facet of the business, from management ethics to departmental operational strategies, and identify inefficiencies in existing controls, policies, and financial systems.",
          "Following a thorough evaluation, internal auditors provide reports and strategies to strengthen internal controls, minimize risks, and boost efficiency. Findings remain independent and accountable to the audit committee, free from conflicts of interest or undue influence.",
        ],
      },
      {
        heading: "Information Technology Audit Services",
        paragraphs: [
          "Our CISA-certified auditors ensure the robustness and security of your IT infrastructure, providing services across industries such as finance, healthcare, and manufacturing — tailored to your specific needs.",
        ],
        bullets: [
          "Understanding business processes and identifying risks",
          "Risk assessment and strategic remediation recommendations",
          "IT general control testing",
          "Compliance testing against industry regulations",
          "SOC 1 and SOC 2 reports",
          "SOX compliance support",
          "Framework implementation (NIST, COSO, COBIT, ISO)",
          "HIPAA, GAAP, and IIA-aligned compliance expertise",
          "SAP system audits",
          "Microsoft 365 CIS benchmark audits",
        ],
      },
      {
        heading: "Deliverables & why choose us",
        paragraphs: [
          "You receive clear findings, practical remediation guidance, and ongoing support — delivered by experienced, client-focused auditors.",
        ],
        bullets: [
          "Detailed audit reports",
          "Consultation on remediation strategies",
          "Ongoing support and guidance",
          "CISA-certified expertise",
          "Industry-specific, tailored solutions",
          "Regulatory compliance focus",
        ],
      },
    ],
  },
  {
    slug: "web-development",
    pageTitle: "Web Development",
    heroBg: "/images/hero-bg-web.jpg",
    intro: [
      "Your website is the heart of your business — it should be beautiful, functional, and built to tell your brand story.",
    ],
    offerLead:
      "Custom, responsive websites that look sharp on every device, reflect your brand, and turn visitors into inquiries.",
    sections: [
      {
        heading: "Web Development",
        image: "/images/web-devices-premium.jpg",
        paragraphs: [
          "At Elite Solutions, we’re dedicated to helping your business thrive with customized non-financial services. As your website is the heart of your business, it should be as beautiful and functional as your online presence matters. From layout and navigation to performance and accessibility, we build sites that feel polished on every screen and stay easy for your team to manage.",
          "We focus on custom web application development for user-friendly, interactive sites. First impressions are made there — let’s create a site that tells your brand story and speaks to your audience. Clear structure, fast load times, and purposeful calls to action help visitors understand what you offer and take the next step with confidence.",
        ],
      },
      {
        heading: "Complete Web Development Solutions",
        paragraphs: [
          "From modern frontends to powerful backends, we build everything you need to bring your ideas to life.",
        ],
        features: [
          {
            icon: "frontend",
            title: "Frontend Development",
            body: "Beautiful, responsive and high-performance user interfaces using modern technologies.",
          },
          {
            icon: "backend",
            title: "Backend Development",
            body: "Robust APIs and scalable server-side solutions with Python, Node.js and more.",
          },
          {
            icon: "database",
            title: "Database Integration",
            body: "Secure and efficient database setup, migration and management (Supabase, PostgreSQL, etc).",
          },
          {
            icon: "fullstack",
            title: "Full Stack Development",
            body: "End-to-end development with modern stacks like Next.js, React, FastAPI and more.",
          },
          {
            icon: "webapp",
            title: "Web Applications",
            body: "Custom web apps tailored to your business needs.",
          },
          {
            icon: "ecommerce",
            title: "E-commerce Solutions",
            body: "Powerful online stores with secure payments and smooth UX.",
          },
          {
            icon: "api",
            title: "API Development",
            body: "RESTful APIs and third-party integrations (OpenAI, Stripe, etc).",
          },
          {
            icon: "deploy",
            title: "Deployment & Support",
            body: "Reliable deployment, monitoring and ongoing support.",
          },
        ],
      },
      {
        heading: "From Idea to Live Website",
        paragraphs: [
          "We keep the process simple, transparent and focused on your goals.",
        ],
        process: [
          {
            icon: "discuss",
            title: "Discuss Your Idea",
            body: "We understand your goals, requirements and vision.",
          },
          {
            icon: "design",
            title: "Design & Plan",
            body: "We create a clean design and development plan for your approval.",
          },
          {
            icon: "develop",
            title: "Develop & Build",
            body: "We build your website using modern technologies and best practices.",
          },
          {
            icon: "launch",
            title: "Launch & Support",
            body: "Your website goes live and we’re here for ongoing support.",
          },
        ],
      },
      {
        heading: "Featured Projects",
        paragraphs: [
          "Take a look at some of the websites we've built for our clients.",
        ],
        ctaLabel: "View All Projects",
        ctaHref: "/portfolio",
        projects: [
          {
            title: "E-Commerce Store",
            description:
              "A premium online store built for smooth browsing, secure checkout, and product storytelling that converts visitors into buyers.",
            image: "/images/project-ecommerce.jpg",
            href: "/portfolio",
            linkLabel: "View project",
          },
          {
            title: "Business Website",
            description:
              "A clean corporate site that presents services clearly, builds trust fast, and makes it easy for prospects to get in touch.",
            image: "/images/project-business.jpg",
            href: "/portfolio",
            linkLabel: "View project",
          },
          {
            title: "SaaS Platform",
            description:
              "A modern product experience with dashboards and workflows designed to help teams track progress and grow with confidence.",
            image: "/images/project-saas.jpg",
            href: "/portfolio",
            linkLabel: "View project",
          },
          {
            title: "Restaurant Website",
            description:
              "An appetizing digital presence that showcases the menu, atmosphere, and brand — ready to drive reservations and orders.",
            image: "/images/project-restaurant.jpg",
            href: "/portfolio",
            linkLabel: "View project",
          },
        ],
      },
    ],
  },
  {
    slug: "graphic-designing",
    pageTitle: "Graphic Designing",
    intro: [
      "Bring your brand to life with innovative, creative, and visually dynamic designs that communicate your message clearly.",
    ],
    offerLead:
      "Logos, promotional materials, and digital content tailored to your identity — designs that captivate and leave a lasting impression.",
    sections: [
      {
        heading: "Graphic Designing",
        paragraphs: [
          "At Elite Solutions, we position you for distinction with bespoke non-financial services. From marketing strategy to online presence, we help grow your brand and keep it at the top of its game.",
          "We work with core design principles — contrast, alignment, repetition, proximity, and hierarchy — to change your brand with stunning, creative visuals that bring it to life.",
        ],
      },
      {
        heading: "We focus on",
        paragraphs: [
          "Every design is tailored to reflect your business’s unique identity and communicate your message effectively.",
        ],
        specialties: [
          {
            title: "Logo creation",
            body: "Marks that capture your brand and stay memorable.",
          },
          {
            title: "Promotional materials",
            body: "Print and campaign assets aligned to your identity.",
          },
          {
            title: "Digital content",
            body: "Visuals that communicate your message clearly online.",
          },
        ],
      },
      {
        heading: "Why choose Elite Solutions",
        paragraphs: [
          "Ready to stand out? Our designers deliver visuals that captivate and make a lasting impact.",
        ],
        steps: [
          {
            title: "Expertise",
            body: "Professionals who excel at creating strong visuals.",
          },
          {
            title: "Customization",
            body: "Every design reflects your unique identity.",
          },
          {
            title: "Results-driven",
            body: "Designs that captivate and leave an impact.",
          },
        ],
      },
    ],
  },
  {
    slug: "marketing-strategies",
    pageTitle: "Marketing Strategies",
    heroBg: "/images/hero-bg-marketing.jpg",
    intro: [
      "We design multi-touch marketing strategies that build brand awareness, accelerate engagement, and drive enduring success.",
    ],
    offerLead:
      "Clear plans for who to reach, where to reach them, and what to say — tailored to your goals and audience.",
    sections: [
      {
        heading: "Marketing Strategy",
        image: "/images/marketing-devices-premium.jpg",
        paragraphs: [
          "At Elite Solutions, we want your business to flourish. We help create brand awareness and development through one-of-a-kind non-financial services. We work on multi-touch marketing strategies — whether crafting a clear plan for your business, improving online visibility, or applying growth techniques that keep your brand top of mind.",
          "Creative design in marketing depends on how you depict and target your audience. The design must focus deeply to bring traffic to your website and includes everything from branding to advertising — so every message feels intentional, consistent, and ready to convert.",
        ],
      },
      {
        heading: "Complete Marketing Solutions",
        paragraphs: [
          "From brand positioning to campaigns and analytics, we build the strategy your business needs to grow with confidence.",
        ],
        features: [
          {
            icon: "brand",
            title: "Brand Strategy",
            body: "A distinctive identity and message that helps your business stand out and stay memorable.",
          },
          {
            icon: "audience",
            title: "Audience Research",
            body: "Clear insight into who you serve, what they care about, and where they engage.",
          },
          {
            icon: "content",
            title: "Content Marketing",
            body: "Useful content that builds trust, improves visibility, and supports every stage of the journey.",
          },
          {
            icon: "social",
            title: "Social Media Strategy",
            body: "Channel plans and creatives that keep your brand active, consistent, and engaging.",
          },
          {
            icon: "campaign",
            title: "Campaign Planning",
            body: "Multi-touch campaigns designed to launch offers, build awareness, and drive action.",
          },
          {
            icon: "analytics",
            title: "Performance Analytics",
            body: "Tracking and reporting that show what works — so decisions stay data-driven.",
          },
          {
            icon: "funnel",
            title: "Funnel Optimization",
            body: "Smoother paths from discovery to inquiry, with clearer CTAs and stronger conversion points.",
          },
          {
            icon: "growth",
            title: "Growth Roadmaps",
            body: "Long-term plans for steady, sustainable growth across channels and seasons.",
          },
        ],
      },
      {
        heading: "From Insight to Impact",
        paragraphs: [
          "We keep the marketing process simple, collaborative, and focused on measurable results.",
        ],
        process: [
          {
            icon: "discuss",
            title: "Discover Your Brand",
            body: "We learn your goals, audience, and competitive landscape.",
          },
          {
            icon: "design",
            title: "Plan Strategy",
            body: "We build a clear marketing plan matched to your budget and priorities.",
          },
          {
            icon: "develop",
            title: "Execute Campaigns",
            body: "We launch content, creatives, and campaigns across the right channels.",
          },
          {
            icon: "launch",
            title: "Measure & Optimize",
            body: "We track performance and refine for stronger engagement and growth.",
          },
        ],
      },
      {
        heading: "Featured Projects",
        paragraphs: [
          "Take a look at some of the marketing work we've delivered for growing brands.",
        ],
        ctaLabel: "View All Projects",
        ctaHref: "/portfolio",
        projects: [
          {
            title: "Brand Identity Campaign",
            description:
              "A full brand refresh with messaging and visuals that made the business feel premium, clear, and ready to scale.",
            image: "/images/marketing-project-brand.jpg",
            href: "/portfolio",
            linkLabel: "View project",
          },
          {
            title: "Social Growth Engine",
            description:
              "A social content system that increased engagement and kept the brand consistent across every post and story.",
            image: "/images/marketing-project-social.jpg",
            href: "/portfolio",
            linkLabel: "View project",
          },
          {
            title: "Product Launch Push",
            description:
              "A coordinated launch campaign across digital and outdoor touchpoints that built awareness fast and drove inquiries.",
            image: "/images/marketing-project-launch.jpg",
            href: "/portfolio",
            linkLabel: "View project",
          },
          {
            title: "Content & Email System",
            description:
              "A content and newsletter program that nurtured leads with useful stories and clear next steps.",
            image: "/images/marketing-project-content.jpg",
            href: "/portfolio",
            linkLabel: "View project",
          },
        ],
      },
    ],
  },
  {
    slug: "seo-services",
    pageTitle: "SEO Services",
    heroBg: "/images/hero-bg-seo.jpg",
    intro: [
      "Boost your visibility, attract the right audience, and grow your business with smart SEO solutions that drive real organic traffic.",
    ],
    offerLead:
      "Proven SEO strategies — keyword research, content optimization, and ongoing tracking — to improve rankings and conversions.",
    sections: [
      {
        heading: "SEO Services",
        image: "/images/seo-devices-premium.jpg",
        paragraphs: [
          "If you are looking for top-rated SEO services near you, Elite Solutions is here to help your business grow. We give personalized support to grow your brand — whether creating an impactful marketing strategy or building a robust online presence — with SEO solutions that boost visibility, attract the right audience, and drive success.",
          "Trigger your online presence and drive real organic traffic with our SEO strategies. From authentic area-wise keyword research to content optimization and ongoing performance tracking, we tailor every plan to your niche and goals — and stay ahead of trends so your rankings keep moving the right way.",
        ],
      },
      {
        heading: "Complete SEO Solutions",
        paragraphs: [
          "From keywords and technical health to content and tracking, we cover everything you need to rank higher and convert more visitors.",
        ],
        features: [
          {
            icon: "audience",
            title: "Keyword Research",
            body: "Area-wise research and targeting that matches how your customers actually search.",
          },
          {
            icon: "frontend",
            title: "On-Page SEO",
            body: "Titles, structure, and page signals optimized so search engines understand your offer.",
          },
          {
            icon: "database",
            title: "Technical SEO",
            body: "Site speed, crawlability, and structure fixes that keep Google able to find and index you.",
          },
          {
            icon: "content",
            title: "Content Optimization",
            body: "Pages and posts shaped to answer buyer intent and earn stronger organic visibility.",
          },
          {
            icon: "brand",
            title: "Local SEO",
            body: "Local presence and map visibility that help nearby customers find your business.",
          },
          {
            icon: "social",
            title: "Link Building",
            body: "Quality authority signals that strengthen trust and support long-term rankings.",
          },
          {
            icon: "analytics",
            title: "Rank Tracking",
            body: "Ongoing performance tracking and adjustments based on real search results.",
          },
          {
            icon: "growth",
            title: "SEO Audits",
            body: "Clear audits that uncover issues, priorities, and the fastest path to growth.",
          },
        ],
      },
      {
        heading: "From Audit to Higher Rankings",
        paragraphs: [
          "We keep SEO simple, transparent, and focused on traffic and conversions that matter.",
        ],
        process: [
          {
            icon: "discuss",
            title: "Audit & Discover",
            body: "We review your site, competitors, and search opportunities.",
          },
          {
            icon: "design",
            title: "Strategy & Keywords",
            body: "We build a keyword and content plan matched to your goals.",
          },
          {
            icon: "develop",
            title: "Optimize & Publish",
            body: "We improve pages, technical health, and on-site signals.",
          },
          {
            icon: "launch",
            title: "Track & Grow",
            body: "We monitor rankings and refine for stronger traffic and conversions.",
          },
        ],
      },
      {
        heading: "Featured Projects",
        paragraphs: [
          "Take a look at some of the SEO results and systems we've built for clients.",
        ],
        ctaLabel: "View All Projects",
        ctaHref: "/portfolio",
        projects: [
          {
            title: "Local Search Growth",
            description:
              "A local SEO program that improved map visibility and brought more nearby customers to the business.",
            image: "/images/seo-project-local.jpg",
            href: "/portfolio",
            linkLabel: "View project",
          },
          {
            title: "E-Commerce Rankings",
            description:
              "Product and category SEO that lifted organic traffic and helped shoppers find the right items faster.",
            image: "/images/seo-project-ecommerce.jpg",
            href: "/portfolio",
            linkLabel: "View project",
          },
          {
            title: "Content Traffic Engine",
            description:
              "A content SEO system that turned search intent into steady organic visits and stronger brand authority.",
            image: "/images/seo-project-content.jpg",
            href: "/portfolio",
            linkLabel: "View project",
          },
          {
            title: "Technical SEO Fix",
            description:
              "A full technical audit and cleanup that improved crawl health, speed, and index coverage.",
            image: "/images/seo-project-technical.jpg",
            href: "/portfolio",
            linkLabel: "View project",
          },
        ],
      },
    ],
  },
  {
    slug: "email-marketing",
    pageTitle: "Email Marketing",
    heroBg: "/images/hero-bg-email.jpg",
    intro: [
      "Personalized email campaigns that connect, convert, and grow your customer base — one of the most effective ways to engage customers.",
    ],
    offerLead:
      "Compelling email content, targeted lists, and measurable campaigns that build loyalty and increase sales.",
    sections: [
      {
        heading: "Email Marketing",
        image: "/images/email-devices-premium.jpg",
        paragraphs: [
          "At Elite Solutions, we're here to help your business thrive. Whether creating smart marketing strategies or building a solid online presence, we provide customized support to grow your brand every step of the way — and email is one of the strongest channels to keep customers connected.",
          "We create personalized email promotions that connect, convert, and grow your customer base. From compelling content to targeted lists and measurable campaigns, we help you engage customers and increase sales with email programs built around your audience and goals.",
        ],
      },
      {
        heading: "Complete Email Marketing Solutions",
        paragraphs: [
          "From welcome flows to promos and reporting, we build email systems that keep your brand in the inbox and your pipeline moving.",
        ],
        features: [
          {
            icon: "content",
            title: "Email Content Creation",
            body: "Personalized copy and layouts that connect with readers and drive clear action.",
          },
          {
            icon: "audience",
            title: "List Building & Segmentation",
            body: "Targeted customer lists so the right message reaches the right people.",
          },
          {
            icon: "campaign",
            title: "Campaign Design",
            body: "On-brand promotional emails for launches, offers, and seasonal pushes.",
          },
          {
            icon: "funnel",
            title: "Automation Flows",
            body: "Welcome, nurture, and follow-up sequences that work while you focus on the business.",
          },
          {
            icon: "brand",
            title: "Newsletter Programs",
            body: "Regular updates that build loyalty and keep your audience engaged over time.",
          },
          {
            icon: "ecommerce",
            title: "Promotional Emails",
            body: "Sales and offer campaigns designed to convert without feeling spammy.",
          },
          {
            icon: "analytics",
            title: "Performance Reporting",
            body: "Open, click, and conversion tracking so every send shows measurable impact.",
          },
          {
            icon: "growth",
            title: "Retention & Loyalty",
            body: "Emails that bring customers back and strengthen long-term relationships.",
          },
        ],
      },
      {
        heading: "From Strategy to Every Send",
        paragraphs: [
          "We keep email marketing simple, tailored, and focused on engagement you can measure.",
        ],
        process: [
          {
            icon: "discuss",
            title: "Define Goals",
            body: "We clarify your audience, offers, and what success should look like.",
          },
          {
            icon: "design",
            title: "Craft & Segment",
            body: "We create content and lists matched to your brand and buyers.",
          },
          {
            icon: "develop",
            title: "Launch Campaigns",
            body: "We set up sends, automations, and schedules ready to go live.",
          },
          {
            icon: "launch",
            title: "Measure & Improve",
            body: "We track results and refine for stronger opens, clicks, and conversions.",
          },
        ],
      },
      {
        heading: "Featured Projects",
        paragraphs: [
          "Take a look at some of the email programs we've built to connect and convert.",
        ],
        ctaLabel: "View All Projects",
        ctaHref: "/portfolio",
        projects: [
          {
            title: "Welcome Series",
            description:
              "An onboarding email flow that introduces the brand and turns new subscribers into engaged customers.",
            image: "/images/email-project-welcome.jpg",
            href: "/portfolio",
            linkLabel: "View project",
          },
          {
            title: "Promo Campaign Pack",
            description:
              "A set of promotional emails that highlight offers clearly and drive stronger click-through and sales.",
            image: "/images/email-project-promo.jpg",
            href: "/portfolio",
            linkLabel: "View project",
          },
          {
            title: "Brand Newsletter",
            description:
              "A recurring newsletter system that keeps audiences informed and builds loyalty month after month.",
            image: "/images/email-project-newsletter.jpg",
            href: "/portfolio",
            linkLabel: "View project",
          },
          {
            title: "Automation Drips",
            description:
              "Automated nurture sequences that follow up at the right time and keep the funnel moving.",
            image: "/images/email-project-automation.jpg",
            href: "/portfolio",
            linkLabel: "View project",
          },
        ],
      },
    ],
  },
  {
    slug: "help-line-services",
    pageTitle: "Help Line Services",
    heroBg: "/images/hero-bg-helpline.jpg",
    intro: [
      "Dedicated helpline support that addresses inquiries, resolves issues quickly, and keeps customers satisfied.",
    ],
    offerLead:
      "Reliable, responsive customer support lines customized to your business — so customers get answers and you build trust.",
    sections: [
      {
        heading: "Help Line Services",
        image: "/images/helpline-devices-premium.jpg",
        paragraphs: [
          "At Elite Solutions, our dedication is directed toward your business success. From building an efficient marketing plan to increasing your online presence, we help you expand and maintain a strong brand for the long term — and great support is part of that promise.",
          "Deliver exceptional customer support and ensure satisfaction with our dedicated helpline services. We provide reliable, responsive assistance that keeps customers supported at all times, resolves issues quickly, and builds trust with every conversation.",
        ],
      },
      {
        heading: "Complete Helpline Solutions",
        paragraphs: [
          "From phone lines and chat to tickets and quality checks, we cover the support channels your customers expect.",
        ],
        features: [
          {
            icon: "campaign",
            title: "Dedicated Support Lines",
            body: "Branded phone support channels ready for customer inquiries and day-to-day questions.",
          },
          {
            icon: "social",
            title: "Live Chat Support",
            body: "Real-time chat help that answers customers quickly while they are already on your site.",
          },
          {
            icon: "content",
            title: "Ticket Management",
            body: "Organized ticket handling so every issue is tracked, prioritized, and closed cleanly.",
          },
          {
            icon: "funnel",
            title: "Quick Issue Resolution",
            body: "Clear processes that resolve problems promptly and keep satisfaction high.",
          },
          {
            icon: "audience",
            title: "Multichannel Support",
            body: "Phone, chat, and email support that feels consistent across every contact point.",
          },
          {
            icon: "deploy",
            title: "After-Hours Coverage",
            body: "Extended or after-hours support so customers are not left waiting when you are offline.",
          },
          {
            icon: "analytics",
            title: "Quality Monitoring",
            body: "Call and chat reviews that protect service quality and improve agent performance.",
          },
          {
            icon: "growth",
            title: "Customer Satisfaction",
            body: "Support experiences designed to build loyalty, trust, and long-term retention.",
          },
        ],
      },
      {
        heading: "From Setup to Seamless Support",
        paragraphs: [
          "We keep helpline onboarding simple, customized, and focused on faster answers for your customers.",
        ],
        process: [
          {
            icon: "discuss",
            title: "Understand Needs",
            body: "We learn your products, common questions, and support priorities.",
          },
          {
            icon: "design",
            title: "Set Up Channels",
            body: "We configure phone, chat, and ticket flows matched to your brand.",
          },
          {
            icon: "develop",
            title: "Train & Launch",
            body: "We prepare scripts, workflows, and agents — then go live with confidence.",
          },
          {
            icon: "launch",
            title: "Monitor & Improve",
            body: "We track response quality and refine support for stronger satisfaction.",
          },
        ],
      },
      {
        heading: "Featured Projects",
        paragraphs: [
          "Take a look at some of the support setups we've delivered for growing teams.",
        ],
        ctaLabel: "View All Projects",
        ctaHref: "/portfolio",
        projects: [
          {
            title: "Phone Support Desk",
            description:
              "A dedicated phone helpline that answers inquiries quickly and keeps customers connected to the brand.",
            image: "/images/helpline-project-phone.jpg",
            href: "/portfolio",
            linkLabel: "View project",
          },
          {
            title: "Live Chat Desk",
            description:
              "Website chat support that resolves questions in real time and reduces drop-off during browsing.",
            image: "/images/helpline-project-chat.jpg",
            href: "/portfolio",
            linkLabel: "View project",
          },
          {
            title: "Ticket Operations",
            description:
              "A ticket system that organizes issues, speeds up resolution, and keeps every request accountable.",
            image: "/images/helpline-project-tickets.jpg",
            href: "/portfolio",
            linkLabel: "View project",
          },
          {
            title: "Customer Success Line",
            description:
              "A success-focused support model that builds trust and turns service moments into loyalty.",
            image: "/images/helpline-project-success.jpg",
            href: "/portfolio",
            linkLabel: "View project",
          },
        ],
      },
    ],
  },
];

/** Tax content adapted from https://elitesolutionusa.com/tax/ */
/** Payroll content adapted from https://elitesolutionusa.com/payroll-outsourcing-services/ */
/** CFO content adapted from https://elitesolutionusa.com/cfo/ */
/** Audit & Review content adapted from https://elitesolutionusa.com/audit-review/ */
/** Web Development content adapted from https://elitesolutionusa.com/web-development/ */
/** Graphic Designing content adapted from https://elitesolutionusa.com/graphic-designing/ */
/** Marketing Strategies content adapted from https://elitesolutionusa.com/marketing-strategies/ */
/** SEO Services content adapted from https://elitesolutionusa.com/seo-services/ */
/** Email Marketing content adapted from https://elitesolutionusa.com/email-marketing/ */
/** Help Line Services content adapted from https://elitesolutionusa.com/help-line-services/ */

export function getServiceDetail(slug: string) {
  return serviceDetails.find((d) => d.slug === slug);
}
