import { prismaAdapter } from "@better-auth/prisma-adapter";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";

import prisma from "@/lib/dbClient/prisma";
import { serverEnv } from "@/lib/env/serverEnv";

export const auth = betterAuth({
  ...(serverEnv.BETTER_AUTH_URL ? { baseURL: serverEnv.BETTER_AUTH_URL } : {}),
  database: prismaAdapter(prisma, {
    provider: "sqlite",
  }),
  emailAndPassword: {
    enabled: true,
  },
  // Brute-force protection. Enabled explicitly (not just NODE_ENV-dependent)
  // so behavior is identical everywhere. The framework additionally applies
  // its built-in special rule of 3 requests / 10s to POST /sign-in/email,
  // which caps password guessing well below this window's general budget.
  // Single-instance app -> the default in-memory store is appropriate.
  rateLimit: {
    enabled: true,
    window: 60, // seconds
    max: 30,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  plugins: [nextCookies()],
});
