import prisma from "@/lib/dbClient/prisma";
import type { EmbedPayload, Interaction } from "../types";
import { getOptionValue, truncate } from "../utils";
import { ephemeralEmbeds, ephemeralMessage } from "./responses";

export async function handleMessagesCommand(interaction: Interaction) {
  const raw = getOptionValue(interaction, "count");
  const parsed = Number.parseInt(raw ?? "5", 10);
  const count =
    Number.isInteger(parsed) ? Math.min(Math.max(parsed, 1), 10) : 5;

  const messages = await prisma.message.findMany({
    orderBy: { createdAt: "desc" },
    take: count,
  });

  if (messages.length === 0) {
    return ephemeralMessage("📭 No contact messages yet.");
  }

  await prisma.message.updateMany({
    where: { id: { in: messages.map((m) => m.id) } },
    data: { read: true },
  });

  const embed: EmbedPayload = {
    title: `📬 Latest contact messages (${messages.length})`,
    color: 0x5865f2,
    fields: messages.map((m, index) => ({
      name: `${index + 1}. ${m.subject}`,
      value: [
        `**${m.name}** | <${m.email}>`,
        truncate(m.body, 180),
        `_✉️ ${m.delivered ? "delivered to DM" : "⚠️ undelivered"} | ${m.createdAt.toISOString().slice(0, 16).replace("T", " ")} UTC_`,
      ].join("\n"),
    })),
  };

  return ephemeralEmbeds([embed]);
}
