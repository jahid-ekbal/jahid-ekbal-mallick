import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";

import Markdown from "@/components/Markdown";
import { getPostBySlug, getPublishedPosts } from "@/lib/data";
import { site } from "@/lib/site";

export const revalidate = 300;

export function generateStaticParams() {
  return getPublishedPosts().then((posts) =>
    posts.map((post) => ({ slug: post.slug })),
  );
}

export async function generateMetadata(
  props: PageProps<"/blog/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url: `/blog/${post.slug}`,
      publishedTime: post.publishedAt?.toISOString(),
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "long",
});

const BlogPostPage = async (props: PageProps<"/blog/[slug]">) => {
  const { slug } = await props.params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    ...(post.publishedAt && {
      datePublished: post.publishedAt.toISOString(),
    }),
    author: { "@type": "Person", name: site.name, url: site.url },
    mainEntityOfPage: `${site.url}/blog/${post.slug}`,
  };

  return (
    <div className="mx-auto max-w-3xl px-6">
      <script
        type={"application/ld+json"}
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="py-16 sm:py-20">
        <Link
          href={"/blog"}
          className="group text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm transition-colors">
          <ArrowLeft
            size={14}
            className="transition-transform duration-200 group-hover:-translate-x-0.5"
          />{" "}
          All posts
        </Link>

        <header className="mt-8">
          <h1 className="font-heading text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            {post.title}
          </h1>

          <div className="text-muted-foreground mt-4 flex flex-wrap items-center gap-3 text-sm">
            {post.publishedAt && (
              <time dateTime={post.publishedAt.toISOString()}>
                {dateFormatter.format(post.publishedAt)}
              </time>
            )}
            <span aria-hidden>|</span>
            <span className="inline-flex items-center gap-1">
              <Clock size={13} /> {post.readingTime} min read
            </span>
          </div>

          {post.tags.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <li
                  key={tag}
                  className="border-border text-muted-foreground rounded-full border px-2.5 py-0.5 text-xs">
                  #{tag}
                </li>
              ))}
            </ul>
          )}
        </header>

        {post.coverImage && (
          <div className="border-border relative mt-10 aspect-[16/9] overflow-hidden rounded-xl border">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              priority
              className="object-cover"
            />
          </div>
        )}

        <div className="border-border mt-10 border-t pt-10">
          <Markdown>{post.content}</Markdown>
        </div>
      </article>
    </div>
  );
};

export default BlogPostPage;
