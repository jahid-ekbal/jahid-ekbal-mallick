import { getDiscordConfig, type DiscordConfig } from "./env";
import type { MessagePayload } from "./types";

const API_BASE = "https://discord.com/api/v10";

async function apiRequest(
  path: string,
  init?: RequestInit,
): Promise<unknown | null> {
  const config = getDiscordConfig();
  if (!config) return null;

  try {
    const response = await fetch(`${API_BASE}${path}`, {
      ...init,
      headers: {
        Authorization: `Bot ${config.botToken}`,
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
    });

    if (!response.ok) {
      console.error(
        `[discord] ${init?.method ?? "GET"} ${path} failed (${response.status}):`,
        await response.text().catch(() => ""),
      );
      return null;
    }

    return await response.json().catch(() => null);
  } catch (error) {
    console.error("[discord] request error:", error);
    return null;
  }
}

export async function createDmChannel(userId: string): Promise<string | null> {
  const channel = (await apiRequest("/users/@me/channels", {
    method: "POST",
    body: JSON.stringify({ recipient_id: userId }),
  })) as { id?: string } | null;
  return channel?.id ?? null;
}

export async function sendMessage(
  channelId: string,
  payload: MessagePayload,
): Promise<boolean> {
  const result = await apiRequest(`/channels/${channelId}/messages`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return result !== null;
}

export async function sendOwnerDm(
  config: DiscordConfig,
  payload: MessagePayload,
): Promise<boolean> {
  const channelId = await createDmChannel(config.ownerUserId);
  if (!channelId) return false;
  return sendMessage(channelId, payload);
}

export async function sendLogMirror(
  config: DiscordConfig,
  payload: MessagePayload,
): Promise<boolean> {
  if (!config.logChannelId) return false;
  return sendMessage(config.logChannelId, payload);
}
