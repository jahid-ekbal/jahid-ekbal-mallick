import { InteractionType } from "discord-interactions";
import { getDiscordConfig } from "./env";
import type { DiscordUser, Interaction, InteractionResponse } from "./types";
import { ephemeralMessage } from "./handlers/responses";
import { handlePing } from "./handlers/ping";
import { handleHelp } from "./handlers/help";
import {
  handleNewBlogCommand,
  handleNewBlogModalSubmit,
} from "./handlers/newblog";
import {
  handleEditBlogCommand,
  handleEditBlogModalSubmit,
  isEditBlogModal,
} from "./handlers/editblog";
import { handlePublishCommand } from "./handlers/publish";
import { handleUnpublishCommand } from "./handlers/unpublish";
import {
  handleDeleteBlogCommand,
  handleDeleteButton,
  isDeleteButton,
} from "./handlers/deleteblog";
import { handleListBlogs } from "./handlers/listblogs";
import { handleMessagesCommand } from "./handlers/messages";
import { handleAddRepoCommand } from "./handlers/addrepo";
import { MODAL_CUSTOM_IDS } from "./commands";

const OWNER_ONLY_MESSAGE =
  "⛔ This bot is private and restricted to its owner. Thanks for your interest!";

export function getInteractionUser(
  interaction: Interaction,
): DiscordUser | undefined {
  return interaction.user ?? interaction.member?.user;
}

export async function handleInteraction(
  interaction: Interaction,
): Promise<InteractionResponse> {
  const config = getDiscordConfig();
  const user = getInteractionUser(interaction);

  if (!config || !user || user.id !== config.ownerUserId) {
    return ephemeralMessage(OWNER_ONLY_MESSAGE);
  }

  switch (interaction.type) {
    case InteractionType.APPLICATION_COMMAND:
      return dispatchCommand(interaction);
    case InteractionType.MODAL_SUBMIT:
      return dispatchModalSubmit(interaction);
    case InteractionType.MESSAGE_COMPONENT:
      return dispatchComponent(interaction);
    default:
      return ephemeralMessage("🤷 Unsupported interaction type.");
  }
}

async function dispatchCommand(
  interaction: Interaction,
): Promise<InteractionResponse> {
  switch (interaction.data?.name) {
    case "ping":
      return handlePing();
    case "help":
      return handleHelp();
    case "newblog":
      return handleNewBlogCommand();
    case "editblog":
      return withErrorBoundary(() => handleEditBlogCommand(interaction));
    case "publish":
      return withErrorBoundary(() => handlePublishCommand(interaction));
    case "unpublish":
      return withErrorBoundary(() => handleUnpublishCommand(interaction));
    case "deleteblog":
      return withErrorBoundary(() => handleDeleteBlogCommand(interaction));
    case "listblogs":
      return withErrorBoundary(() => handleListBlogs());
    case "addrepo":
      return withErrorBoundary(() => handleAddRepoCommand(interaction));
    case "messages":
      return withErrorBoundary(() => handleMessagesCommand(interaction));
    default:
      return ephemeralMessage("Unknown command.");
  }
}

async function dispatchModalSubmit(
  interaction: Interaction,
): Promise<InteractionResponse> {
  const customId = interaction.data?.custom_id ?? "";

  if (customId === MODAL_CUSTOM_IDS.newBlog) {
    return withErrorBoundary(() => handleNewBlogModalSubmit(interaction));
  }
  if (isEditBlogModal(customId)) {
    return withErrorBoundary(() => handleEditBlogModalSubmit(interaction));
  }
  return ephemeralMessage("Unknown form submission.");
}

async function dispatchComponent(
  interaction: Interaction,
): Promise<InteractionResponse> {
  const customId = interaction.data?.custom_id ?? "";

  if (isDeleteButton(customId)) {
    return withErrorBoundary(() => handleDeleteButton(interaction));
  }
  return ephemeralMessage("Unknown action.");
}

async function withErrorBoundary(
  run: () => Promise<InteractionResponse>,
): Promise<InteractionResponse> {
  try {
    return await run();
  } catch (error) {
    console.error("[discord] handler error:", error);
    return ephemeralMessage(
      "💥 Something went wrong on the server. Try again in a moment.",
    );
  }
}
