import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPostStudioPage } from "@/components/blogs-studio-page";
import { blogsPage, getBlogPost } from "@/data/blogs-page";

type BlogParams = { slug: string };

export function generateStaticParams() {
  return blogsPage.posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<BlogParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "Blog" };
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<BlogParams>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();
  return <BlogPostStudioPage post={post} />;
}
