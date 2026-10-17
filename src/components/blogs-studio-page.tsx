import Image from "next/image";
import Link from "next/link";
import { MagButton } from "@/components/interactions";
import { Reveal } from "@/components/reveal";
import { blogsPage, type BlogPost } from "@/data/blogs-page";

function BlogCard({ post, delay = "0ms" }: { post: BlogPost; delay?: string }) {
  return (
    <Reveal delay={delay}>
      <article className="blogs-card">
        <Link className="blogs-card-link" href={`/blogs/${post.slug}`}>
          <div className="blogs-card-media">
            <Image
              src={post.image}
              alt=""
              fill
              sizes="(max-width:900px) 100vw, 33vw"
              className="blogs-card-img"
            />
          </div>
          <div className="blogs-card-copy">
            <div className="blogs-card-meta">
              <span className="blogs-card-cat">{post.category}</span>
              <span>{post.date}</span>
              <span>{post.readTime}</span>
            </div>
            <h3>{post.title}</h3>
            <p>{post.excerpt}</p>
            <span className="blogs-card-more">
              Read article
              <span aria-hidden="true"> →</span>
            </span>
          </div>
        </Link>
      </article>
    </Reveal>
  );
}

export function BlogsStudioPage() {
  const { hero, listing, posts } = blogsPage;

  return (
    <div className="blogs-studio">
      <section className="blogs-hero">
        <div className="blogs-hero-bg" aria-hidden="true">
          <Image
            src={hero.image}
            alt=""
            fill
            priority
            quality={90}
            sizes="100vw"
            className="blogs-hero-bg-img"
          />
        </div>
        <div className="w blogs-hero-in">
          <div className="blogs-hero-copy">
            <Reveal as="p" className="blogs-eyebrow">
              {hero.eyebrow}
            </Reveal>
            <Reveal>
              <h1 className="blogs-title blogs-hero-title">
                {hero.titleBefore}{" "}
                <span className="blogs-accent">{hero.titleAccent}</span>
              </h1>
            </Reveal>
            <Reveal as="p" className="blogs-lead" delay="80ms">
              {hero.lead}
            </Reveal>
          </div>
        </div>
      </section>

      <section className="sec blogs-listing">
        <div className="w">
          <div className="blogs-sec-head">
            <Reveal as="p" className="blogs-eyebrow">
              {listing.eyebrow}
            </Reveal>
            <Reveal>
              <h2 className="blogs-title">
                {listing.titleBefore}{" "}
                <span className="blogs-accent">{listing.titleAccent}</span>
              </h2>
            </Reveal>
            <Reveal as="p" className="blogs-lead" delay="80ms">
              {listing.lead}
            </Reveal>
          </div>
          <div className="blogs-grid">
            {posts.map((post, index) => (
              <BlogCard key={post.id} post={post} delay={`${index * 60}ms`} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export function BlogPostStudioPage({ post }: { post: BlogPost }) {
  return (
    <div className="blogs-studio">
      <section className="blogs-hero blogs-hero-article">
        <div className="blogs-hero-bg" aria-hidden="true">
          <Image
            src={post.image}
            alt=""
            fill
            priority
            quality={90}
            sizes="100vw"
            className="blogs-hero-bg-img"
          />
        </div>
        <div className="w blogs-hero-in">
          <div className="blogs-hero-copy blogs-article-copy">
            <Reveal as="p" className="blogs-eyebrow">
              {post.category}
            </Reveal>
            <Reveal>
              <h1 className="blogs-title blogs-hero-title">{post.title}</h1>
            </Reveal>
            <Reveal as="p" className="blogs-article-meta" delay="80ms">
              <span>{post.date}</span>
              <span>{post.readTime}</span>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="sec blogs-article">
        <div className="w blogs-article-in">
          <Reveal>
            <p className="blogs-article-lead">{post.excerpt}</p>
          </Reveal>
          {post.body.map((paragraph, index) => (
            <Reveal key={paragraph} delay={`${(index + 1) * 50}ms`}>
              <p>{paragraph}</p>
            </Reveal>
          ))}
          <Reveal className="blogs-article-actions" delay="220ms">
            <MagButton>
              <Link className="btn gold mag" href="/blogs">
                Back to blogs
                <span aria-hidden="true"> →</span>
              </Link>
            </MagButton>
            <MagButton>
              <Link className="btn ghost mag" href="/contact">
                Talk to our team
              </Link>
            </MagButton>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
