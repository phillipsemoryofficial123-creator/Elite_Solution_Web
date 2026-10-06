import type { Metadata } from "next";
import { CsrStudioPage } from "@/components/csr-studio-page";

export const metadata: Metadata = {
  title: "CSR",
  description:
    "Free Elite Solutions USA tools — build a resume or use the SEO suite.",
};

export default function CsrPage() {
  return <CsrStudioPage />;
}
