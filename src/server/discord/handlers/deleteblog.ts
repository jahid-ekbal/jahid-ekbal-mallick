import {
  InteractionResponseFlags,
  InteractionResponseType,
} from "discord-interactions";
import prisma from "@/lib/dbClient/prisma";
import { BUTTON_CUSTOM_IDS } from "../commands";
import type { Interaction, InteractionResponse } from "../types";
import { ephemeralMessage } from "./responses";
import { parseIdOption, postNotFound } from "./shared";

export async function handleDeleteBlogCommand(
  interaction: Interaction,
): Promise<InteractionResponse> {
  const seq = parseIdOption(interaction);
  if (seq === null)
    return ephemeralMessage("⚠️ Provide a valid numeric post ID.");

  const post = await prisma.post.findUnique({ where: { seq } });
  if (!post) return postNotFound(seq);

  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: `⚠️ Permanently delete **#${post.seq} | ${post.title}**? This cannot be undone.`,
      components: [
        {
          type: 18,
          components: [
            {
              type: 2,
              style: 4,
              label: "Delete",
              custom_id: `${BUTTON_CUSTOM_IDS.deleteConfirmPrefix}${post.seq}`,
            },
            {
              type: 2,
              style: 2,
              label: "Cancel",
              custom_id: `${BUTTON_CUSTOM_IDS.deleteCancelPrefix}${post.seq}`,
            },
          ],
        },
      ],
      flags: InteractionResponseFlags.EPHEMERAL,
    },
  };
}

export async function handleDeleteButton(
  interaction: Interaction,
): Promise<InteractionResponse> {
  const customId = interaction.data?.custom_id ?? "";
  const isConfirm = customId.startsWith(BUTTON_CUSTOM_IDS.deleteConfirmPrefix);
  const prefix =
    isConfirm ?
      BUTTON_CUSTOM_IDS.deleteConfirmPrefix
    : BUTTON_CUSTOM_IDS.deleteCancelPrefix;

  const seq = Number.parseInt(customId.slice(prefix.length), 10);
  if (!Number.isInteger(seq)) {
    return updateOriginal("⚠️ Couldn't read that button's target anymore.");
  }

  if (!isConfirm) {
    return updateOriginal("Cancelled - nothing was deleted.");
  }

  const deleted = await prisma.post
    .delete({ where: { seq } })
    .catch(() => null);
  if (!deleted) {
    return updateOriginal(`⚠️ Post #${seq} no longer exists.`);
  }

  return updateOriginal(`🗑️ Deleted **#${deleted.seq} | ${deleted.title}**.`);
}

export function isDeleteButton(customId: string): boolean {
  return (
    customId.startsWith(BUTTON_CUSTOM_IDS.deleteConfirmPrefix) ||
    customId.startsWith(BUTTON_CUSTOM_IDS.deleteCancelPrefix)
  );
}

function updateOriginal(content: string): InteractionResponse {
  return {
    type: InteractionResponseType.UPDATE_MESSAGE,
    data: { content, components: [], embeds: [] },
  };
}
