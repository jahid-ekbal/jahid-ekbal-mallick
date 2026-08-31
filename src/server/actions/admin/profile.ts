"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/lib/dbClient/prisma";
import { profileSchema } from "@/lib/zodSchema";
import { requireAdminSession } from "./guard";

export type AdminResult = { ok: true } | { ok: false; error: string };

export async function saveProfile(input: unknown): Promise<AdminResult> {
  await requireAdminSession();

  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Please fix the highlighted fields." };
  }
  const data = parsed.data;

  try {
    const payload = {
      name: data.name,
      headline: data.headline,
      tagline: data.tagline,
      bio: data.bio,
      location: data.location,
      email: data.email,
      avatarUrl: data.avatarUrl || null,
      resumeUrl: data.resumeUrl || null,
      socials: JSON.stringify(cleanRecord(data.socials)),
      skills: JSON.stringify(
        data.skills.map((group) => ({
          category: group.category,
          items: group.items
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
        })),
      ),
      experiences: JSON.stringify(data.experiences),
      education: JSON.stringify(data.education),
    };

    await prisma.profile.upsert({
      where: { id: "main" },
      update: payload,
      create: { id: "main", ...payload },
    });

    revalidatePath("/admin/profile");
    revalidatePath("/");
    revalidatePath("/resume");
    revalidatePath("/contact");
    return { ok: true };
  } catch (error) {
    console.error("[admin] saveProfile failed:", error);
    return { ok: false, error: "Something went wrong saving the profile." };
  }
}

function cleanRecord(record: Record<string, string | undefined>) {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(record)) {
    if (value && value.trim()) out[key] = value.trim();
  }
  return out;
}
