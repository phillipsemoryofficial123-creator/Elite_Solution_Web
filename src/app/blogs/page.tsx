import type { Metadata } from "next";
import { BlogsStudioPage } from "@/components/blogs-studio-page";

export const metadata: Metadata = {
  title: "Blogs",
  description:
    "Practical insights on accounting, tax, payroll, websites, SEO, and digital marketing from Elite Solutions USA.",
};

export default function BlogsPage() {
  return <BlogsStudioPage />;
}
