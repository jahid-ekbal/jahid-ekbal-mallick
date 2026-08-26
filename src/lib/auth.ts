import { prismaAdapter } from "@better-auth/prisma-adapter";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { emailOTP } from "better-auth/plugins";
import { randomInt } from "node:crypto";

import prisma from "@/lib/dbClient/prisma";
import { serverEnv } from "@/lib/env/serverEnv";
import { sendLoginOtpToOwner } from "@/server/auth/discordOtp";

// Ambiguous glyphs removed (I, O look like 1 / 0); digits + capitals only.
const OTP_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/**
 * 6-character code mixing CAPITAL letters and numbers (at least one of each),
 * drawn with cryptographic randomness. Wired into the email-otp plugin below
 * via its generateOTP option; storage stays SHA-256-hashed server-side.
 */
function generateLoginOtp(): string {
  let code: string;
  do {
    code = Array.from(
      { length: 6 },
      () => OTP_ALPHABET[randomInt(OTP_ALPHABET.length)],
    ).join("");
  } while (!/[A-Z]/.test(code) || !/[0-9]/.test(code));
  return code;
}

export const auth = betterAuth({
  ...(serverEnv.BETTER_AUTH_URL ? { baseURL: serverEnv.BETTER_AUTH_URL } : {}),
  database: prismaAdapter(prisma, {
    provider: "sqlite",
  }),
  // Password sign-in is intentionally DISABLED: the only way into the admin
  // dashboard is a time-limited OTP delivered to the owner's Discord DMs.
  // POST /api/auth/sign-in/email no longer exists, removing the entire
  // credential-guessing attack surface.
  emailAndPassword: {
    enabled: false,
  },
  // Brute-force protection for the remaining auth endpoints. The email-otp
  // plugin additionally ships per-path limits (see its config below).
  rateLimit: {
    enabled: true,
    window: 60, // seconds
    max: 30,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  plugins: [
    emailOTP({
      otpLength: 6,
      expiresIn: 180, // 3 minutes
      generateOTP: () => generateLoginOtp(),
      storeOTP: "hashed", // SHA-256 at rest, constant-time comparison
      allowedAttempts: 5, // TOO_MANY_ATTEMPTS afterwards
      disableSignUp: true, // only the provisioned admin can ever sign in
      rateLimit: {
        window: 60,
        max: 3,
      },
      async sendVerificationOTP({ email, otp, type }) {
        // Delivery goes to the owner's Discord DMs; emails are not used.
        if (type !== "sign-in") return;
        const delivered = await sendLoginOtpToOwner({ code: otp });
        if (!delivered) {
          console.error(
            `[otp] failed to deliver login code to Discord (email=${email})`,
          );
        }
      },
    }),
    nextCookies(),
  ],
});
