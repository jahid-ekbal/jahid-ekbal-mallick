"use server";

import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import prisma from "@/lib/dbClient/prisma";
import { checkRateLimit, clientIpFromHeaders } from "@/lib/rateLimit";
import { loginOtpSchema } from "@/lib/zodSchema";
import { getDiscordConfig } from "@/server/discord/env";

export type RequestCodeResult =
  | { ok: true; cooldownMs: number }
  | { ok: false; error: string };
export type VerifyResult = { ok: true } | { ok: false; error: string };

// Public, unauthenticated endpoints: at most 3 code sends per IP per 10 min,
// 30 s resend cooldown, and a broad shield over verification attempts (the
// plugin itself further caps wrong tries per issued code at 5).
const SEND_LIMIT = { limit: 3, windowMs: 10 * 60 * 1000 };
const VERIFY_SHIELD = { limit: 12, windowMs: 5 * 60 * 1000 };
const RESEND_COOLDOWN_MS = 30_000;

/** Same fallback identity as the seeder. */
function adminEmail(): string {
  return (
    process.env.ADMIN_EMAIL?.trim() || "admin@example.com"
  ).toLowerCase();
}

// Cooldown memory survives across requests within the single app instance.
const lastSentAtByIp = new Map<string, number>();

/** Idempotently guarantees the admin User row exists (OTP requires it). */
async function ensureAdminUser(email: string): Promise<void> {
  const existing = await prisma.user.findFirst({
    where: { email },
    select: { id: true },
  });
  if (existing?.id) return;
  await prisma.user.create({
    data: {
      id: crypto.randomUUID(),
      name: "Admin",
      email,
      emailVerified: true,
    },
  });
}

export async function requestLoginCode(): Promise<RequestCodeResult> {
  const ip = clientIpFromHeaders(await headers());

  if (!getDiscordConfig()) {
    return {
      ok: false,
      error:
        "Login delivery is not configured. Set DISCORD_BOT_TOKEN and DISCORD_OWNER_USER_ID.",
    };
  }

  const now = Date.now();
  const lastSentAt = lastSentAtByIp.get(ip);
  if (lastSentAt !== undefined) {
    const elapsed = now - lastSentAt;
    if (elapsed < RESEND_COOLDOWN_MS) {
      return {
        ok: false,
        error: `Please wait ${Math.ceil((RESEND_COOLDOWN_MS - elapsed) / 1000)}s before requesting another code.`,
      };
    }
  }

  if (!checkRateLimit(`login-send:${ip}`, SEND_LIMIT).ok) {
    return {
      ok: false,
      error: "Too many code requests. Please try again later.",
    };
  }

  const email = adminEmail();
  try {
    await ensureAdminUser(email);
    // Generates + stores (hashed) the code and triggers the Discord DM
    // through the plugin's sendVerificationOTP hook.
    const sent = await auth.api.sendVerificationOTP({
      body: { email, type: "sign-in" },
    });
    if (!sent?.success) {
      throw new Error("sendVerificationOTP did not confirm success");
    }
  } catch (error) {
    console.error("[otp] requesting login code failed:", error);
    return {
      ok: false,
      error: "Could not send the code right now. Please try again shortly.",
    };
  }

  lastSentAtByIp.set(ip, Date.now());
  return { ok: true, cooldownMs: RESEND_COOLDOWN_MS };
}

export async function verifyLoginCode(input: unknown): Promise<VerifyResult> {
  const parsed = loginOtpSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Enter the 6-character code." };
  }

  const ip = clientIpFromHeaders(await headers());
  if (!checkRateLimit(`login-verify:${ip}`, VERIFY_SHIELD).ok) {
    return { ok: false, error: "Too many attempts. Please wait a minute." };
  }

  const email = adminEmail();
  try {
    const result = await auth.api.signInEmailOTP({
      body: {
        email,
        otp: parsed.data.code,
        name: "Admin",
      },
    });
    if (!result?.user?.id) {
      return { ok: false, error: "Invalid or expired code." };
    }
    return { ok: true };
  } catch {
    // Invalid, expired, or too-many-attempts all collapse into one generic
    // message so nothing about the account/state leaks to the network.
    return { ok: false, error: "Invalid or expired code." };
  }
}
