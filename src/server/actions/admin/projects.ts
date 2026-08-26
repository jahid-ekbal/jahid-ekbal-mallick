"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/lib/dbClient/prisma";
import { slugify } from "@/lib/content";
import { projectSchema, githubImportSchema } from "@/lib/zodSchema";
import { requireAdminSession } from "./guard";
import { importProjectFromGitHub } from "@/server/github/repoImport";

export type AdminResult =
  { ok: true; id?: string } | { ok: false; error: string };

function revalidateAdminPaths(slug?: string): void {
  revalidatePath("/admin/projects");
  if (slug) revalidatePath(`/projects/${slug}`);
  revalidatePath("/projects");
  revalidatePath("/");
}

async function uniqueProjectSlug(
  base: string,
  ignoreId?: string,
): Promise<string> {
  let slug = base;
  let counter = 2;
  for (;;) {
    const existing = await prisma.project.findUnique({ where: { slug } });
    if (!existing || existing.id === ignoreId) return slug;
    slug = `${base}-${counter}`;
    counter += 1;
  }
}

export async function saveProject(input: unknown): Promise<AdminResult> {
  await requireAdminSession();

  const parsed = projectSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Please fix the highlighted fields." };
  }
  const data = parsed.data;

  const baseSlug = data.slug?.trim() ? data.slug : slugify(data.title);

  try {
    if (data.id) {
      const current = await prisma.project.findUnique({
        where: { id: data.id },
      });
      if (!current) return { ok: false, error: "Project not found." };

      const updated = await prisma.project.update({
        where: { id: data.id },
        data: {
          title: data.title,
          slug: await uniqueProjectSlug(baseSlug, data.id),
          summary: data.summary,
          description: data.description,
          coverImage: data.coverImage || null,
          techStack: JSON.stringify(splitList(data.techStack)),
          category: data.category,
          repoUrl: data.repoUrl || null,
          liveUrl: data.liveUrl || null,
          featured: data.featured,
          published: data.published,
        },
      });
      revalidateAdminPaths(updated.slug);
      return { ok: true, id: updated.id };
    }

    const aggregate = await prisma.project.aggregate({
      _max: { sortOrder: true },
    });
    const created = await prisma.project.create({
      data: {
        slug: await uniqueProjectSlug(baseSlug),
        title: data.title,
        summary: data.summary,
        description: data.description,
        coverImage: data.coverImage || null,
        techStack: JSON.stringify(splitList(data.techStack)),
        category: data.category,
        repoUrl: data.repoUrl || null,
        liveUrl: data.liveUrl || null,
        featured: data.featured,
        published: data.published,
        sortOrder: (aggregate._max.sortOrder ?? 0) + 1,
      },
    });
    revalidateAdminPaths(created.slug);
    return { ok: true, id: created.id };
  } catch (error) {
    console.error("[admin] saveProject failed:", error);
    return { ok: false, error: "Something went wrong saving the project." };
  }
}

function splitList(raw: string): string[] {
  return raw
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 12);
}

export async function setProjectPublished(
  id: string,
  published: boolean,
): Promise<AdminResult> {
  await requireAdminSession();
  try {
    await prisma.project.update({ where: { id }, data: { published } });
    revalidatePath("/admin/projects");
    revalidatePath("/projects");
    return { ok: true };
  } catch {
    return { ok: false, error: "Could not update the project." };
  }
}

export async function deleteProject(id: string): Promise<AdminResult> {
  await requireAdminSession();
  try {
    await prisma.project.delete({ where: { id } });
    revalidatePath("/admin/projects");
    revalidatePath("/projects");
    return { ok: true };
  } catch {
    return { ok: false, error: "Could not delete the project." };
  }
}

export async function importGithubProject(
  input: unknown,
): Promise<
  | { ok: true; projectId: string; title: string; slug: string }
  | { ok: false; error: string }
> {
  await requireAdminSession();

  const parsed = githubImportSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Enter a GitHub repo URL or owner/name." };
  }

  const result = await importProjectFromGitHub(
    parsed.data.repo,
    parsed.data.category,
  );
  if (!result.ok) {
    const messages: Record<string, string> = {
      "invalid-url": "That does not look like a GitHub repo.",
      "not-found": "Repo not found (is it public?).",
      "rate-limited": "GitHub rate limit hit - try again in a little while.",
      error: `Import failed${"detail" in result && result.detail ? ` (${result.detail})` : ""}.`,
    };
    return { ok: false, error: messages[result.reason] ?? "Import failed." };
  }

  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  return {
    ok: true,
    projectId: "",
    title: result.project.title,
    slug: result.project.slug,
  };
}
