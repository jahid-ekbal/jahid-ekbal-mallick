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
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  plugins: [nextCookies()],
});
