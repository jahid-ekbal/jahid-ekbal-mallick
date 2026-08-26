import { createEnv } from "@t3-oss/env-nextjs";
import z from "zod";

const optionalDiscordVar = z.preprocess(
  (value) =>
    typeof value === "string" && value.trim() === "" ? undefined : value,
  z.string().min(1).optional(),
);

export const serverEnv = createEnv({
  server: {
    DATABASE_URL: z
      .string()
      .regex(/^file:\.\/|^libsql:\/\//, {
        error:
          "DATABASE_URL must start with file:./ (local SQLite) or libsql:// (Turso)",
      })
      .min(1, { error: "DATABASE_URL is required" }),
    TURSO_AUTH_TOKEN: optionalDiscordVar,
    NEXT_TELEMETRY_DISABLED: z.enum(["1", "0"]).optional(),
    CHECKPOINT_DISABLE: z.enum(["1", "0"]).optional(),
    DISCORD_BOT_TOKEN: optionalDiscordVar,
    DISCORD_APPLICATION_ID: optionalDiscordVar,
    DISCORD_PUBLIC_KEY: optionalDiscordVar,
    DISCORD_OWNER_USER_ID: optionalDiscordVar,
    DISCORD_LOG_CHANNEL_ID: optionalDiscordVar,
  },
  experimental__runtimeEnv: process.env,
});
