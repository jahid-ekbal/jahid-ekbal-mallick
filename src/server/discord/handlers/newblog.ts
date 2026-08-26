import { InteractionResponseType } from "discord-interactions";
import { getDiscordConfig } from "../env";
import { buildBlogModal, MODAL_CUSTOM_IDS } from "../commands";
import {
  buildContentEmbed,
  buildPreviewEmbed,
  createDraftPost,
  parseBlogInput,
} from "../blogService";
import { sendOwnerDm } from "../rest";
import { getModalValues } from "../utils";
import type { Interaction, InteractionResponse } from "../types";
import { ephemeralMessage } from "./responses";

export async function handleNewBlogCommand(): Promise<InteractionResponse> {
  return { type: InteractionResponseType.MODAL, data: buildBlogModal() };
}

export async function handleNewBlogModalSubmit(
  interaction: Interaction,
): Promise<InteractionResponse> {
  const parsed = parseBlogInput(getModalValues(interaction));
  if (!parsed.ok)
    return ephemeralMessage(`⚠️ Couldn't save draft: ${parsed.error}`);

  const post = await createDraftPost(parsed.data);

  let dmNote = "";
  const config = getDiscordConfig();
  if (config) {
    const delivered = await sendOwnerDm(config, {
      embeds: [buildPreviewEmbed(post), buildContentEmbed(post)],
    });
    if (!delivered)
      dmNote = "\n_(Preview DM failed - the draft is still saved.)_";
  }

  return ephemeralMessage(
    [
      `✅ Draft **#${post.seq} | ${post.title}** saved.`,
      "",
      `Use \`/publish id:${post.seq}\` when it's ready to go live.${dmNote}`,
    ].join("\n"),
  );
}

export function isNewBlogModal(customId: string): boolean {
  return customId === MODAL_CUSTOM_IDS.newBlog;
}
