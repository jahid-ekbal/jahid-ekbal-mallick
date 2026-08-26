import prisma from "@/lib/dbClient/prisma";
import type { EmbedPayload } from "./types";
import { getDiscordConfig } from "./env";
import { sendLogMirror, sendOwnerDm } from "./rest";
import { truncate } from "./utils";

export async function deliverContactMessage(messageId: string): Promise<void> {
  const config = getDiscordConfig();
  if (!config) return;

  const message = await prisma.message.findUnique({ where: { id: messageId } });
  if (!message || message.delivered) return;

  const embed: EmbedPayload = {
    title: "📬 New contact form message",
    color: 0x5865f2,
    fields: [
      { name: "From", value: `**${message.name}** | <${message.email}>` },
      { name: "Subject", value: truncate(message.subject, 256) },
      { name: "Message", value: truncate(message.body, 1024) },
    ],
    footer: {
      text: `Portfolio contact | ${new Date().toISOString().slice(0, 16).replace("T", " ")} UTC`,
    },
  };

  const dmDelivered = await sendOwnerDm(config, { embeds: [embed] });
  const mirrorDelivered =
    config.logChannelId ?
      await sendLogMirror(config, { embeds: [embed] })
    : true;

  if (dmDelivered || mirrorDelivered) {
    await prisma.message.update({
      where: { id: messageId },
      data: { delivered: true },
    });
  }
}
