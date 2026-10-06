export const portfolioStudioFilters = [
  { id: "all", label: "All" },
  { id: "finance", label: "Finance" },
  { id: "web", label: "Web Development" },
  { id: "social", label: "Social Media Marketing" },
  { id: "seo", label: "SEO" },
] as const;

export type PortfolioStudioFilterId =
  (typeof portfolioStudioFilters)[number]["id"];

export type PortfolioDetailBlock = {
  heading: string;
  paragraphs?: readonly string[];
  items?: readonly { label: string; text: string }[];
};

export type PortfolioStudioProject = {
  id: string;
  title: string;
  category: Exclude<PortfolioStudioFilterId, "all">;
  categoryLabel: string;
  description: string;
  image: string;
  imageFit?: "cover" | "contain";
  href: string;
  details?: {
    intro: string;
    sections: readonly PortfolioDetailBlock[];
  };
};

export const portfolioStudioPage = {
  hero: {
    eyebrow: "Our Portfolio",
    title: "Our Work Speaks for Itself",
    lead: "Explore some of our recent projects and see how we turn ideas into powerful digital solutions.",
    image: "/images/portfolio-hero-devices.jpg",
  },
  projects: [
    {
      id: "hussain-catering",
      title: "Hussain Catering",
      category: "seo",
      categoryLabel: "SEO",
      description:
        "Halal Hyderabadi restaurant and catering in Lombard, Illinois, with carry-out meals, party trays, and live food stations.",
      image: "/images/hussain-catering-logo.jpg",
      href: "/portfolio",
      details: {
        intro:
          "Hussain Catering & Carry Out is a halal Hyderabadi restaurant and catering business in Lombard, Illinois, that sells carry-out meals, party trays, and live food stations through hussaincatering.com. I provided web development and social media marketing for the restaurant, and I have managed the site's SEO since May 2025, covering technical SEO, on-page optimization, content, link building, and email campaign planning.",
        sections: [
          {
            heading: "The challenge",
            paragraphs: [
              "The brand had loyal customers but little search visibility beyond its own name. In June 2025 the site ranked for only 32 US keywords, just 8 of them on page one. An Ahrefs audit flagged 2,640 issues, including missing alt text, slow pages, missing H1 tags, and internal links pointing to redirects. The backlink profile also carried a large number of spammy links from auto-generated SEO and expired-domain sites.",
            ],
          },
          {
            heading: "What I did",
            items: [
              { label: "Web development", text: "Built and maintained hussaincatering.com so the menu, catering, and ordering pages were ready for customers." },
              { label: "Social media marketing", text: "Handled social media marketing for the restaurant to promote the menu, catering, and offers alongside the website." },
              { label: "Technical SEO", text: "Ran recurring Ahrefs site audits, documented page speed problems on key pages using PageSpeed Insights, fixed redirecting internal links, and tracked indexing in Google Search Console for category, product, and blog pages." },
              { label: "Toxic link cleanup", text: "Identified 149 spammy referring domains and prepared them for disavow." },
              { label: "On-page optimization", text: "Mapped focus and LSI keywords to the homepage, menu, and category pages. Built a product optimization tracker covering 250+ product URLs for meta titles, meta descriptions, alt text, Open Graph tags, and slugs, with a review and approval step." },
              { label: "Content strategy", text: "Built and ran the content calendar and published 78 blog posts on Hyderabadi cuisine, South Indian breakfast, halal catering in Lombard, festival menus, and recipes. Added a structured internal linking plan between posts and updated blogs that started ranking." },
              { label: "Link building", text: "Built 588 live backlinks (483 do-follow) through Web 2.0s, blog commenting, social profiles, directories, business listings, and social bookmarking, plus guest posts on sites including Youth Ki Awaaz (DA 66). Benchmarked the profile against competitors such as Curry Up Now and Rasika." },
              { label: "Reporting", text: "Delivered 18 monthly SEO reports tracking keyword positions, site health, and backlinks." },
              { label: "Email marketing", text: "Used Search Console data to plan a 9-email campaign built around real search demand (BOGO biryani deals, tray sizes, live pani puri stations, halal catering) and tied to the blog calendar." },
            ],
          },
          {
            heading: "Results (June 2025 to September 2026)",
            paragraphs: [
              "Ranking keywords: 32 to 203 (6x growth).",
              "Page one keywords: 8 to 49. Top 3 positions: 4 to 14.",
              "Site audit issues: 2,640 to 976 (63% reduction), with 0 errors.",
              '#1 for all brand terms, including "hussain catering", "hussain catering menu", and "hussain catering lombard".',
              '#2 for "hyderabadi biryani" (6.6K monthly US searches).',
              '#1 for "south indian breakfast recipes" and #3 for "methi chicken curry".',
              "About 4,900 organic clicks in 3 months, 85% of them from mobile.",
              "468 referring domains.",
            ],
          },
          { heading: "Tools", paragraphs: ["Ahrefs, Google Search Console, Google PageSpeed Insights, Google Sheets."] },
        ],
      },
    },
    {
      id: "burger-buz",
      title: "Burger Buz",
      category: "seo",
      categoryLabel: "SEO",
      description:
        "Halal burger restaurant in Lincolnwood, Illinois, serving Skokie and north Chicago with burgers, fries, and bubble tea.",
      image: "/images/Logos/BB.jpg",
      href: "/portfolio",
      details: {
        intro:
          "Burger Buz is a halal burger restaurant in Lincolnwood, Illinois, serving Skokie and north Chicago with burgers, fries, and bubble tea for online ordering at burgerbuz.com. I provided web development and social media marketing for the restaurant, and I handled SEO from the website's launch in August 2025, covering keyword research, on-page optimization, content, link building, technical audits, and email campaign planning.",
        sections: [
          {
            heading: "The challenge",
            paragraphs: [
              "Burger Buz launched as a brand new domain with no rankings and only 8 referring domains, competing locally against national chains such as Smashburger, Red Robin, Steak 'n Shake, and Fatburger. The goal was to build search visibility from zero around two angles the big chains don't own: halal and healthier fast food.",
            ],
          },
          {
            heading: "What I did",
            items: [
              { label: "Web development", text: "Developed burgerbuz.com for launch so customers could browse the menu and order online." },
              { label: "Social media marketing", text: "Handled social media marketing for the restaurant to promote the halal menu and local offers." },
              { label: "Launch setup", text: "Optimized all pages and product categories before launch, then connected the site to Google Search Console and Google Analytics." },
              { label: "Keyword research and competitor analysis", text: 'Benchmarked backlinks, traffic, and keyword footprints of 7 national burger chains, then mapped focus and LSI keywords to every page, targeting terms like "halal burger," "halal fast food," and "halal burger Skokie."' },
              { label: "Content strategy", text: "Built the content calendar and published 29 blog posts on halal certification, healthier fast food, gluten-free and low-carb options, and halal copycat recipes (smash burgers, fried chicken, McChicken-style burgers)." },
              { label: "Link building", text: "Built 364 live backlinks (305 do-follow) through Web 2.0s, directories, social profiles, business listings, and social bookmarking." },
              { label: "Toxic link cleanup", text: "As the site grew it attracted a large volume of spam links, so I identified 472 spammy referring domains and prepared them for disavow." },
              { label: "Technical SEO and reporting", text: "Ran recurring Ahrefs site audits and delivered 11 SEO reports tracking keywords, site health, and backlinks." },
              { label: "Email marketing", text: "Used Search Console data to plan a 9-email July 2026 campaign aimed at keywords with high impressions but few clicks (high-protein fast food, gluten-free burgers, halal burgers in Skokie), with each email linked to a published blog." },
            ],
          },
          {
            heading: "Results",
            paragraphs: [
              "Ranking keywords: 5 to 230 (November 2025 to August 2026).",
              "Page one keywords: 0 to 17.",
              "Referring domains: 8 to 773 (October 2025 to August 2026).",
              "Site audit: 0 errors across 469 crawled URLs.",
              '#1 for all brand terms, including "burger buz," "burger buzz menu," and "burger buzz lincolnwood".',
              '#1 for "gluten free burger patties," "are hamburgers gluten free," and "is hamburger gluten free".',
              '#1 for "high protein fast food options".',
              '#10 for "halal fried chicken" (6.6K monthly US searches) and #5 for "halal fast food franchise usa".',
              "23,000+ impressions and 874 clicks in 3 months, 84% of them from mobile.",
            ],
          },
          { heading: "Tools", paragraphs: ["Ahrefs, Google Search Console, Google Analytics, Google Sheets."] },
        ],
      },
    },
    {
      id: "deccan-delights",
      title: "Deccan Delights USA",
      category: "seo",
      categoryLabel: "SEO",
      description:
        "Hyderabadi and South Asian restaurant in Naperville, Illinois, with online ordering, daily specials, and catering across the Chicago suburbs.",
      image: "/images/Logos/DD.jpg",
      href: "/portfolio",
      details: {
        intro:
          "Deccan Delights USA is a Hyderabadi and South Asian restaurant in Naperville, Illinois, offering online ordering, daily specials, and catering across the Chicago suburbs through deccandelightsusa.com. I provided web development and social media marketing for the restaurant, and I have run the site's SEO since April 2025, starting with a full audit and moving into technical fixes, on-page optimization, content, link building, and email campaign planning.",
        sections: [
          {
            heading: "The challenge",
            paragraphs: [
              "My April 2025 audit found a site with almost no search presence: zero organic traffic, only 5 ranking keywords, and no do-follow backlinks. Ahrefs flagged 6,398 issues and 95 errors, including redirects in the sitemap, mixed HTTP/HTTPS content, 800+ pages with missing alt text or slow load times, and missing H1 tags. The backlink profile contained toxic spam links, while competitors like Curry Up Now, Rasika, and Junoon ranked for thousands of keywords.",
            ],
          },
          {
            heading: "What I did",
            items: [
              { label: "Web development", text: "Developed deccandelightsusa.com for online ordering, daily specials, and catering inquiries." },
              { label: "Social media marketing", text: "Handled social media marketing for the Naperville restaurant to support the menu and catering offers." },
              { label: "SEO audit and roadmap", text: "Delivered a full technical, on-page, and off-page audit with a keyword gap analysis against 6 competitors and a 3-phase action plan." },
              { label: "Technical SEO", text: "Worked through crawl errors, redirects, sitemap issues, and page speed, and tracked indexing for 650+ URLs in Google Search Console." },
              { label: "On-page optimization", text: "Mapped focus and LSI keywords to key pages and optimized product pages with meta titles, meta descriptions, alt text, Open Graph tags, and clean slugs." },
              { label: "Content strategy", text: "Built and ran the content calendar and published 77 blog posts on Hyderabadi cuisine and history, biryani, South Indian vegetarian food, keto and high-protein Indian meals, wedding menus, desserts, and festival food." },
              { label: "Link building", text: "Built 551 live backlinks (444 do-follow) through Web 2.0s, blog commenting, social profiles, directories, business listings, and social bookmarking, plus guest posts on sites including Youth Ki Awaaz (DA 66)." },
              { label: "Toxic link cleanup", text: "Identified 76 spammy referring domains and prepared them for disavow." },
              { label: "Reporting", text: "Delivered 17 SEO reports tracking keyword positions, site health, and backlinks." },
              { label: "Email marketing", text: "Used Search Console data to plan an 11-email July 2026 campaign built around weekly specials, BOGO biryani, family packs, catering, and health-focused dishes." },
            ],
          },
          {
            heading: "Results (June 2025 to September 2026)",
            paragraphs: [
              "Ranking keywords: 5 to 282.",
              "Page one keywords: 0 to 30.",
              "Site audit issues: 6,398 to 1,012 (84% reduction). Errors: 95 to 0. Health score: 96 to 100.",
              "Backlink profile: from zero do-follow backlinks to 410 referring domains.",
              '#1 for all brand terms, including "deccan delights," "deccan delight menu," and "deccan delights naperville menu".',
              '#1 for "hyderabadi cuisine" (up from #26) and "hyderabadi food" (up from #10).',
              '#1 for "south indian vegetarian cuisine," "keto indian dishes," "low carb indian meals," and "indian food at wedding".',
              '#3 for "paradise biryani hyderabad".',
              "38,000+ impressions and 1,131 clicks in 3 months, 76% of them from mobile.",
            ],
          },
          { heading: "Tools", paragraphs: ["Ahrefs, Google Search Console, Google Sheets."] },
        ],
      },
    },
    {
      id: "fusion-food",
      title: "Fusion Food",
      category: "seo",
      categoryLabel: "SEO",
      description:
        "Halal Pakistani and Memon restaurant in San Antonio, Texas, known for biryani, karahi, nihari, weekday specials, and wedding catering.",
      image: "/images/Logos/FF.jpg",
      href: "/portfolio",
      details: {
        intro:
          "Fusion Food SA is a halal Pakistani and Memon restaurant in San Antonio, Texas, known for biryani, karahi, nihari, weekday specials, and wedding and event catering. Its website, fusionfoodsa.com, drives menu views, orders, and catering inquiries. I provided web development and social media marketing for the restaurant, and I have managed the site's SEO since June 2025, starting with an audit and continuing through technical fixes, on-page optimization, content, link building, and email campaign planning.",
        sections: [
          {
            heading: "The challenge",
            paragraphs: [
              'The June 2025 audit showed a small site with a thin footprint: 53 ranking keywords, Domain Authority 5, and 51 do-follow backlinks. Local competitors had similar or stronger link profiles. The site was missing visibility for high-intent local searches like "halal food san antonio" and "pakistani restaurant san antonio," and the site audit flagged missing meta descriptions, missing alt text, slow pages, incomplete Open Graph tags, and crawl errors.',
            ],
          },
          {
            heading: "What I did",
            items: [
              { label: "Web development", text: "Developed fusionfoodsa.com so guests could view the menu, place orders, and send catering inquiries." },
              { label: "Social media marketing", text: "Handled social media marketing for the San Antonio restaurant to promote dishes, specials, and catering." },
              { label: "SEO audit and competitor analysis", text: "Audited technical, on-page, and off-page SEO and benchmarked traffic, rankings, and backlinks against 5 local competitors." },
              { label: "Technical and on-page SEO", text: "Ran recurring Ahrefs audits to resolve crawl errors, meta description gaps, and alt text issues, and confirmed indexing of all published pages in Google Search Console." },
              { label: "Content strategy", text: "Built the content calendar and published 22 blog posts on Memon and Pakistani cuisine, biryani, wedding food, tandoori cooking, desserts, and Indian-American fusion dishes." },
              { label: "Link building", text: "Built 287 live backlinks (269 do-follow) through Web 2.0s, blog commenting, social profiles, directories, business listings, and social bookmarking." },
              { label: "Toxic link cleanup", text: "Identified 92 spammy referring domains and prepared them for disavow." },
              { label: "Reporting", text: "Delivered 12 monthly SEO reports tracking keyword positions, site health, and backlinks." },
              { label: "Email marketing", text: 'Used Search Console data to plan an 8-email July 2026 campaign. It targeted dishes with thousands of impressions but few clicks ("pakistani biryani near me," "nihari near me," "pakistani haleem near me"), under-promoted weekday specials, and Memon wedding catering.' },
            ],
          },
          {
            heading: "Results (June 2025 to September 2026)",
            paragraphs: [
              "Ranking keywords: 53 to 187 (3.5x growth).",
              "Referring domains: 404, up from 51 do-follow backlinks at the start.",
              "Site audit: crawl errors cut from 3 to 0, with a 98 health score.",
              '#1 for "fusion food san antonio"; #2 for "fusion food san antonio menu" and "fusion san antonio".',
              '#3 for "fusion food menu" and #4 for "food fusion restaurant".',
              '#5 for 4 variations of "pakistani restaurant san antonio".',
              '"memon cuisine" climbed from #54 to #7 in one month.',
              '"indian fusion street food" climbed from #47 to #15.',
            ],
          },
          { heading: "Tools", paragraphs: ["Ahrefs, Google Search Console, Google Sheets."] },
        ],
      },
    },
    {
      id: "karachi-restaurant",
      title: "Karachi Restaurant",
      category: "seo",
      categoryLabel: "SEO",
      description:
        "Halal Pakistani restaurant in Milwaukee, Wisconsin, serving Karachi-style biryani, karahi, nihari, seafood, desserts, and catering trays.",
      image: "/images/Logos/KR.jpg",
      href: "/portfolio",
      details: {
        intro:
          "Karachi Restaurant is a halal Pakistani restaurant in Milwaukee, Wisconsin, serving Karachi-style biryani, karahi, nihari, seafood, desserts, and catering trays through karachirestaurantwi.com. The business was formerly known as Anmol Restaurant, and I provided web development and social media marketing for the restaurant, and I took on SEO in early 2026 to launch the new brand online without losing the loyal customers who still searched for the old name.",
        sections: [
          {
            heading: "The challenge",
            paragraphs: [
              'In March 2026 the new domain had zero ranking keywords and zero referring domains. The old name, "Anmol," held years of search demand ("anmol restaurant" and "anmol milwaukee" alone get 2,000+ US searches a month), while the new brand had to compete with similarly named Karachi restaurants across the US. The first site audit also flagged 200+ slow pages, 200+ internal links pointing to redirects, and missing meta descriptions.',
            ],
          },
          {
            heading: "What I did",
            items: [
              { label: "Web development", text: "Developed karachirestaurantwi.com for the new brand so the menu, ordering, and catering pages replaced the old Anmol presence." },
              { label: "Social media marketing", text: "Handled social media marketing for the Milwaukee restaurant to introduce the new name and promote the menu." },
              { label: "Keyword research", text: 'Built a research set of 115 keywords covering the new brand, the old Anmol name, local terms such as "halal restaurants milwaukee" and "pakistani restaurant milwaukee," and dish searches.' },
              { label: "Rebrand SEO", text: 'Positioned the site around both names ("formerly Anmol Restaurant") so the new brand could rank while customers searching the old name still found the restaurant.' },
              { label: "Technical and on-page SEO", text: "Ran recurring Ahrefs site audits and worked through slow pages, redirect issues, and meta tag gaps." },
              { label: "Content strategy", text: "Built the content calendar and published 12 blog posts written for Pakistani-American families in Wisconsin, covering Karachi biryani, chai culture, siri paya, jalebi and kulfi, and holiday menus." },
              { label: "Link building", text: "Built 40 live backlinks (31 do-follow) through social profiles, Web 2.0s, social bookmarking, and business listings." },
              { label: "Reporting", text: "Delivered 6 monthly SEO reports tracking rankings, site health, and backlinks." },
              { label: "Email marketing", text: "Used Search Console data to plan a 9-email July 2026 campaign. It reinforced the Anmol-to-Karachi name change, promoted family trays and catering, and tied into the blog's seafood series and seasonal days like National Mango Day." },
            ],
          },
          {
            heading: "Results (March 2026 to September 2026)",
            paragraphs: [
              "Ranking keywords: 0 to 94 in 6 months.",
              "Page one keywords: 0 to 17. Top 3 positions: 0 to 5.",
              "Referring domains: 0 to 367.",
              '#1 for "karachi restaurant" (1.3K monthly US searches), up from #17 in July.',
              '#3 for "milwaukee pakistani restaurant," #6 for "pakistani restaurant milwaukee wi," and #7 for "pakistani restaurant milwaukee" (up from #70 in April).',
              '"karachi kitchen restaurant" (480 searches) climbed from #33 to #7 in one month.',
              'Old brand terms "anmol restaurant" and "anmol restaurant milwaukee" kept on page one during the transition.',
              "925 clicks in 3 months, about 80% of them from mobile.",
            ],
          },
          { heading: "Tools", paragraphs: ["Ahrefs, Semrush, Google Search Console, Google Sheets."] },
        ],
      },
    },
    {
      id: "raja-bazaar",
      title: "Raja Bazaar",
      category: "seo",
      categoryLabel: "SEO",
      description:
        "Zabiha halal meat and South Asian grocery store serving Milwaukee and Brookfield, Wisconsin, with an online product catalog.",
      image: "/images/Logos/RB.jpg",
      href: "/portfolio",
      details: {
        intro:
          "Raja Bazaar is a zabiha halal meat and South Asian grocery store serving Milwaukee and Brookfield, Wisconsin, with an online product catalog at rajabazaarwi.com. I provided web development and social media marketing for the store, and I took on the store's SEO in early 2026 with two goals: make a large product catalog search-friendly, and build visibility beyond people who already knew the store by name.",
        sections: [
          {
            heading: "The challenge",
            paragraphs: [
              'In April 2026 the site ranked for only 4 keywords and had no referring domains. Product pages were missing optimized meta tags, and the first full site audit in May found 210 errors, including 70 broken product pages (404s) still listed in the XML sitemap. Search Console showed the store was nearly invisible for category searches like "indian grocery near me," "halal meat milwaukee," and "indian grocery store milwaukee," ranking anywhere from 9th to 68th.',
            ],
          },
          {
            heading: "What I did",
            items: [
              { label: "Web development", text: "Developed rajabazaarwi.com so the halal meat and grocery catalog could be browsed online." },
              { label: "Social media marketing", text: "Handled social media marketing for the Milwaukee and Brookfield store to promote products and the catalog." },
              { label: "Product page optimization", text: "Rewrote meta titles and descriptions for 236 product pages across meat, seafood, spices, vegetables, and grocery items, and tracked product image updates by category." },
              { label: "Technical SEO", text: "Ran Ahrefs site audits and flagged 70 broken product URLs and sitemap errors for cleanup, along with missing H1 and alt text issues." },
              { label: "Link building", text: "Built 28 live backlinks (20 do-follow) through social profiles, social bookmarking, and Web 2.0s to give the new domain a base of local and brand citations." },
              { label: "Search Console analysis", text: "Broke down 3 months of query, page, and device data to separate branded demand from category searches the site needed to win." },
              { label: "Reporting", text: "Delivered 5 monthly SEO reports tracking rankings, site health, and backlinks." },
              { label: "Email marketing", text: "Used that Search Console analysis to plan an 8-email July 2026 campaign for zabiha meat, grocery staples, and repeat orders. The plan also recommended local SEO steps to close the category-search gap." },
            ],
          },
          {
            heading: "Results (April 2026 to September 2026)",
            paragraphs: [
              "Search impressions more than tripled in 3 months (978 to 3,087 per month).",
              "Average Google position improved from 11.6 to 5.9.",
              "Ranking keywords: 4 to 20. Page one keywords: 3 to 5.",
              "Referring domains: 0 to 352.",
              '#1 for "raja bazaar" and top 3 for "raja bazar," "raja bazaar milwaukee," and "raja bazar milwaukee".',
              '#6 for "raja meat," #8 for "raja mart," and #9 for "raja market".',
              '"milwaukee indian stores" (320 monthly searches) moved from #46 to #31.',
            ],
          },
          { heading: "Tools", paragraphs: ["Ahrefs, Google Search Console, Google Sheets."] },
        ],
      },
    },
    {
      id: "butt-karahi",
      title: "Butt Karahi",
      category: "seo",
      categoryLabel: "SEO",
      description:
        "Halal Pakistani and Punjabi restaurant on Devon Avenue in Chicago, serving karahi, BBQ, tandoori, biryani, nihari, and haleem.",
      image: "/images/Logos/BT.jpg",
      href: "/portfolio",
      details: {
        intro:
          "Butt Karahi is a halal Pakistani and Punjabi restaurant on Devon Avenue, Chicago's best-known South Asian food street, serving karahi, BBQ, tandoori, biryani, nihari, and haleem through an online ordering site at buttkarahidevon.com. I provided web development and social media marketing for the restaurant, and I set up the restaurant's SEO and content strategy from the ground up in mid-2026.",
        sections: [
          {
            heading: "The challenge",
            paragraphs: [
              'The website launched with no organic visibility: zero ranking keywords and zero referring domains in August 2026. Devon Avenue is packed with established Pakistani and Indian restaurants, so the site needed a clear keyword plan, a technically clean foundation, and a steady content engine to compete for searches like "pakistani restaurant chicago" and "karahi near me."',
            ],
          },
          {
            heading: "What I did",
            items: [
              { label: "Web development", text: "Developed buttkarahidevon.com so guests could browse the menu and order online from Devon Avenue." },
              { label: "Social media marketing", text: "Handled social media marketing for the Chicago restaurant to promote karahi, BBQ, and daily dishes." },
              { label: "Keyword mapping", text: 'Assigned focus and LSI keywords to 14 pages, including the homepage and every menu category (signature karahi, grilled, appetizers, rice, breakfast, desserts, and more), targeting terms such as "pakistani restaurant chicago," "karahi near me," and "chicken karahi near me."' },
              { label: "Technical SEO", text: "Troubleshot Yoast SEO on the WooCommerce shop page and ran Ahrefs site audits to keep the site at a 100 health score with 0 errors." },
              { label: "Google Business Profile", text: "Worked through menu issues on the restaurant's Google Business Profile to improve local search accuracy." },
              { label: "12-month content calendar", text: "Built a September 2026 to August 2027 calendar with 48 planned pieces across 5 content pillars (dish spotlights, US holidays, Ramadan and Eid, catering, and local SEO blogs). Each piece is mapped to a target keyword, search volume, platform (blog, Instagram, Facebook, Google Business Profile, email), and call to action." },
              { label: "Brand and social media", text: "Developed the brand tagline and created a social media requirements brief covering brand assets, menu, photography, offers, delivery platforms, and reviews to guide the team's content production." },
              { label: "Link building", text: "My team built 32 live backlinks (23 do-follow) through social bookmarking, Web 2.0s, and blog commenting, each pointing to a specific menu category." },
            ],
          },
          {
            heading: "Results (first month, August to September 2026)",
            paragraphs: [
              "Ranking keywords: 0 to 6 within the first month of indexing.",
              "Site health: 100 score with 0 errors across 290 crawled URLs.",
              "14 pages keyword-mapped across the full menu.",
              "First 4 pieces from the content calendar published.",
            ],
          },
          { heading: "Tools", paragraphs: ["Ahrefs, Google Search Console, Google Business Profile, WooCommerce, Yoast SEO, Google Sheets."] },
        ],
      },
    },
    {
      id: "baithak-of-punjab",
      title: "Baithak of Punjab",
      category: "seo",
      categoryLabel: "SEO",
      description:
        "Halal Pakistani and Punjabi restaurant in Milwaukee, Wisconsin, known for its buffet, BBQ, karahi, vegetarian dishes, and fresh Punjabi breads.",
      image: "/images/Logos/BP.jpg",
      href: "/portfolio",
      details: {
        intro:
          "Baithak of Punjab is a halal Pakistani and Punjabi restaurant in Milwaukee, Wisconsin, known for its buffet, BBQ, karahi, vegetarian dishes, and fresh Punjabi breads, with online ordering at dineatbaithak.com. I provided web development and social media marketing for the restaurant, and I managed the site's SEO from October 2025 to April 2026, covering technical fixes, keyword mapping, content, link building, and early Generative Engine Optimization (GEO).",
        sections: [
          {
            heading: "The challenge",
            paragraphs: [
              'In October 2025 the site ranked for only 8 keywords, just 1 of them on page one, and had 7 referring domains. An Ahrefs audit flagged 3,948 issues, including 1,598 slow pages, 155 internal links pointing to redirects, overly long titles, and missing H1 and meta description tags. The restaurant was not ranking for its own brand variations or for local searches like "pakistani restaurant milwaukee."',
            ],
          },
          {
            heading: "What I did",
            items: [
              { label: "Web development", text: "Developed dineatbaithak.com so guests could browse the menu and order online." },
              { label: "Social media marketing", text: "Handled social media marketing for the Milwaukee restaurant to promote the buffet, BBQ, and vegetarian dishes." },
              { label: "Keyword mapping", text: 'Assigned focus and LSI keywords to the homepage and each menu category, covering brand variations ("baithak restaurant," "desi bethak menu"), local terms, and cuisine searches like "punjabi cuisine" and "punjabi vegetarian dishes."' },
              { label: "Technical SEO", text: "Ran recurring Ahrefs audits and worked through page speed and redirect issues, and got almost every page indexed on Google." },
              { label: "Content strategy", text: "Built the content calendar and published blog posts on the history of Punjabi cuisine, Punjabi vegetarian dishes, Punjabi breads and kulcha, Pakistani Punjabi feasts, and home recipes like palak paneer." },
              { label: "Link building", text: "Built 200 live backlinks (189 do-follow) through Web 2.0s, directories, social profiles, business listings, and social bookmarking, each pointing to a target menu category." },
              { label: "Generative Engine Optimization", text: "Created 20 shareable conversations on AI platforms including Perplexity, Grok, Mistral, Kimi, and iAsk, linking the restaurant's brand and menu pages to cuisine searches, to build visibility in AI search results." },
              { label: "Reporting", text: "Delivered 6 SEO reports, including a final summary covering technical, on-page, and off-page progress." },
            ],
          },
          {
            heading: "Results (October 2025 to April 2026)",
            paragraphs: [
              "Ranking keywords: 8 to 159 in 6 months (nearly 20x).",
              "Page one keywords: 1 to 17; Top 3 positions: 1 to 3.",
              "Site audit issues: 3,948 to 930 (76% reduction), with slow pages cut from 1,598 to 172.",
              '#1 for "pakistani restaurant milwaukee," "baithak of punjab milwaukee," and "baithak of punjab menu".',
              '#4 for "punjabi kitchen" (3.6K monthly US searches).',
              '#5 for "pakistani restaurant milwaukee wi"; #6 for "baithak restaurant" (590 searches).',
              '#8 for "punjabi vegetarian dishes" and #10 for "punjabi cuisine" (880 searches).',
            ],
          },
          { heading: "Tools", paragraphs: ["Ahrefs, Google Search Console, Google Sheets."] },
        ],
      },
    },
    {
      id: "boss-cash-cars",
      title: "BossCashCars",
      category: "seo",
      categoryLabel: "SEO",
      description:
        "Junk car buying and removal service covering Metro Atlanta and Middle Georgia, paying cash on the spot for old, damaged, and non-running vehicles, with free towing and same-day pickup.",
      image: "/images/Logos/BCC.jpg",
      href: "/portfolio",
      details: {
        intro:
          "BossCashCars is a junk car buying and removal service covering Metro Atlanta and Middle Georgia. It pays cash on the spot for old, damaged, and non-running vehicles, with free towing and same-day pickup. I have run the company's search marketing since March 2025, covering Google Ads, a full SEO audit, local landing pages, content, link building, and analytics.",
        sections: [
          {
            heading: "The challenge",
            paragraphs: [
              "Junk car buying is one of the most competitive local service niches in the US, dominated by national brands like Peddle, Pick-n-Pull, and US Junk Cars. My March 2025 audit found crawl errors, slow pages, duplicate meta descriptions, missing location content, and toxic backlinks, with the site ranking for only 47 keywords and none on page one. The business needed leads quickly while organic visibility was built over the long term.",
            ],
          },
          {
            heading: "What I did",
            items: [
              { label: "Google Ads", text: "Researched keywords in Keyword Planner and ran weekly-optimized search campaigns. I reviewed search term reports each week to add winning terms and exclude wasted spend." },
              { label: "SEO audit and competitor research", text: "Delivered a full technical, on-page, and off-page audit with a keyword gap analysis. I then analyzed the backlink profiles of 30+ competitors and built a list of 77 guest post opportunities." },
              { label: "Local landing pages", text: "Published 46 city-specific pages covering title and paperwork questions for each city in the service area (Atlanta, Marietta, Lawrenceville, Decatur, Macon, Warner Robins, and more), supporting the existing junk car removal page for each city." },
              { label: "Content strategy", text: "Published 106 blog posts on selling junk cars, title and paperwork questions, payouts, auto recycling, and car parts." },
              { label: "Link building", text: "Built 878 live backlinks through Web 2.0s, directories, blog commenting, social profiles, business listings, and forums, plus guest posts on TechBullion (DA 71) and Youth Ki Awaaz (DA 66)." },
              { label: "Toxic link cleanup", text: "Identified 450 spammy referring domains and prepared them for disavow." },
              { label: "Technical SEO and analytics", text: "Ran PageSpeed tests on 23 key pages and tracked user behavior in Google Analytics. The tracking showed visitors scrolling to phone numbers rather than submitting forms, which shaped lead-tracking recommendations." },
              { label: "Reporting and email", text: "Delivered 22 SEO reports and planned an 11-email July 2026 campaign built around hyper-local city demand from Search Console." },
            ],
          },
          {
            heading: "Results — Google Ads",
            paragraphs: [
              "424 conversions from 2,074 clicks, a 20.4% conversion rate.",
              "$9.22 average cost per conversion on $3,910 in spend.",
              "5.2% click-through rate across 39,500+ impressions.",
              'Top keyword "we buy junk cars" drove 175 conversions at $8.31 each.',
            ],
          },
          {
            heading: "Results — SEO (March 2025 to September 2026)",
            paragraphs: [
              "Ranking keywords: 47 to 113.",
              "Referring domains grown to 497.",
              '#1 for brand searches ("boss cash cars," 41% CTR).',
              '11,000+ search impressions across local city terms, with "junk car removal lithonia ga" at #12.',
            ],
          },
          { heading: "Tools", paragraphs: ["Google Ads, Keyword Planner, Ahrefs, Semrush, Google Search Console, Google Analytics, PageSpeed Insights."] },
        ],
      },
    },
    {
      id: "cashingcarz-orlando",
      title: "CashingCarz Orlando",
      category: "seo",
      categoryLabel: "SEO",
      description:
        "Central Florida expansion of the CashingCarz junk car buying brand, paying cash for old, damaged, wrecked, and non-running vehicles, with free towing and same-day pickup across Greater Orlando.",
      image: "/images/Logos/CC.jpg",
      href: "/portfolio",
      details: {
        intro:
          "CashingCarz Orlando is the Central Florida expansion of the CashingCarz junk car buying brand. It pays cash for old, damaged, wrecked, and non-running vehicles, with or without a title, and offers free towing and same-day pickup across Greater Orlando. I provided web development and social media marketing for the Orlando brand, and I took on SEO for the brand-new domain, cashingcarzorlando.com, at launch in spring 2026 to build local search visibility from zero.",
        sections: [
          {
            heading: "The challenge",
            paragraphs: [
              "In May 2026 the site had no ranking keywords and no referring domains, and it was entering a crowded local market of established cash-for-cars buyers. It needed a local SEO structure that could cover dozens of Central Florida cities, plus a content and authority base to move a new domain off the back pages of Google.",
            ],
          },
          {
            heading: "What I did",
            items: [
              { label: "Web development", text: "Developed cashingcarzorlando.com so sellers could request a cash offer and schedule free towing." },
              { label: "Social media marketing", text: "Handled social media marketing for the Orlando brand to promote cash offers, free towing, and same-day pickup." },
              { label: "Local SEO architecture", text: 'Mapped focus keywords, meta titles, and meta descriptions for 26 city landing pages, covering Orlando, Kissimmee, Winter Park, Sanford, Lake Mary, Daytona Beach, Melbourne, Lakeland, and more. Each page targets a "junk car removal [city] FL" search.' },
              { label: "On-page optimization", text: "Wrote meta tags and focus keywords for the homepage and every core service page, including selling, donating, getting an offer, the referral program, testimonials, and the blog." },
              { label: "Content strategy", text: "Published 14 blog posts on seasonal and practical topics, such as selling a wrecked car, same-day vs. scheduled removal, avoiding scams, and car values for junk vehicles." },
              { label: "Technical SEO", text: "Ran recurring Ahrefs site audits to keep the new site at a 100 health score with 0 errors." },
              { label: "Toxic link cleanup", text: "Identified 51 spammy referring domains and prepared them for disavow." },
              { label: "Search Console analysis and email", text: 'Analyzed early Search Console data, which showed 94% mobile traffic and real Orlando demand still sitting on pages 6 to 10. I used it to plan an 11-email July 2026 campaign, with list growth as the main lever while SEO matures. The campaign covered Orlando neighborhoods, "running or not" and no-title offers, and Florida storm season.' },
              { label: "Reporting", text: "Delivered monthly SEO reports tracking rankings, site health, and backlinks." },
            ],
          },
          {
            heading: "Results (May 2026 to September 2026, first 4 months)",
            paragraphs: [
              "Ranking keywords: 0 to 22.",
              "Referring domains: 0 to 348.",
              'First page-two ranking: #13 for "sell my car orlando fl".',
              '"cash for cars orlando fl" climbed from #72 to #34 in one month.',
              "Site health: 100 score with 0 errors across 150 crawled URLs.",
              "26 city landing pages live and optimized across Central Florida.",
            ],
          },
          { heading: "Tools", paragraphs: ["Ahrefs, Google Search Console, Google Analytics, Google Sheets."] },
        ],
      },
    },
    {
      id: "cashingcarz",
      title: "CashingCarz",
      category: "seo",
      categoryLabel: "SEO",
      description:
        "Cash-for-junk-cars and auto recycling service in the Dallas-Fort Worth metro, buying old, damaged, salvage, and non-running vehicles with instant cash offers, free towing, and same-day pickup.",
      image: "/images/Logos/CC.jpg",
      href: "/portfolio",
      details: {
        intro:
          "CashingCarz is a cash-for-junk-cars and auto recycling service based in the Dallas-Fort Worth metro. It buys old, damaged, salvage, and non-running vehicles with instant cash offers, free towing, and same-day pickup. I have run the site's SEO since April 2025, starting with a full audit and building out local pages, content, link building, Google Ads, and lead tracking.",
        sections: [
          {
            heading: "The challenge",
            paragraphs: [
              'The junk car niche is dominated by national players like Peddle, Copart, Pick-n-Pull, and CashForCars.com. My April 2025 audit found weak keyword targeting for high-intent "sell my car for cash" searches, no localized pages, slow pages, and missing schema. By June 2025 the site ranked for 85 keywords, none of them on page one.',
            ],
          },
          {
            heading: "What I did",
            items: [
              { label: "SEO audit and competitor research", text: "Delivered a full technical, on-page, and off-page audit with a keyword gap analysis. I then analyzed organic and backlink data for 14 competitors, from Cars.com and Copart to local Dallas buyers, and built guest post opportunity lists from their link profiles." },
              { label: "Local landing pages", text: 'Published 26 city service pages across DFW (Dallas, Irving, Garland, Grand Prairie, Mesquite, Richardson, Carrollton, and more), plus companion "How to Get Your Title in [City]" guides targeting the high-demand no-title niche.' },
              { label: "On-page optimization", text: "Wrote focus keywords, meta titles, and meta descriptions for 46 key pages." },
              { label: "Content strategy", text: "Published 115 blog posts on selling junk cars, title and paperwork questions, payouts, and auto recycling." },
              { label: "Link building", text: "Built 795 live backlinks (647 do-follow) through Web 2.0s, directories, blog commenting, social profiles, forums, and business listings, plus guest posts on TechBullion (DA 71) and Youth Ki Awaaz (DA 66)." },
              { label: "Toxic link cleanup", text: "Identified 173 spammy referring domains and prepared them for disavow." },
              { label: "Google Ads", text: "Ran weekly-optimized search campaigns built on Keyword Planner research. The April 2025 campaign delivered 212 conversions in 3 weeks at under $5 per conversion." },
              { label: "Tracking and reporting", text: "Used Google Tag Manager and Google Analytics to track form submissions and engagement, delivered 20+ SEO reports, and planned an 11-email July 2026 campaign built on Search Console demand." },
            ],
          },
          {
            heading: "Results (June 2025 to September 2026)",
            paragraphs: [
              "Ranking keywords: 85 to 613 (7x growth).",
              "Page one keywords: 0 to 56; Top 3 positions: 0 to 6.",
              "182 more keywords in positions 11 to 20, ready to break onto page one.",
              "Referring domains grown to 455.",
              '#1 for "junk car buyers near me for cash" and "buy junk cars near me for cash".',
              '#2 for "no title junk car buyers" and "junk car removal no title" (1K monthly US searches each).',
              '#2 for "junk car for money" and "junk vehicle buying for cash".',
              '"junk car cash" (480 searches) climbed from #14 to #7.',
              "Site health maintained at 100 with 0 errors.",
            ],
          },
          { heading: "Tools", paragraphs: ["Ahrefs, Semrush, Google Search Console, Google Analytics, Google Tag Manager, Google Ads, Keyword Planner."] },
        ],
      },
    },
    {
      id: "cleanout-junkers",
      title: "Cleanout Junkers",
      category: "seo",
      categoryLabel: "SEO",
      description:
        "Residential and commercial junk removal company serving the Dallas-Fort Worth area, offering home cleanouts, garage and backyard clearing, warehouse cleanouts, and junk car disposal.",
      image: "/images/Logos/Junkers.jpg",
      href: "/portfolio",
      details: {
        intro:
          "Cleanout Junkers is a residential and commercial junk removal company serving the Dallas-Fort Worth area, offering home cleanouts, garage and backyard clearing, warehouse cleanouts, and junk car disposal through cleanoutjunkers.com. I provided web development and social media marketing for the company, and I took on SEO for the newly launched site in 2026 to build its search foundation from scratch.",
        sections: [
          {
            heading: "What I did",
            items: [
              { label: "Web development", text: "Developed cleanoutjunkers.com so homeowners and businesses could request junk removal and cleanouts." },
              { label: "Social media marketing", text: "Handled social media marketing for the Dallas-Fort Worth company to promote home, garage, and warehouse cleanouts." },
              { label: "On-page setup", text: 'Wrote focus keywords, meta titles, and meta descriptions for the core pages, positioning the homepage around "junk removal services" in DFW.' },
              { label: "Technical SEO", text: "Set up Ahrefs site monitoring and kept the site at a 100 health score with 0 errors during launch." },
              { label: "Off-page foundation", text: "Built the site's first do-follow backlinks through social bookmarking and Web 2.0 properties, and planned a guest post targeting junk car disposal." },
              { label: "Search Console and analytics review", text: 'Analyzed early search data to find the first demand signals, such as "clean outs fort worth" and "warehouse cleanouts," and used them to shape the service focus.' },
              { label: "Email marketing", text: "Planned a 5-email July 2026 campaign to generate leads while organic search matures. The campaign covered a brand launch, summer residential cleanouts, cash for junk cars, B2B warehouse cleanouts, and a back-to-school declutter offer, with targets for open rate, replies, and quote requests." },
            ],
          },
          { heading: "Tools", paragraphs: ["Ahrefs, Google Search Console, Google Analytics, Google Sheets."] },
        ],
      },
    },
    {
      id: "red-photo-booths",
      title: "Red Photo Booths",
      category: "seo",
      categoryLabel: "SEO",
      description:
        "Dallas-Fort Worth event entertainment company offering 360 video booths, GlamBot, mirror booths, green screen, roaming photography, and branded corporate activations.",
      image: "/images/Logos/RPB.jpg",
      href: "/portfolio",
      details: {
        intro:
          "Red Photo Booths is a Dallas-Fort Worth event entertainment company in business since 2014, offering 360 video booths, GlamBot, mirror booths, green screen, roaming photography, and branded corporate activations. I provided web development and social media marketing for the company, and I took over SEO in July 2026 at a critical point: the site was losing rankings and the business was repositioning from consumer photo booth rentals toward corporate events and brand activations.",
        sections: [
          {
            heading: "The challenge",
            paragraphs: [
              'My July 2026 Semrush audit found US organic traffic down 30% and ranking keywords down 11%. "360 photo booth" (12,100+ monthly searches) fell from #6 to #26 in under three weeks, and "professional photo booth" dropped from #2 out of the top 100. At the same time, 24% of the sampled backlinks came from a spam/PBN network built up in the previous two weeks, worse than any competitor (0 to 10%). The site also had a 5.8-second homepage load, duplicate H1 tags, missing alt text, and a generic homepage title. Its Authority Score of 19 was low for a 12-year-old business, and it had zero keyword presence outside DFW, while competitors ran multi-city footprints.',
            ],
          },
          {
            heading: "What I did",
            items: [
              { label: "Web development", text: "Developed the company website so clients could review booth packages and request corporate activations." },
              { label: "Social media marketing", text: "Handled social media marketing for the Dallas-Fort Worth brand to promote 360 booths, GlamBot, and corporate events." },
              { label: "SEO audit and diagnosis", text: "Delivered a full audit and a plain-language summary for a client meeting. It connected the ranking drop to the spam link spike and flagged quick on-page fixes that needed no new content." },
              { label: "Competitor and backlink gap analysis", text: "Benchmarked backlinks, authority, and keyword overlap against 5 direct competitors (Majestic Photobooth, Proparazzi, Little Camper, Luxebooth, Social Pro). From that I built a list of guest post and PR opportunities based on links that work for competitors." },
              { label: "6-month growth strategy", text: "Built a 3-phase plan. Phase 1 stops the decline, disavows the spam network, and fixes the technical foundation. Phase 2 deepens underbuilt service pages and starts a disciplined link program. Phase 3 rolls out DFW suburb location pages." },
              { label: "DFW suburb roadmap", text: "Turned the client's city-tier guidance into a hyperlocal expansion plan (Plano, Frisco, Irving and Las Colinas, Addison, Arlington, Fort Worth, and more), with chamber and directory opportunities for each city." },
              { label: "Keyword and content strategy", text: 'Organized 407 tracked keywords (124,000+ monthly searches) into a prioritized opportunity bank, and built a 12-month, 48-piece editorial calendar mapped to target pages, funnel stage, and seasonality. Content is now publishing, starting with a pillar post targeting "360 photo booth."' },
              { label: "Corporate repositioning support", text: "Prepared a role-by-role team brief and alignment materials to move the brand, site, and content toward corporate event and activation buyers." },
              { label: "Paid search planning", text: "Researched keywords in Keyword Planner and drafted a launch Google Ads campaign for the site's first paid search presence." },
            ],
          },
          {
            heading: "Starting point (July to August 2026)",
            paragraphs: [
              "459 ranking keywords; 29 on page one; 58 in striking distance (positions 11 to 20).",
              '#1 for brand terms "red photo booth" and "red photo booths".',
              '"photo booth rental dallas" at #9, "360 photo booth" at #26, "photobooth" (49,500 searches) at #65.',
              "304 organic visits/month, with a clear plan to recover and grow.",
            ],
          },
          { heading: "Tools", paragraphs: ["Semrush, Google Ads Keyword Planner, Google Sheets."] },
        ],
      },
    },
    {
      id: "fragrance-bodega",
      title: "Fragrance Bodega",
      category: "seo",
      categoryLabel: "SEO",
      description:
        "US Shopify store specializing in Middle Eastern and designer-inspired fragrances from brands like Rasasi, Armaf, Lattafa, French Avenue, Rayhaan, and Jo Milano.",
      image: "/images/Logos/FB.jpg",
      href: "/portfolio",
      details: {
        intro:
          "Fragrance Bodega is a US Shopify store specializing in Middle Eastern and designer-inspired fragrances from brands like Rasasi, Armaf, Lattafa, French Avenue, Rayhaan, and Jo Milano. I provided web development and social media marketing for the store, and I have handled the store's SEO and email strategy since May 2026, covering technical fixes, product and collection optimization, content, link building, and data-driven email marketing.",
        sections: [
          {
            heading: "The challenge",
            paragraphs: [
              "My May 2026 audit found only 74 of 147 pages indexed by Google, a large number of broken links (including 404 collection pages), and crawl issues. The store ranked for 369 keywords, but only 2 were on page one. Most product and brand terms sat on pages 2 to 6, and the site had just 5 referring domains against large competitors like Jomashop and FragranceNet. Email was underperforming too: July data showed 0 of 20 orders coming from email, mainly due to heavy resends and offers that didn't match real product demand.",
            ],
          },
          {
            heading: "What I did",
            items: [
              { label: "Web development", text: "Developed the Shopify store so shoppers could browse brands and buy fragrances online." },
              { label: "Social media marketing", text: "Handled social media marketing for the store to promote new arrivals, brand lines, and offers." },
              { label: "Technical SEO and audit", text: "Delivered a full audit covering indexing, broken links, and crawl errors, and prioritized fixes for broken collection URLs and non-indexed pages." },
              { label: "Product and collection optimization", text: "Optimized product and collection pages around brand and product searches (Game of Spades, Hawas, Rayhaan Pacific Aura, Zimaya). Rankings improved within 19 days of the first round of changes." },
              { label: "Sales and demand analysis", text: "Built a best-sellers report from Shopify orders and matched it with Search Console data to find hero products, such as the Rasasi Hawas line, and high-impression, low-click opportunities." },
              { label: "6-month growth strategy", text: "Analyzed 730 tracked keywords and benchmarked backlinks against 5 US fragrance competitors, filtering out their purchased PBN links so the plan only copies white-hat tactics. I identified 49 quick-win keywords on page 2 (75,950 monthly searches) and built a target list of guest post, PR, coupon, directory, and fragrance-authority link opportunities." },
              { label: "Content and link building", text: "Published seasonal and review content (late summer scents, back-to-school fragrances, Pride Month unisex scents, Armaf Ombre Fresh review, Breast Cancer Awareness picks). My team built the first wave of backlinks, plus Reddit and Quora community posts." },
              { label: "Email marketing", text: "Planned monthly email campaigns from June to September 2026 based on Search Console and sales data. I rebuilt the strategy after a July performance review: single sends instead of 4x resends, hero products matched to search demand, dated discount codes, Labor Day urgency sequences, and five always-on automated flows." },
            ],
          },
          {
            heading: "Results (May 2026 to September 2026)",
            paragraphs: [
              "Ranking keywords: 369 to 967 (2.6x growth).",
              'Page one keywords: 2 to 6, with "bodega cologne" at #1.',
              'New rankings for high-volume brand terms, including "game of.spades" (4.4K monthly searches) at #14.',
              "Shopify orders up 86% month-over-month after the first optimization round.",
              'Branded search "fragrance bodega" at #1, with daily clicks roughly doubling in early September.',
              "Hawas Private product pages ranking in positions 8 to 13.",
            ],
          },
          { heading: "Tools", paragraphs: ["Semrush, Google Search Console, Google Analytics, Shopify Analytics, Google Sheets."] },
        ],
      },
    },
    {
      id: "dhuka-insurance",
      title: "Dhuka Insurance",
      category: "seo",
      categoryLabel: "SEO",
      description:
        "Independent property and casualty insurance agency based in Austin, Texas, shopping multiple carriers for auto, home, life, health, and small-business coverage.",
      image: "/images/Logos/Dhuka-INS-logo.png",
      imageFit: "contain",
      href: "/portfolio",
      details: {
        intro:
          "Dhuka Insurance is an independent property and casualty insurance agency based in Austin, Texas, founded in 2015. It shops multiple carriers to find coverage for auto, home, life, health, and small-business clients. I provided web development and social media marketing for the agency, and I led SEO for the agency's new website, dhukainsurancetx.com, from launch in early 2026, with a focus on the client's top priorities: commercial and personal auto insurance.",
        sections: [
          {
            heading: "The challenge",
            paragraphs: [
              'Insurance is one of the most competitive and expensive search niches, dominated by national carriers and aggregators. The new site launched with almost no search visibility (2 ranking keywords in June 2026), and the first Ahrefs audit flagged 540 issues and 20 errors. These included duplicate pages without canonicals, incomplete Open Graph tags, 127 slow pages, overly long titles, and pages switching from indexable to non-indexable. The agency needed a structure that could compete through specific niches instead of broad "insurance" terms.',
            ],
          },
          {
            heading: "What I did",
            items: [
              { label: "Web development", text: "Developed dhukainsurancetx.com so clients could review coverage lines and start a quote." },
              { label: "Social media marketing", text: "Handled social media marketing for the Austin agency to explain auto, home, and business coverage." },
              { label: "Client onboarding", text: "Ran a business and services questionnaire to define the agency's positioning, service priorities, and ideal customers (families, individuals, and small businesses), and built the SEO plan around it." },
              { label: "Niche-first site architecture", text: "Wrote focus keywords, meta titles, and meta descriptions for 44 pages. These covered personal lines (auto, home, life), 19 small-business niche pages (coffee shops, food trucks, restaurants, contractors, roofers, plumbers, landscaping, salons, cleaning, senior care, and more), 4 city pages (Austin, Dallas, Houston, San Antonio), and blog categories." },
              { label: "Lead-generation tools", text: "Optimized 4 insurance calculator pages (auto, home, life, business) as search-friendly quote and lead magnets." },
              { label: "Technical SEO", text: "Ran recurring Ahrefs audits and worked through canonical, indexing, Open Graph, title, and page speed issues." },
              { label: "Content and links", text: "Built a 60+ topic content calendar across auto, home, life, health, and business insurance and published the first explainer posts on Texas coverage requirements and liability costs. I also built 58 live backlinks (54 do-follow) through blog commenting and social profiles." },
              { label: "Search Console analysis and email", text: "Found that the commercial niche pages were already drawing thousands of impressions (the coffee shop page alone had 1,434) but ranked on pages 4 to 9. I used this to plan a July 2026 email campaign leading with commercial lines, calculator lead nurturing, and a bilingual English/Spanish track for the Texas market." },
            ],
          },
          {
            heading: "Results (April to July 2026)",
            paragraphs: [
              "Site audit issues: 540 to 141 (74% reduction); errors: 20 to 3; slow pages: 127 to 7.",
              "Ranking keywords: 2 to 29 in one month, all for commercial and calculator terms.",
              'New rankings for "homeowners insurance texas calculator" (#35), "contractors insurance austin" (#36), "landscaping insurance texas" (#40), and "coffee insurance" (#42).',
              "Thousands of monthly impressions across the small-business niche pages.",
            ],
          },
          { heading: "Tools", paragraphs: ["Ahrefs, Google Search Console, Google Analytics, Google Sheets."] },
        ],
      },
    },
    {
      id: "taleem-foundation",
      title: "The Taleem Foundation",
      category: "seo",
      categoryLabel: "SEO",
      description:
        "Nonprofit expanding education access in Pakistan, with a focus on girls' education, skills development, and community empowerment.",
      image: "/images/Logos/Taleem-Foundation-logo.jpg",
      imageFit: "contain",
      href: "/portfolio",
      details: {
        intro:
          "The Taleem Foundation is a nonprofit working to expand education access in Pakistan, with a focus on girls' education, skills development, vocational training, and community empowerment. Its website, thetaleemfoundation.com, is built to reach donors and volunteers, especially in the US. I provided web development and social media marketing for the foundation, and I have led the foundation's SEO since April 2025, starting with a full audit and building a long-term content and authority program.",
        sections: [
          {
            heading: "The challenge",
            paragraphs: [
              "My April 2025 audit found a site with a clear mission but almost no search presence. It had zero US organic traffic and no ranking keywords, and a backlink profile made up mostly of toxic, low-authority links (Page Authority 0 to 6). Pages overused the same phrases (\"become a volunteer,\" \"achievements\") with no long-tail targeting. The site also had redirect-chain links, missing meta descriptions and H1 tags, and slow pages. Nonprofit competitors such as ITA (itacec.org) and Zindagi Trust ranked for valuable terms like \"girls education Pakistan\" and \"free education programs in Pakistan,\" where the foundation had no visibility.",
            ],
          },
          {
            heading: "What I did",
            items: [
              { label: "Web development", text: "Developed thetaleemfoundation.com so donors and volunteers, especially in the US, could learn about the mission and get involved." },
              { label: "Social media marketing", text: "Handled social media marketing for the foundation to share education stories and reach supporters." },
              { label: "SEO audit and roadmap", text: "Delivered a full technical, on-page, and off-page audit with keyword density analysis by page, a competitor keyword gap analysis, and a 3-phase action plan: fix and disavow, optimize keywords and launch content, then outreach and PR." },
              { label: "Content strategy for a US donor audience", text: "Built a 135-topic content calendar and published 87 blog posts. Topics included the state of education in Pakistan, girls' education, the urban-rural divide, curriculum and policy reform, EdTech and digital learning, and student success stories. Many posts were framed for Western readers, such as \"Why Educating Pakistani Girls Should Matter to the West\" and \"How Pakistani-American Charities Are Building Schools Back Home.\" Publishing grew the site from 457 to 1,100+ crawlable pages." },
              { label: "Link building", text: "Built 286 live backlinks (246 do-follow) through Web 2.0s, blog commenting, social profiles, directories, business listings, and social bookmarking, plus a guest post on Youth Ki Awaaz (DA 66)." },
              { label: "Toxic link cleanup", text: "Identified 85 spammy referring domains and disavowed 49 harmful links, as the audit called for." },
              { label: "Technical SEO and reporting", text: "Ran recurring Ahrefs audits to fix redirects, meta tags, and headers, and delivered 18 SEO reports over 16 months." },
            ],
          },
          {
            heading: "Results (April 2025 to October 2026)",
            paragraphs: [
              "Content library: 87 published articles, growing the site to 1,100+ pages.",
              "Site health: 100 score maintained as the site more than doubled in size.",
              "From zero ranking keywords to the foundation's first page-one ranking and first Google AI Overview appearance (August 2026).",
              "Backlink profile shifted from mostly toxic links to a cleaned profile of 246 do-follow links built through white-hat methods.",
            ],
          },
          { heading: "Tools", paragraphs: ["Ahrefs, Semrush, Google Search Console, Google Analytics, Google Sheets."] },
        ],
      },
    },
    {
      id: "cashingtech",
      title: "CashingTech",
      category: "web",
      categoryLabel: "Web Development",
      description:
        "Electronics buyback platform that pays cash for used phones, tablets, laptops, and other devices, with instant quotes and free prepaid shipping.",
      image: "/images/Logos/CashingTech-logo.jpg",
      imageFit: "contain",
      href: "/portfolio",
      details: {
        intro:
          "CashingTech is an electronics buyback platform that pays cash for used phones, tablets, laptops, and other devices, with instant quotes, free prepaid shipping, and payment within 24 to 48 hours of inspection. I designed and developed the complete website, cashingtech.com, from the ground up.",
        sections: [
          {
            heading: "The goal",
            paragraphs: [
              "The client needed a platform that could turn a visitor into a seller in about 60 seconds: pick a device, choose its condition, see an offer, and ship it. The site also had to serve two very different audiences, individual consumers selling one device and businesses trading in 20 or more, while building enough trust for people to mail valuable electronics to an online company.",
            ],
          },
          {
            heading: "What I built",
            items: [
              { label: "Instant quote flow", text: "A step-by-step selling journey across 12 device categories (phones, tablets, laptops, desktops, smartwatches, game consoles, graphics cards, cameras, audio, drones, VR headsets, and monitors), with dedicated brand and model pages such as iPhone, Samsung, iPad, and MacBook. Sellers grade their device as Flawless, Good, Fair, or Broken to get an instant offer." },
              { label: "My Box cart and checkout", text: "A multi-device cart that lets sellers add several items to one shipment, browse without an account, and sign in only at checkout. Sellers choose payment by check, PayPal, or Zelle." },
              { label: "User accounts", text: "Sign-in and account flow tied to checkout, so sellers can track their trade-ins." },
              { label: "Bulk trade-in system", text: "A B2B quote request form with dynamic device rows (category and condition) that users can add as needed, plus spreadsheet upload (.xls, .xlsx, .csv, up to 5 MB) for large inventories." },
              { label: "Business and support pages", text: "IT Asset Disposition (ITAD), custom quote, affiliate program, support and FAQs, contact, and about pages, plus a full legal set (privacy policy, terms, cookie policy, user agreement, law enforcement, and accessibility)." },
              { label: "Conversion-focused UI", text: "A bold homepage with a phone mockup showing sample offers, a 3-step Quote, Ship, Get Paid process section, trust badges, a scrolling press logo strip, testimonials, and an expandable FAQ accordion." },
              { label: "Blog module", text: "A built-in blog section with article cards and individual post pages." },
              { label: "Responsive design", text: "Fully responsive layouts across desktop, tablet, and mobile, with a slide-out cart and a mobile-friendly navigation." },
            ],
          },
          {
            heading: "The result",
            paragraphs: [
              "A complete, production-ready buyback platform that handles consumer sales and business trade-ins in one place, with a clean, modern interface built to convert visitors into sellers.",
            ],
          },
          {
            heading: "Skills",
            paragraphs: [
              "Web development, UI/UX design, front-end development, e-commerce flow development, form development, responsive design.",
            ],
          },
        ],
      },
    },
    {
      id: "3-chefs-persian",
      title: "3 Chefs Persian",
      category: "web",
      categoryLabel: "Web Development",
      description:
        "Authentic Persian restaurant in Aurora, Illinois, with dine-in, takeout, and catering, and a website built for direct ordering.",
      image: "/images/Logos/3-Chefs-logo.jpg",
      imageFit: "contain",
      href: "/portfolio",
      details: {
        intro:
          "3 Chefs Persian Cuisine is an authentic Persian restaurant in Aurora, Illinois, offering dine-in, takeout, and catering for events. I designed and developed the restaurant's website, 3chefs.net, giving the business its own online home and a direct ordering channel for customers.",
        sections: [
          {
            heading: "The goal",
            paragraphs: [
              "The restaurant needed a website that would reflect the warmth and tradition of Persian home cooking, make its menu easy to browse, and turn visitors into orders and catering inquiries, without relying entirely on third-party delivery apps.",
            ],
          },
          {
            heading: "What I built",
            items: [
              { label: "Online ordering", text: "Customers can browse the menu and order for dine-in, pickup, or delivery directly from 3chefs.net, and reserve a table ahead of a visit." },
              { label: "Digital menu", text: "An organized, easy-to-scan menu of Persian dishes, including charcoal-grilled kebabs, stews, rice, appetizers, shawarma bowls and wraps, family platters, and desserts such as baghlava, with descriptions and prices." },
              { label: "Catering section", text: "A dedicated family-style live catering section for weddings, birthdays, corporate events, and gatherings, with a direct call or text line to book the chef on site." },
              { label: "Brand-focused design", text: "A warm, inviting visual design built around the restaurant's \"Taste the tradition\" identity, with a hero section, a food gallery, and clear Order Online calls to action." },
              { label: "Location and contact", text: "The Aurora address, phone, email, and hours (Monday through Sunday, 10:30 AM to 9:30 PM) so local customers can find and reach the restaurant quickly." },
              { label: "Responsive design", text: "Fully responsive layouts across desktop, tablet, and mobile, since most restaurant visitors browse and order on their phones." },
            ],
          },
          {
            heading: "The result",
            paragraphs: [
              "A clean, modern restaurant website that gives 3 Chefs a professional online presence, a direct ordering channel, and a simple way to book catering, all from one place.",
            ],
          },
          {
            heading: "Skills",
            paragraphs: [
              "Web design, web development, UI/UX design, restaurant website development, online ordering integration, responsive design.",
            ],
          },
        ],
      },
    },
    {
      id: "broaster-chickens",
      title: "Broaster Chickens",
      category: "seo",
      categoryLabel: "SEO",
      description:
        "Chicago-area fast food brand serving genuine pressure-fried broasted chicken, sandwiches, smash burgers, and sides, with online ordering.",
      image: "/images/Logos/Broaster-Chickens-logo.jpg",
      imageFit: "contain",
      href: "/portfolio",
      details: {
        intro:
          "Broaster Chickens is a Chicago-area fast food brand serving genuine pressure-fried broasted chicken, broasted bird boxes, chicken sandwiches, smash burgers, appetizers, and sides, with online ordering through broasterchickens.com. The website was designed and developed by Elite Solution USA, and we handled its SEO foundation from launch in late 2025: keyword research, page-level keyword mapping, blog architecture, and technical monitoring.",
        sections: [
          {
            heading: "The challenge",
            paragraphs: [
              'The brand launched on a brand-new domain into a crowded fried chicken market, competing against national names like Krispy Krunchy Chicken (90,000+ monthly US searches) and established local chicken and burger spots. In November 2025 the site ranked for only 2 keywords, "broaster chicken" (#55) and "broaster chickens" (#62), with no backlinks. The goal was to give every menu category its own search target from day one, so the site could grow beyond its brand name.',
            ],
          },
          {
            heading: "What I did",
            items: [
              { label: "Website build support", text: "Worked alongside the Elite Solution USA development team on the new WooCommerce site, making sure the shop, product categories, and blog were structured for search from launch." },
              { label: "Keyword research", text: 'Researched 65+ keywords across brand, menu, and local intent, covering "genuine broaster chicken," "broaster chicken franchise," "broasted chicken near me," "pressure cooker fried chicken," "fried chicken sandwich," "best smash burgers chicago," and competitor searches like "krispy krunchy chicken chicago."' },
              { label: "Page-level keyword mapping", text: "Assigned focus and LSI keywords to 13 key URLs: the homepage, shop, menu categories (appetizers, broasted bird boxes, sandwiches, sides, smash burgers), a hero product page (Jalapeno Smasher), and the blog." },
              { label: "Blog architecture", text: "Planned 4 blog categories, each mapped to a keyword cluster: Healthy Fast Food, Fast Food Deals and Coupons, Burgers and Sandwiches, and Fast Food Recipes and DIY Hacks. These give the brand a long-term content path into recipe and deal searches." },
              { label: "Technical SEO", text: "Set up Ahrefs site monitoring at launch. The site passed its first full audit with a 100 health score and 0 errors across 151 crawled URLs, with only minor warnings (missing alt text, internal linking) flagged for cleanup." },
              { label: "Reporting", text: "Delivered an SEO report covering site health, keyword positions, and the off-page baseline." },
            ],
          },
          {
            heading: "Results (Launch, November 2025)",
            paragraphs: [
              "New website built by Elite Solution USA and launched SEO-ready.",
              "100 site health score with 0 errors at launch.",
              "13 pages keyword-mapped across 65+ target keywords.",
              'First brand rankings for "broaster chicken" (1K monthly searches) and "broaster chickens".',
            ],
          },
          { heading: "Tools", paragraphs: ["Ahrefs, Google Search Console, WooCommerce, Google Sheets."] },
        ],
      },
    },
  ] satisfies PortfolioStudioProject[],
  process: {
    eyebrow: "Our Process",
    title: "How We Bring Ideas to Life",
    lead: "Our proven process ensures your project is delivered on time, within budget, and beyond expectations.",
    steps: [
      {
        num: "01",
        title: "Discovery",
        body: "Understand your goals and requirements.",
      },
      {
        num: "02",
        title: "Design",
        body: "Create stunning designs and user flows.",
      },
      {
        num: "03",
        title: "Development",
        body: "Build with best practices and clean code.",
      },
      {
        num: "04",
        title: "Testing",
        body: "Ensure quality, performance and security.",
      },
      {
        num: "05",
        title: "Launch",
        body: "Go live and provide ongoing support.",
      },
    ],
  },
} as const;
