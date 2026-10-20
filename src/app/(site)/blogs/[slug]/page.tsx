import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPostStudioPage } from "@/components/blogs-studio-page";
import { JsonLd } from "@/components/seo/json-ld";
import { blogsPage, getBlogPost } from "@/data/blogs-page";
import { buildMetadataFromSeo } from "@/lib/seo/build-metadata";
import { getPublishedPageSeo } from "@/lib/seo/get-page-seo";

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
  const defaults: Metadata = post
    ? { title: post.title, description: post.excerpt }
    : { title: "Blog" };
  const seo = await getPublishedPageSeo(`/blogs/${slug}`);
  return buildMetadataFromSeo(defaults, seo);
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<BlogParams>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();
  const seo = await getPublishedPageSeo(`/blogs/${slug}`);
  return (
    <>
      <JsonLd data={seo?.json_ld} />
      <BlogPostStudioPage post={post} />
    </>
  );
}
