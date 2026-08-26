import prisma from "@/lib/dbClient/prisma";
import type { Interaction } from "../types";
import { ephemeralMessage } from "./responses";
import { parseIdOption, postNotFound } from "./shared";

export async function handleUnpublishCommand(interaction: Interaction) {
  const seq = parseIdOption(interaction);
  if (seq === null)
    return ephemeralMessage("⚠️ Provide a valid numeric post ID.");

  const post = await prisma.post.findUnique({ where: { seq } });
  if (!post) return postNotFound(seq);

  if (post.status !== "PUBLISHED") {
    return ephemeralMessage(
      `ℹ️ **#${post.seq} | ${post.title}** is already a draft.`,
    );
  }

  await prisma.post.update({
    where: { seq },
    data: { status: "DRAFT", publishedAt: null },
  });

  return ephemeralMessage(
    `📥 Unpublished **#${post.seq} | ${post.title}**. It's back in drafts.`,
  );
}
