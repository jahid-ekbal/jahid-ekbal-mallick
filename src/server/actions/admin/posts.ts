"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/lib/dbClient/prisma";
import { estimateReadingTime, parseTags, slugify } from "@/lib/content";
import { postSchema } from "@/lib/zodSchema";
import { requireAdminSession } from "./guard";

export type AdminResult =
  { ok: true; id?: string } | { ok: false; error: string };

async function uniquePostSlug(
  base: string,
  ignoreId?: string,
): Promise<string> {
  let slug = base;
  let counter = 2;
  for (;;) {
    const existing = await prisma.post.findUnique({ where: { slug } });
    if (!existing || existing.id === ignoreId) return slug;
    slug = `${base}-${counter}`;
    counter += 1;
  }
}

async function allocateSeq(): Promise<number> {
  const aggregate = await prisma.post.aggregate({ _max: { seq: true } });
  return (aggregate._max.seq ?? 0) + 1;
}

export async function savePost(input: unknown): Promise<AdminResult> {
  await requireAdminSession();

  const parsed = postSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Please fix the highlighted fields." };
  }
  const data = parsed.data;
  const baseSlug = data.slug?.trim() ? data.slug : slugify(data.title);

  try {
    if (data.id) {
      const current = await prisma.post.findUnique({
        where: { id: data.id },
      });
      if (!current) return { ok: false, error: "Post not found." };

      const updated = await prisma.post.update({
        where: { id: data.id },
        data: {
          title: data.title,
          slug: await uniquePostSlug(baseSlug, data.id),
          excerpt: data.excerpt,
          content: data.content,
          coverImage: data.coverImage || null,
          tags: JSON.stringify(parseTags(data.tags)),
          readingTime: estimateReadingTime(data.content),
          status:
            data.status === "PUBLISHED" ? "PUBLISHED"
            : current.status === "PUBLISHED" ? "DRAFT"
            : current.status,
          publishedAt:
            data.status === "PUBLISHED" ?
              (current.publishedAt ?? new Date())
            : current.publishedAt,
        },
      });
      revalidatePostPaths(updated.slug);
      return { ok: true, id: updated.id };
    }

    const created = await prisma.post.create({
      data: {
        seq: await allocateSeq(),
        slug: await uniquePostSlug(baseSlug),
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        coverImage: data.coverImage || null,
        tags: JSON.stringify(parseTags(data.tags)),
        readingTime: estimateReadingTime(data.content),
        status: data.status,
        source: "ADMIN",
        publishedAt: data.status === "PUBLISHED" ? new Date() : null,
      },
    });
    revalidatePostPaths(created.slug);
    return { ok: true, id: created.id };
  } catch (error) {
    console.error("[admin] savePost failed:", error);
    return { ok: false, error: "Something went wrong saving the post." };
  }
}

function revalidatePostPaths(slug?: string): void {
  revalidatePath("/admin/posts");
  if (slug) revalidatePath(`/blog/${slug}`);
  revalidatePath("/blog");
  revalidatePath("/");
}

export async function setPostStatus(
  id: string,
  publish: boolean,
): Promise<AdminResult> {
  await requireAdminSession();
  try {
    const current = await prisma.post.findUnique({ where: { id } });
    if (!current) return { ok: false, error: "Post not found." };

    await prisma.post.update({
      where: { id },
      data: {
        status: publish ? "PUBLISHED" : "DRAFT",
        publishedAt:
          publish ? (current.publishedAt ?? new Date()) : current.publishedAt,
      },
    });
    revalidatePostPaths(current.slug);
    return { ok: true };
  } catch {
    return { ok: false, error: "Could not update the post." };
  }
}

export async function deletePost(id: string): Promise<AdminResult> {
  await requireAdminSession();
  try {
    await prisma.post.delete({ where: { id } });
    revalidatePath("/admin/posts");
    revalidatePath("/blog");
    revalidatePath("/");
    return { ok: true };
  } catch {
    return { ok: false, error: "Could not delete the post." };
  }
}
