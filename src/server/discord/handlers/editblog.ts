import { InteractionResponseType } from "discord-interactions";
import { getDiscordConfig } from "../env";
import { buildBlogModal, MODAL_CUSTOM_IDS } from "../commands";
import {
  buildContentEmbed,
  buildPreviewEmbed,
  findPostBySeq,
  parseBlogInput,
  updatePostFromInput,
} from "../blogService";
import { sendOwnerDm } from "../rest";
import { getModalValues } from "../utils";
import type { Interaction, InteractionResponse } from "../types";
import { ephemeralMessage } from "./responses";
import { parseIdOption, postNotFound } from "./shared";

export async function handleEditBlogCommand(
  interaction: Interaction,
): Promise<InteractionResponse> {
  const seq = parseIdOption(interaction);
  if (seq === null)
    return ephemeralMessage("⚠️ Provide a valid numeric post ID.");

  const post = await findPostBySeq(seq);
  if (!post) return postNotFound(seq);

  let tags = "";
  try {
    tags = (JSON.parse(post.tags) as string[]).join(", ");
  } catch {
    tags = "";
  }

  return {
    type: InteractionResponseType.MODAL,
    data: buildBlogModal({
      postSeq: post.seq,
      title: post.title,
      excerpt: post.excerpt,
      tags,
      coverUrl: post.coverImage ?? "",
      content: post.content,
    }),
  };
}

export async function handleEditBlogModalSubmit(
  interaction: Interaction,
): Promise<InteractionResponse> {
  const customId = interaction.data?.custom_id ?? "";
  const seq = Number.parseInt(
    customId.slice(MODAL_CUSTOM_IDS.editBlogPrefix.length),
    10,
  );
  if (!Number.isInteger(seq))
    return ephemeralMessage("⚠️ Couldn't resolve which post to edit.");

  const existing = await findPostBySeq(seq);
  if (!existing) return postNotFound(seq);

  const parsed = parseBlogInput(getModalValues(interaction));
  if (!parsed.ok)
    return ephemeralMessage(`⚠️ Couldn't update post: ${parsed.error}`);

  const updated = await updatePostFromInput(seq, parsed.data);
  if (!updated) return postNotFound(seq);

  let dmNote = "";
  const config = getDiscordConfig();
  if (config) {
    const delivered = await sendOwnerDm(config, {
      embeds: [buildPreviewEmbed(updated), buildContentEmbed(updated)],
    });
    if (!delivered)
      dmNote = "\n_(Preview DM failed - the update is still saved.)_";
  }

  const statusNote =
    updated.status === "PUBLISHED" ?
      "It remains live on the site."
    : `Use \`/publish id:${updated.seq}\` when ready.`;

  return ephemeralMessage(
    `✅ Updated **#${updated.seq} | ${updated.title}**. ${statusNote}${dmNote}`,
  );
}

export function isEditBlogModal(customId: string): boolean {
  return customId.startsWith(MODAL_CUSTOM_IDS.editBlogPrefix);
}
