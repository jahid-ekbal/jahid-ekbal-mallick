import Link from "next/link";
import { Clock } from "lucide-react";

import { getPublishedPosts } from "@/lib/data";
import { pageMetadata } from "@/lib/site";

export const revalidate = 300;

export const metadata = pageMetadata(
  "Blog",
  "Writing on software engineering, React, and shipping products.",
  "/blog",
);

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
});

const BlogPage = async () => {
  const posts = await getPublishedPosts();

  return (
    <div className="mx-auto max-w-3xl px-6">
      <section className="py-16 sm:py-20">
        <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
          Blog
        </h1>
        <p className="text-muted-foreground mt-4">
          Notes on engineering, tooling, and things I learn while building.
        </p>

        {posts.length > 0 ?
          <div className="divide-border mt-12 divide-y">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="py-7">
                <Link
                  href={`/blog/${post.slug}`}
                  className="group block">
                  <div className="text-muted-foreground flex items-center gap-3 text-xs">
                    {post.publishedAt && (
                      <time dateTime={post.publishedAt.toISOString()}>
                        {dateFormatter.format(post.publishedAt)}
                      </time>
                    )}
                    <span aria-hidden>|</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock size={12} /> {post.readingTime} min read
                    </span>
                  </div>

                  <h2 className="font-heading group-hover:text-foreground/80 mt-2 text-xl font-semibold tracking-tight transition-colors sm:text-2xl">
                    {post.title}
                  </h2>
                  <p className="text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>

                  {post.tags.length > 0 && (
                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      {post.tags.map((tag) => (
                        <li
                          key={tag}
                          className="border-border text-muted-foreground rounded-full border px-2 py-0.5 text-xs">
                          #{tag}
                        </li>
                      ))}
                    </ul>
                  )}
                </Link>
              </article>
            ))}
          </div>
        : <div className="border-border mt-16 rounded-xl border border-dashed p-12 text-center">
            <p className="text-muted-foreground">
              No posts yet. Check back soon.
            </p>
          </div>
        }
      </section>
    </div>
  );
};

export default BlogPage;
