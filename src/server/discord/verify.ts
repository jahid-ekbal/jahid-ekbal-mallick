import { verifyKey } from "discord-interactions";
import { getDiscordConfig } from "./env";

export async function isValidDiscordRequest(
  rawBody: string,
  signature: string | null,
  timestamp: string | null,
): Promise<boolean> {
  const config = getDiscordConfig();
  if (!config || !signature || !timestamp) return false;

  try {
    return await verifyKey(rawBody, signature, timestamp, config.publicKey);
  } catch {
    return false;
  }
}
