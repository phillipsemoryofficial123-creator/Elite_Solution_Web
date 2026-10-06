import type { Metadata } from "next";
import { ContactStudioPage } from "@/components/contact-studio-page";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Book a free consultation with Elite Solutions USA. Tell us what you need and we will reply with a plan and a quote.",
};

export default function ContactPage() {
  return <ContactStudioPage />;
}
