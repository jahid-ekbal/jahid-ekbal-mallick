import { COMMAND_DEFINITIONS } from "../src/server/discord/commands";

const token = process.env.DISCORD_BOT_TOKEN?.trim();
const applicationId = process.env.DISCORD_APPLICATION_ID?.trim();

if (!token || !applicationId) {
  console.error(
    "Missing DISCORD_BOT_TOKEN or DISCORD_APPLICATION_ID. Fill them in .env first.",
  );
  process.exit(1);
}

const response = await fetch(
  `https://discord.com/api/v10/applications/${applicationId}/commands`,
  {
    method: "PUT",
    headers: {
      Authorization: `Bot ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(COMMAND_DEFINITIONS),
  },
);

if (!response.ok) {
  console.error(
    `Failed to register commands (${response.status}):`,
    await response.text(),
  );
  process.exit(1);
}

const registered = (await response.json()) as { name: string }[];
console.log(
  `✅ Registered ${registered.length} global slash commands:`,
  registered.map((c) => `/${c.name}`).join(", "),
);
