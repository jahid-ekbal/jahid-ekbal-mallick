import { serverEnv } from "@/lib/env/serverEnv";

export interface DiscordConfig {
  botToken: string;
  applicationId: string;
  publicKey: string;
  ownerUserId: string;
  logChannelId: string;
}

export function getDiscordConfig(): DiscordConfig | null {
  const {
    DISCORD_BOT_TOKEN,
    DISCORD_APPLICATION_ID,
    DISCORD_PUBLIC_KEY,
    DISCORD_OWNER_USER_ID,
    DISCORD_LOG_CHANNEL_ID,
  } = serverEnv;

  if (
    !DISCORD_BOT_TOKEN ||
    !DISCORD_APPLICATION_ID ||
    !DISCORD_PUBLIC_KEY ||
    !DISCORD_OWNER_USER_ID
  ) {
    return null;
  }

  return {
    botToken: DISCORD_BOT_TOKEN,
    applicationId: DISCORD_APPLICATION_ID,
    publicKey: DISCORD_PUBLIC_KEY,
    ownerUserId: DISCORD_OWNER_USER_ID,
    logChannelId: DISCORD_LOG_CHANNEL_ID ?? "",
  };
}
