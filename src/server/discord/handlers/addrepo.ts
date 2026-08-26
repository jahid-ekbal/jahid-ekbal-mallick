import type { Interaction } from "../types";
import { getOptionValue, truncate } from "../utils";
import { importProjectFromGitHub } from "../githubService";
import { ephemeralEmbeds, ephemeralMessage } from "./responses";

type ImportOutcome = Awaited<ReturnType<typeof importProjectFromGitHub>>;
type FailedImport = Exclude<ImportOutcome, { ok: true }>;

function failureMessage(result: FailedImport) {
  switch (result.reason) {
    case "invalid-url":
      return ephemeralMessage(
        "⚠️ That doesn't look like a GitHub repo. Use `https://github.com/owner/repo` or `owner/repo`.",
      );
    case "not-found":
      return ephemeralMessage(
        "⚠️ Repository not found. Check the URL - private repos can't be imported (the GitHub API is used unauthenticated).",
      );
    case "rate-limited":
      return ephemeralMessage(
        "⚠️ GitHub API rate limit reached (60 requests/hour unauthenticated). Try again later.",
      );
    default:
      return ephemeralMessage(
        `💥 GitHub import failed${result.detail ? ` (${result.detail})` : ""}. Try again in a moment.`,
      );
  }
}

export async function handleAddRepoCommand(interaction: Interaction) {
  const raw = getOptionValue(interaction, "url");
  if (!raw?.trim()) {
    return ephemeralMessage(
      "⚠️ Provide a repository URL, e.g. `/addrepo url:https://github.com/owner/repo`.",
    );
  }

  const result = await importProjectFromGitHub(
    raw,
    getOptionValue(interaction, "category"),
  );

  if (!result.ok) {
    return failureMessage(result);
  }

  const project = result.project;
  const links = [
    project.liveUrl ? `[Live site](${project.liveUrl})` : null,
    `[Repository](${project.repoUrl})`,
  ]
    .filter(Boolean)
    .join(" | ");

  return ephemeralEmbeds([
    {
      title: `✅ Imported ${project.title}`,
      description:
        `${project.summary}\n\n${links}` +
        (project.isFork ? "\n\n🍴 Note: this is a fork." : ""),
      color: 0x22c55e,
      fields: [
        { name: "Slug", value: `\`${project.slug}\``, inline: true },
        { name: "Category", value: project.category, inline: true },
        { name: "Stars", value: `⭐ ${project.stars}`, inline: true },
        {
          name: "Tech stack",
          value: truncate(project.tech.join(", ") || "-", 1024),
          inline: false,
        },
        {
          name: "README",
          value: `${project.readmeChars} chars imported as the case study`,
          inline: false,
        },
      ],
      footer: {
        text: "Live on /projects within ~5 min | refine in Prisma Studio",
      },
      timestamp: new Date().toISOString(),
    },
  ]);
}
