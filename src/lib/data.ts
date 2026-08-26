import { cache } from "react";

import prisma from "@/lib/dbClient/prisma";

export type Socials = {
  github?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  youtube?: string;
  discord?: string;
  whatsapp?: string;
  telegram?: string;
  signal?: string;
};

export type SkillGroup = { category: string; items: string[] };

export type ExperienceItem = {
  role: string;
  company: string;
  period: string;
  description?: string;
};

export type EducationItem = {
  degree: string;
  school: string;
  period: string;
  description?: string;
  url?: string;
};

export type Profile = {
  name: string;
  headline: string;
  tagline: string;
  bio: string;
  location: string;
  email: string;
  avatarUrl: string | null;
  resumeUrl: string | null;
  socials: Socials;
  skills: SkillGroup[];
  experiences: ExperienceItem[];
  education: EducationItem[];
};

export type Project = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  coverImage: string | null;
  techStack: string[];
  category: string;
  repoUrl: string | null;
  liveUrl: string | null;
  featured: boolean;
  repoUpdatedAt: Date | null;
};

export type PostSummary = {
  seq: number;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string | null;
  tags: string[];
  readingTime: number;
  publishedAt: Date | null;
};

function parseJson<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export const getProfile = cache(async (): Promise<Profile | null> => {
  const row = await prisma.profile.findUnique({ where: { id: "main" } });
  if (!row) return null;

  return {
    name: row.name,
    headline: row.headline,
    tagline: row.tagline,
    bio: row.bio,
    location: row.location,
    email: row.email,
    avatarUrl: row.avatarUrl,
    resumeUrl: row.resumeUrl,
    socials: parseJson<Socials>(row.socials, {}),
    skills: parseJson<SkillGroup[]>(row.skills, []),
    experiences: parseJson<ExperienceItem[]>(row.experiences, []),
    education: parseJson<EducationItem[]>(row.education, []),
  };
});

const toProject = (row: {
  slug: string;
  title: string;
  summary: string;
  description: string;
  coverImage: string | null;
  techStack: string;
  category: string;
  repoUrl: string | null;
  liveUrl: string | null;
  featured: boolean;
  repoUpdatedAt: Date | null;
}): Project => ({
  ...row,
  techStack: parseJson<string[]>(row.techStack, []),
});

export const getAllProjects = cache(async (): Promise<Project[]> => {
  const rows = await prisma.project.findMany({
    where: { published: true },
    orderBy: [
      { featured: "desc" },
      { sortOrder: "asc" },
      { createdAt: "desc" },
    ],
  });
  return rows.map(toProject);
});

export const getFeaturedProjects = cache(
  async (limit = 3): Promise<Project[]> => {
    const all = await getAllProjects();
    return all.filter((p) => p.featured).slice(0, limit);
  },
);

export const getProjectBySlug = cache(
  async (slug: string): Promise<Project | null> => {
    const row = await prisma.project.findFirst({
      where: { slug, published: true },
    });
    return row ? toProject(row) : null;
  },
);

export const getPublishedPosts = cache(
  async (limit?: number): Promise<PostSummary[]> => {
    const rows = await prisma.post.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      ...(limit ? { take: limit } : {}),
      select: {
        seq: true,
        slug: true,
        title: true,
        excerpt: true,
        coverImage: true,
        tags: true,
        readingTime: true,
        publishedAt: true,
      },
    });
    return rows.map((row) => ({
      ...row,
      tags: parseJson<string[]>(row.tags, []),
    }));
  },
);

export const getPostBySlug = cache(async (slug: string) => {
  const row = await prisma.post.findFirst({
    where: { slug, status: "PUBLISHED" },
  });
  if (!row) return null;
  return { ...row, tags: parseJson<string[]>(row.tags, []) };
});
