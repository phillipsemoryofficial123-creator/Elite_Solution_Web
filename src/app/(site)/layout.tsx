import { ServiceNewsletter } from "@/components/service-newsletter";
import { SiteFooter } from "@/components/site-footer";
import EclipseSplash from "@/components/eclipse-splash";
import { RonotChat } from "@/components/ronot-chat";
import { ScrollProgress } from "@/components/scroll-progress";
import { SiteHeader } from "@/components/site-header";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <EclipseSplash />
      <ScrollProgress />
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <ServiceNewsletter />
      <SiteFooter />
      <RonotChat />
    </>
  );
}
