import prisma from "@/lib/dbClient/prisma";
import type { Interaction } from "../types";
import { ephemeralMessage } from "./responses";
import { parseIdOption, postNotFound } from "./shared";

export async function handlePublishCommand(interaction: Interaction) {
  const seq = parseIdOption(interaction);
  if (seq === null)
    return ephemeralMessage("⚠️ Provide a valid numeric post ID.");

  const post = await prisma.post.findUnique({ where: { seq } });
  if (!post) return postNotFound(seq);

  if (post.status === "PUBLISHED") {
    return ephemeralMessage(
      `ℹ️ **#${post.seq} | ${post.title}** is already live at \`/blog/${post.slug}\`.`,
    );
  }

  await prisma.post.update({
    where: { seq },
    data: { status: "PUBLISHED", publishedAt: new Date() },
  });

  return ephemeralMessage(
    `🚀 Published **#${post.seq} | ${post.title}**\nLive at \`/blog/${post.slug}\``,
  );
}
