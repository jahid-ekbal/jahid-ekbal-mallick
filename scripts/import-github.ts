import "dotenv/config";
import { PrismaClient } from "@generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { serverEnv } from "../src/lib/env/serverEnv";
import { importProjectFromGitHub } from "../src/server/github/repoImport";

// Bulk import all public, non-fork repos for a GitHub user into the Project table.
// Reuses src/server/github/repoImport.ts (same tech/category derivation) and
// skips any repoUrl already present. Token is optional (60 req/hr anonymous, higher
// with GITHUB_TOKEN / GH_TOKEN).

type Args = {
  dryRun: boolean;
  username: string;
  token?: string;
  limit?: number;
  help: boolean;
};

function parseArgs(argv: string[]): Args {
  let dryRun = false;
  let username = "jahid-ekbal";
  let token: string | undefined;
  let limit: number | undefined;
  let help = false;

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--dry-run" || arg === "--dryRun") dryRun = true;
    else if (arg === "--help" || arg === "-h") help = true;
    else if (arg === "--username" || arg === "--user" || arg === "-u") {
      const next = argv[++i];
      if (next) username = next.trim();
    } else if (arg.startsWith("--username=")) {
      username = arg.slice("--username=".length).trim() || username;
    } else if (arg === "--token" || arg === "-t") {
      const next = argv[++i];
      if (next) token = next.trim();
    } else if (arg.startsWith("--token=")) {
      token = arg.slice("--token=".length).trim() || token;
    } else if (arg === "--limit" || arg === "-l") {
      const next = argv[++i];
      if (next) limit = Number.parseInt(next, 10) || undefined;
    } else if (arg.startsWith("--limit=")) {
      const raw = arg.slice("--limit=".length);
      limit = Number.parseInt(raw, 10) || undefined;
    }
  }

  return { dryRun, username, token, limit, help };
}

function printHelp(): void {
  console.log(`
Usage: bun scripts/import-github.ts [options]

Bulk-import every public, non-fork repo for a GitHub user into the local Project
table. Skips repos whose repoUrl already exists; derives techStack / category
through the same logic as the admin single-import (src/server/github/repoImport.ts).

Options:
  --username <name>   GitHub handle to crawl (default: jahid-ekbal)
  --token <pat>       GitHub PAT (or set GITHUB_TOKEN / GH_TOKEN in env).
                      Without a token the API is 60 req/hr anonymously.
  --dry-run           List what would be imported without writing to the DB.
  --limit <n>         Only process the first n repos (useful for testing).
  -h, --help          Show this help.

Examples:
  bun scripts/import-github.ts --dry-run
  GITHUB_TOKEN=ghp_xxx bun scripts/import-github.ts
  bun scripts/import-github.ts --limit 5 --dry-run
`);
}

const prisma = new PrismaClient({
  adapter: new PrismaLibSql({
    url: serverEnv.DATABASE_URL,
    ...(serverEnv.TURSO_AUTH_TOKEN ?
      { authToken: serverEnv.TURSO_AUTH_TOKEN }
    : {}),
  }),
});

interface ListedRepo {
  name: string;
  full_name: string;
  html_url: string;
  fork: boolean;
  private: boolean;
  description: string | null;
}

async function listUserRepos(
  username: string,
  token?: string,
): Promise<ListedRepo[]> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "portfolio-bulk-import",
    "X-GitHub-Api-Version": "2022-11-28",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const all: ListedRepo[] = [];
  let page = 1;

  while (true) {
    const url =
      `https://api.github.com/users/${encodeURIComponent(username)}/repos` +
      `?per_page=100&page=${page}&sort=updated&type=public`;

    console.log(`  fetching page ${page} ...`);
    let response: Response;
    try {
      response = await fetch(url, { headers });
    } catch (error) {
      throw new Error(
        `Network failure fetching ${url}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }

    if (response.status === 404) {
      throw new Error(`GitHub user "${username}" not found (404).`);
    }
    if (response.status === 403 || response.status === 429) {
      const remaining = response.headers.get("x-ratelimit-remaining");
      const reset = response.headers.get("x-ratelimit-reset");
      const resetAt =
        reset ? new Date(Number(reset) * 1000).toISOString() : "unknown";
      throw new Error(
        `Rate-limited by GitHub (HTTP ${response.status}, remaining=${remaining ?? "?"} reset=${resetAt}). ` +
          `Set GITHUB_TOKEN / GH_TOKEN and retry.`,
      );
    }
    if (!response.ok) {
      throw new Error(
        `GitHub list failed HTTP ${response.status} ${response.statusText} for ${url}`,
      );
    }

    const batch = (await response.json()) as ListedRepo[];
    if (!Array.isArray(batch) || batch.length === 0) break;
    all.push(...batch);
    if (batch.length < 100) break;
    page += 1;
    if (page > 20) break; // safety cap: 2000 repos
  }

  return all;
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }

  // Wire explicit --token into the env surface that src/server/github/repoImport.ts reads.
  const effectiveToken =
    args.token?.trim() ||
    process.env.GITHUB_TOKEN?.trim() ||
    process.env.GH_TOKEN?.trim() ||
    process.env.GITHUB_PAT?.trim() ||
    undefined;
  if (args.token?.trim()) {
    process.env.GITHUB_TOKEN = args.token.trim();
  }

  console.log("\nBulk GitHub import");
  console.log(`  user:     ${args.username}`);
  console.log(`  dry-run:  ${args.dryRun ? "yes" : "no"}`);
  console.log(
    `  token:    ${effectiveToken ? "present" : "none (60 req/hr anonymous)"}`,
  );
  if (args.limit) console.log(`  limit:    ${args.limit}`);
  console.log(`  database: ${serverEnv.DATABASE_URL.slice(0, 48)}...`);

  const existing = await prisma.project.findMany({
    select: { repoUrl: true },
  });
  const existingUrls = new Set(
    existing.map((p) => p.repoUrl?.trim()).filter(Boolean) as string[],
  );
  console.log(`\nExisting projects in DB: ${existing.length}`);

  const repos = await listUserRepos(args.username, effectiveToken);
  console.log(
    `Fetched ${repos.length} public repos from GitHub for ${args.username}`,
  );

  const nonForks = repos.filter((r) => !r.fork && !r.private);
  console.log(
    `  non-fork public: ${nonForks.length} (skipping ${repos.length - nonForks.length} forks/private)`,
  );

  let skippedExisting = 0;
  const candidates: ListedRepo[] = [];
  for (const repo of nonForks) {
    if (existingUrls.has(repo.html_url)) {
      skippedExisting += 1;
      continue;
    }
    // also handle trailing .git or http vs https variants – html_url is canonical from API.
    candidates.push(repo);
  }

  console.log(`  skip existing (repoUrl already in DB): ${skippedExisting}`);
  console.log(`  candidates for import: ${candidates.length}`);

  if (candidates.length === 0) {
    console.log(
      "\nNothing to import — all listed repos already exist in the DB.",
    );
    return;
  }

  let working = candidates;
  if (args.limit && args.limit > 0) {
    working = candidates.slice(0, args.limit);
    console.log(`  (limited to first ${working.length} by --limit)`);
  }

  if (args.dryRun) {
    console.log("\n[dry-run] Would import:");
    for (const repo of working) {
      console.log(
        `  - ${repo.full_name} -> ${repo.html_url} — ${repo.description?.slice(0, 80) ?? ""}`,
      );
    }
    if (candidates.length > working.length) {
      console.log(
        `  ... and ${candidates.length - working.length} more (use --limit to page)`,
      );
    }
    return;
  }

  console.log(`\nImporting ${working.length} repos sequentially...`);
  let imported = 0;
  let failed = 0;
  let rateLimited = 0;

  for (let idx = 0; idx < working.length; idx++) {
    const repo = working[idx]!;
    const ref = `${args.username}/${repo.name}`;
    process.stdout.write(`  [${idx + 1}/${working.length}] ${ref} ... `);
    const result = await importProjectFromGitHub(ref);
    if (result.ok) {
      imported += 1;
      console.log(
        `ok -> slug=${result.project.slug} tech=[${result.project.tech.join(", ")}]`,
      );
    } else {
      if (result.reason === "rate-limited") {
        rateLimited += 1;
        console.log(`rate-limited — aborting remaining. Set GITHUB_TOKEN.`);
        break;
      }
      failed += 1;
      const detail =
        "detail" in result && result.detail ? ` (${result.detail})` : "";
      console.log(`failed (${result.reason}${detail})`);
    }

    // Gentle pacing to stay under secondary limits.
    if (idx < working.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 350));
    }
  }

  console.log("\nDone.");
  console.log(`  imported:       ${imported}`);
  console.log(`  failed:         ${failed}`);
  console.log(`  rate-limited:   ${rateLimited}`);
  console.log(`  skipped (already in DB): ${skippedExisting}`);
  console.log(`  total listed:   ${repos.length}`);

  const total = await prisma.project.count();
  console.log(`  total projects in DB now: ${total}`);

  if (!effectiveToken && (rateLimited > 0 || failed > 0)) {
    console.log(
      "\nTip: authenticate to raise the GitHub limit from 60 to 5000 req/hr:\n" +
        "  GITHUB_TOKEN=ghp_xxx bun scripts/import-github.ts\n" +
        "Create a fine-grained PAT (no scopes needed for public repos) at https://github.com/settings/tokens",
    );
  }
}

try {
  await main();
} catch (error) {
  console.error(
    "\nBulk import failed:",
    error instanceof Error ? error.message : error,
  );
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
