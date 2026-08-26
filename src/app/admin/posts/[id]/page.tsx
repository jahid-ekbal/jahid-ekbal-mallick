import { notFound } from "next/navigation";

import prisma from "@/lib/dbClient/prisma";
import { PostForm } from "@/components/admin/PostForm";

export default async function EditPostPage({
  params,
}: PageProps<"/admin/posts/[id]">) {
  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) notFound();

  const tags = JSON.parse(post.tags) as string[];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Edit: #{post.seq} {post.title}
        </h1>
        <p className="text-muted-foreground text-sm">
          /blog/{post.slug} - status: {post.status}
        </p>
      </div>
      <PostForm
        initial={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          coverImage: post.coverImage,
          tagsJoined: tags.join(", "),
        }}
      />
    </div>
  );
}
