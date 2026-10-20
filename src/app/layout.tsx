import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { bodyFont, headFont, heroDisplayFont } from "@/fonts";
import { site } from "@/data/site";
import "./globals.css";

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
        className={`${headFont.variable} ${bodyFont.variable} ${heroDisplayFont.variable} h-full`}
      >
        <body className="min-h-full flex flex-col">{children}</body>
      </html>
    </ClerkProvider>
  );
}
