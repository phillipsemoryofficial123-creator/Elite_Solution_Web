import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Black_Ops_One, Bricolage_Grotesque, Figtree } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import EclipseSplash from "@/components/eclipse-splash";
import { ScrollProgress } from "@/components/scroll-progress";
import { SiteHeader } from "@/components/site-header";
import { site } from "@/data/site";
import "./globals.css";

const head = Bricolage_Grotesque({
  variable: "--font-head",
  subsets: ["latin"],
  weight: ["500", "700", "800"],
});

const body = Figtree({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const heroDisplay = Black_Ops_One({
  variable: "--font-hero",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: {
    default: `${site.name} | Financial and Non-Financial Services`,
    template: `%s | ${site.name}`,
  },
  description: site.tagline,
  metadataBase: new URL(site.website),
  openGraph: {
    title: site.name,
    description: site.tagline,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        data-theme="dark"
        className={`${head.variable} ${body.variable} ${heroDisplay.variable} h-full`}
      >
        <body className="min-h-full flex flex-col">
          <EclipseSplash />
          <ScrollProgress />
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </body>
      </html>
    </ClerkProvider>
  );
}
