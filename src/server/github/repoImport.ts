import prisma from "@/lib/dbClient/prisma";
import { slugify, truncate } from "@/lib/content";

const GITHUB_API = "https://api.github.com";

interface RepoRef {
  owner: string;
  repo: string;
}

interface GitHubRepo {
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  homepage: string | null;
  language: string | null;
  topics?: string[];
  stargazers_count: number;
  fork: boolean;
  pushed_at?: string;
}

export type ImportResult =
  | { ok: false; reason: "invalid-url" }
  | { ok: false; reason: "not-found" }
  | { ok: false; reason: "rate-limited" }
  | { ok: false; reason: "error"; detail?: string }
  | {
      ok: true;
      project: {
        slug: string;
        title: string;
        summary: string;
        category: string;
        stars: number;
        tech: string[];
        repoUrl: string;
        liveUrl: string | null;
        readmeChars: number;
        isFork: boolean;
      };
    };

export function parseRepoInput(raw: string): RepoRef | null {
  const input = raw.trim();
  if (!input) return null;

  const urlMatch = input.match(
    /(?:git@github\.com:|github\.com[/:])([\w.-]+)\/([\w.-]+?)(?:\.git)?(?:[/#?].*)?$/i,
  );
  if (urlMatch) {
    return normalize({ owner: urlMatch[1], repo: urlMatch[2] });
  }

  const shorthandMatch = input.match(/^([\w.-]+)\/([\w.-]+)$/);
  if (shorthandMatch) {
    return normalize({
      owner: shorthandMatch[1],
      repo: shorthandMatch[2],
    });
  }

  return null;
}

function normalize(ref: RepoRef): RepoRef | null {
  const owner = ref.owner.trim();
  const repo = ref.repo.replace(/\.git$/i, "").trim();
  if (!owner || !repo || !/^[\w.-]+$/.test(repo)) return null;
  return { owner, repo };
}

async function githubFetch<T>(
  path: string,
): Promise<{ ok: true; data: T } | { ok: false; status: number }> {
  let response: Response;
  try {
    response = await fetch(`${GITHUB_API}${path}`, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "portfolio-site",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
  } catch (error) {
    console.error("[github] request failed:", error);
    return { ok: false, status: 0 };
  }

  if (response.status === 403 || response.status === 429) {
    return { ok: false, status: response.status };
  }
  if (!response.ok) return { ok: false, status: response.status };

  return { ok: true, data: (await response.json()) as T };
}

function decodeBase64Utf8(base64: string): string {
  const bytes = Uint8Array.from(atob(base64.replace(/\n/g, "")), (char) =>
    char.charCodeAt(0),
  );
  return new TextDecoder().decode(bytes);
}

async function uniqueProjectSlug(base: string): Promise<string> {
  let slug = base;
  let counter = 2;
  while ((await prisma.project.findUnique({ where: { slug } })) !== null) {
    slug = `${base}-${counter}`;
    counter += 1;
  }
  return slug;
}

function buildTechStack(
  language: string | null,
  topics: string[] | undefined,
): string[] {
  const seen = new Set<string>();
  const stack: string[] = [];
  for (const item of [language ?? "", ...(topics ?? [])]) {
    const label = item.trim();
    const key = label.toLowerCase();
    if (!label || seen.has(key) || stack.length >= 8) continue;
    seen.add(key);
    stack.push(label);
  }
  return stack;
}

function buildCategory(language: string | null, topics: string[] | undefined) {
  const source = topics?.[0]?.trim() || language?.trim() || "";
  if (!source) return "General";
  return source.charAt(0).toUpperCase() + source.slice(1);
}

export async function importProjectFromGitHub(
  raw: string,
  categoryOverride?: string,
): Promise<ImportResult> {
  const ref = parseRepoInput(raw);
  if (!ref) return { ok: false, reason: "invalid-url" };

  const repoResult = await githubFetch<GitHubRepo>(
    `/repos/${ref.owner}/${ref.repo}`,
  );
  if (!repoResult.ok) {
    if (repoResult.status === 404) return { ok: false, reason: "not-found" };
    if (repoResult.status === 403 || repoResult.status === 429)
      return { ok: false, reason: "rate-limited" };
    return { ok: false, reason: "error", detail: `HTTP ${repoResult.status}` };
  }
  const repo = repoResult.data;

  const readmeResult = await githubFetch<{ content?: string }>(
    `/repos/${ref.owner}/${ref.repo}/readme`,
  );
  const readme =
    readmeResult.ok && readmeResult.data.content ?
      decodeBase64Utf8(readmeResult.data.content)
    : "";

  const tech = buildTechStack(repo.language, repo.topics);
  const override = categoryOverride?.trim().slice(0, 40) ?? "";
  const category = override || buildCategory(repo.language, repo.topics);
  const summary =
    repo.description?.trim() ||
    `${repo.language ?? "Open source"} project${tech.length ? ` built with ${tech.slice(0, 3).join(", ")}` : ""}.`;

  const homepage = repo.homepage?.trim() ?? "";
  const liveUrl = /^https?:\/\/\S+$/i.test(homepage) ? homepage : null;

  const aggregate = await prisma.project.aggregate({
    _max: { sortOrder: true },
  });

  const created = await prisma.project.create({
    data: {
      slug: await uniqueProjectSlug(slugify(repo.name)),
      title: repo.name,
      summary,
      description: readme || summary,
      techStack: JSON.stringify(tech),
      category,
      repoUrl: repo.html_url,
      liveUrl,
      featured: false,
      published: true,
      sortOrder: (aggregate._max.sortOrder ?? 0) + 1,
      repoUpdatedAt: repo.pushed_at ? new Date(repo.pushed_at) : null,
    },
  });

  return {
    ok: true,
    project: {
      slug: created.slug,
      title: created.title,
      summary: truncate(created.summary, 200),
      category: created.category,
      stars: repo.stargazers_count,
      tech,
      repoUrl: repo.html_url,
      liveUrl,
      readmeChars: (readme || summary).length,
      isFork: repo.fork,
    },
  };
}
