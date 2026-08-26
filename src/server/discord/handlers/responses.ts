import {
  InteractionResponseFlags,
  InteractionResponseType,
} from "discord-interactions";
import type { EmbedPayload, InteractionResponse } from "../types";

export function ephemeralMessage(content: string): InteractionResponse {
  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: { content, flags: InteractionResponseFlags.EPHEMERAL },
  };
}

export function ephemeralEmbeds(embeds: EmbedPayload[]): InteractionResponse {
  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: { embeds, flags: InteractionResponseFlags.EPHEMERAL },
  };
}
