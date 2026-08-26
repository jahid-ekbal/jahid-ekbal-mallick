import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

function run(cmd: string[], label: string): void {
  console.log(`\n==> ${label}`);
  const result = spawnSync(cmd[0]!, cmd.slice(1), {
    cwd: root,
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  if (result.status !== 0) {
    console.error(`Deploy aborted at: ${label}`);
    process.exit(result.status ?? 1);
  }
}

const commitMsg =
  process.argv
    .slice(2)
    .filter((a) => a !== "--")
    .join(" ") || "chore: deploy updates";

run(["bun", "run", "lint"], "Type-checking and linting");
run(["bun", "run", "build"], "Building production bundle");
run(
  ["bunx", "prisma", "migrate", "deploy"],
  "Applying migrations to remote database (DATABASE_URL must point at Turso)",
);
run(["bun", "prisma/seed.ts"], "Seeding remote database");

console.log("\n==> Committing and pushing (triggers Vercel auto-deploy)");

const status = spawnSync("git", ["status", "--porcelain"], {
  cwd: root,
  encoding: "utf8",
  shell: process.platform === "win32",
});
if ((status.stdout ?? "").trim().length > 0) {
  const add = spawnSync("git", ["add", "-A"], {
    cwd: root,
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  if (add.status !== 0) process.exit(add.status ?? 1);

  const commit = spawnSync("git", ["commit", "-m", commitMsg], {
    cwd: root,
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  if (commit.status !== 0) {
    console.error("Commit failed - resolve and re-run `bun run deploy`.");
    process.exit(commit.status ?? 1);
  }
} else {
  console.log("Working tree clean - nothing to commit.");
}

run(["git", "push"], "Pushing to origin");

console.log(`
Deploy pipeline finished.
  - Vercel will build and serve the pushed commit automatically.
  - Verify Vercel env vars: DATABASE_URL, TURSO_AUTH_TOKEN, BETTER_AUTH_SECRET,
    NEXT_PUBLIC_SITE_URL, DISCORD_BOT_TOKEN, DISCORD_OWNER_USER_ID,
    DISCORD_LOG_CHANNEL_ID (optional).
`);
