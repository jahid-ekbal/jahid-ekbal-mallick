"use server";

import { after } from "next/server";

import prisma from "@/lib/dbClient/prisma";
import { contactSchema } from "@/lib/zodSchema";
import { deliverContactMessage } from "@/server/discord/notify";

export type ContactFormResult = { ok: true } | { ok: false; error: string };

export async function submitContactMessage(
  input: unknown,
): Promise<ContactFormResult> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please review the highlighted fields and try again.",
    };
  }

  const created = await prisma.message.create({ data: parsed.data });

  after(async () => {
    try {
      await deliverContactMessage(created.id);
    } catch (error) {
      console.error("[contact] discord delivery failed:", error);
    }
  });

  return { ok: true };
}
