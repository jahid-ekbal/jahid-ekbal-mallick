import { InteractionResponseType, InteractionType } from "discord-interactions";
import { isValidDiscordRequest } from "@/server/discord/verify";
import { handleInteraction } from "@/server/discord/router";
import { getDiscordConfig } from "@/server/discord/env";
import type { Interaction } from "@/server/discord/types";

export async function POST(request: Request) {
  if (!getDiscordConfig()) {
    return new Response("Discord bot not configured", { status: 503 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get("x-signature-ed25519");
  const timestamp = request.headers.get("x-signature-timestamp");

  if (!(await isValidDiscordRequest(rawBody, signature, timestamp))) {
    return new Response("Unauthorized", { status: 401 });
  }

  let interaction: Interaction;
  try {
    interaction = JSON.parse(rawBody) as Interaction;
  } catch {
    return new Response("Bad Request", { status: 400 });
  }

  if (interaction.type === InteractionType.PING) {
    return Response.json({ type: InteractionResponseType.PONG });
  }

  const response = await handleInteraction(interaction);
  return Response.json(response);
}
