import type { Metadata } from "next";
import { CsrStudioPage } from "@/components/csr-studio-page";

export const metadata: Metadata = {
  title: "CSR",
  description:
    "Free Elite Solutions tools to build a professional resume and improve your website's search visibility.",
};

export default function CsrPage() {
  return <CsrStudioPage />;
}
