import Link from "next/link";
import { Plus } from "lucide-react";

import prisma from "@/lib/dbClient/prisma";
import { buttonVariants } from "@/components/shadcnui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcnui/table";
import { Badge } from "@/components/shadcnui/badge";
import { PostRowActions } from "@/components/admin/PostRowActions";

export default async function AdminPostsPage() {
  const posts = await prisma.post.findMany({
    orderBy: [{ status: "asc" }, { seq: "desc" }],
    select: {
      id: true,
      seq: true,
      title: true,
      slug: true,
      tags: true,
      readingTime: true,
      status: true,
      publishedAt: true,
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Blog posts</h1>
          <p className="text-muted-foreground text-sm">
            Drafts stay private until you publish them.
          </p>
        </div>
        <Link
          href="/admin/posts/new"
          className={buttonVariants({ className: "group" })}>
          New post
          <Plus
            data-icon="inline-end"
            className="transition-transform duration-200 group-hover:rotate-90"
          />
        </Link>
      </div>

      <div className="border-border rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Reading</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-44 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell>{post.seq}</TableCell>
                <TableCell>
                  <Link
                    href={`/admin/posts/${post.id}` as never}
                    className="hover:underline">
                    {post.title}
                  </Link>
                </TableCell>
                <TableCell>~{post.readingTime} min</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      post.status === "PUBLISHED" ? "default" : "secondary"
                    }>
                    {post.status === "PUBLISHED" ? "published" : "draft"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <PostRowActions
                    id={post.id}
                    published={post.status === "PUBLISHED"}
                  />
                </TableCell>
              </TableRow>
            ))}
            {posts.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-muted-foreground">
                  No posts yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
