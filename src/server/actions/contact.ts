"use server";

import { headers } from "next/headers";
import { after } from "next/server";

import prisma from "@/lib/dbClient/prisma";
import { checkRateLimit, clientIpFromHeaders } from "@/lib/rateLimit";
import { contactSchema } from "@/lib/zodSchema";
import { deliverContactMessage } from "@/server/discord/notify";

export type ContactFormResult = { ok: true } | { ok: false; error: string };

// Public, unauthenticated write endpoint: 5 messages per IP per 10 minutes.
// Field lengths are additionally capped by contactSchema, and Server Action
// bodies are capped at 512kb in next.config.ts.
const RATE_LIMIT = { limit: 5, windowMs: 10 * 60 * 1000 };

export async function submitContactMessage(
  input: unknown,
): Promise<ContactFormResult> {
  const ip = clientIpFromHeaders(await headers());
  if (!checkRateLimit(`contact:${ip}`, RATE_LIMIT).ok) {
    return {
      ok: false,
      error: "Too many messages sent. Please try again later.",
    };
  }

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

