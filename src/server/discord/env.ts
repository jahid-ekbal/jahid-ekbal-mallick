import { serverEnv } from "@/lib/env/serverEnv";

export interface DiscordConfig {
  botToken: string;
  ownerUserId: string;
  logChannelId: string;
}

export function getDiscordConfig(): DiscordConfig | null {
  const { DISCORD_BOT_TOKEN, DISCORD_OWNER_USER_ID, DISCORD_LOG_CHANNEL_ID } =
    serverEnv;

  if (!DISCORD_BOT_TOKEN || !DISCORD_OWNER_USER_ID) return null;

  return {
    botToken: DISCORD_BOT_TOKEN,
    ownerUserId: DISCORD_OWNER_USER_ID,
    logChannelId: DISCORD_LOG_CHANNEL_ID ?? "",
  };
}
