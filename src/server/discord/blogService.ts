import z from "zod";
import prisma from "@/lib/dbClient/prisma";
import type { EmbedPayload } from "./types";
import { BLOG_FIELD_IDS } from "./commands";
import { estimateReadingTime, parseTags, slugify } from "./utils";

export const blogInputSchema = z.object({
  title: z.string().trim().min(3).max(120),
  excerpt: z.string().trim().min(10).max(200),
  tags: z.string().trim().max(120),
  coverUrl: z
    .string()
    .trim()
    .max(500)
    .regex(
      /^(https?:\/\/\S+)?$/,
      "Cover image must be an http(s) URL or empty",
    ),
  content: z.string().trim().min(20).max(4000),
});

export type BlogInput = z.infer<typeof blogInputSchema>;
export type ParsedBlogInput =
  { ok: true; data: BlogInput } | { ok: false; error: string };

export function parseBlogInput(
  values: Record<string, string>,
): ParsedBlogInput {
  const parsed = blogInputSchema.safeParse({
    title: values[BLOG_FIELD_IDS.title] ?? "",
    excerpt: values[BLOG_FIELD_IDS.excerpt] ?? "",
    tags: values[BLOG_FIELD_IDS.tags] ?? "",
    coverUrl: values[BLOG_FIELD_IDS.coverUrl] ?? "",
    content: values[BLOG_FIELD_IDS.content] ?? "",
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }
  return { ok: true, data: parsed.data };
}

async function allocateSeq(): Promise<number> {
  const aggregate = await prisma.post.aggregate({ _max: { seq: true } });
  return (aggregate._max.seq ?? 0) + 1;
}

async function uniqueSlug(base: string): Promise<string> {
  let slug = base;
  let counter = 2;
  while ((await prisma.post.findUnique({ where: { slug } })) !== null) {
    slug = `${base}-${counter}`;
    counter += 1;
  }
  return slug;
}

export async function createDraftPost(input: BlogInput) {
  return prisma.post.create({
    data: {
      seq: await allocateSeq(),
      slug: await uniqueSlug(slugify(input.title)),
      title: input.title,
      excerpt: input.excerpt,
      content: input.content,
      coverImage: input.coverUrl || null,
      tags: JSON.stringify(parseTags(input.tags)),
      readingTime: estimateReadingTime(input.content),
      status: "DRAFT",
      source: "DISCORD",
    },
  });
}

export async function updatePostFromInput(seq: number, input: BlogInput) {
  const post = await prisma.post.findUnique({ where: { seq } });
  if (!post) return null;

  return prisma.post.update({
    where: { seq },
    data: {
      title: input.title,
      excerpt: input.excerpt,
      content: input.content,
      coverImage: input.coverUrl || null,
      tags: JSON.stringify(parseTags(input.tags)),
      readingTime: estimateReadingTime(input.content),
    },
  });
}

export async function findPostBySeq(seq: number) {
  return prisma.post.findUnique({ where: { seq } });
}

export function buildPreviewEmbed(post: {
  seq: number;
  slug: string;
  title: string;
  excerpt: string;
  status: string;
  readingTime: number;
}): EmbedPayload {
  const isPublished = post.status === "PUBLISHED";
  return {
    title: `📝 Draft preview | #${post.seq} ${post.title}`,
    description: [
      post.excerpt,
      "",
      `**Slug:** \`${post.slug}\``,
      `**Reading time:** ~${post.readingTime} min`,
      `**Status:** ${isPublished ? "🟢 Published" : "🟡 Draft"}`,
    ].join("\n"),
    color: isPublished ? 0x22c55e : 0xeab308,
  };
}

export function buildContentEmbed(post: {
  title: string;
  content: string;
}): EmbedPayload {
  return {
    title: post.title,
    description: truncateForEmbed(post.content),
    color: 0x5865f2,
  };
}

function truncateForEmbed(content: string): string {
  if (content.length <= 3800) return content;
  return `${content.slice(0, 3799)}\n\n*(truncated in DM preview - full text is saved)*`;
}
