import { getDiscordConfig } from "@/server/discord/env";
import { sendOwnerDm } from "@/server/discord/rest";

/**
 * Delivers a sign-in OTP to the portfolio owner's Discord DMs via the
 * send-only bot. Returns false (with a server-side diagnostic) whenever the
 * bot is unconfigured or the API call fails - the browser never learns why,
 * it only sees the generic "could not send" state.
 */
export async function sendLoginOtpToOwner({
  code,
}: {
  code: string;
}): Promise<boolean> {
  const config = getDiscordConfig();
  if (!config) {
    console.error(
      "[otp] DISCORD_BOT_TOKEN / DISCORD_OWNER_USER_ID missing - login code could not be sent",
    );
    return false;
  }

  return sendOwnerDm(config, {
    content:
      `🔐 **Portfolio admin login code**\n` +
      `\`${code}\`\n` +
      `-# Valid for 3 minutes · single use · ${new Date()
        .toISOString()
        .slice(0, 16)
        .replace("T", " ")} UTC`,
  });
}
