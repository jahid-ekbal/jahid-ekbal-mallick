import type { EmbedPayload } from "../types";
import { ephemeralEmbeds } from "./responses";

const COMMAND_LIST = [
  "**/help** - Show this command reference",
  "**/newblog** - Compose a new blog post draft",
  "**/editblog `id:`** - Edit an existing post",
  "**/publish `id:`** - Publish a draft to the live site",
  "**/unpublish `id:`** - Move a published post back to drafts",
  "**/deleteblog `id:`** - Delete a post (asks to confirm)",
  "**/listblogs** - List all posts with IDs and status",
  "**/addrepo `url:` `[category:]`** - Import a GitHub repo as a project",
  "**/messages `count:`** - Latest contact form submissions",
  "**/ping** - Health check",
].join("\n");

export async function handleHelp() {
  const embed: EmbedPayload = {
    title: "🤖 Portfolio Bot",
    description: [
      "Private control plane for your portfolio.",
      "",
      COMMAND_LIST,
      "",
      "_Blog posts start as drafts - nothing goes live until you run `/publish`._",
    ].join("\n"),
    color: 0x5865f2,
  };
  return ephemeralEmbeds([embed]);
}
