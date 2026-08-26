import z from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.email(),
  subject: z.string().trim().min(3).max(120),
  body: z.string().trim().min(20).max(5000),
});

export type ContactFormValues = z.infer<typeof contactSchema>;

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type LoginValues = z.infer<typeof loginSchema>;

const httpUrl = z
  .string()
  .trim()
  .max(500)
  .regex(/^(https?:\/\/\S+)?$/, "Must be an http(s) URL or empty");

const optionalText = (min: number, max: number) =>
  z.string().trim().min(min).max(max);

export const projectSchema = z.object({
  id: z.string().optional(),
  title: optionalText(2, 120),
  slug: z
    .string()
    .trim()
    .max(90)
    .regex(
      /^$|^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Lowercase letters, numbers and dashes only",
    )
    .optional(),
  summary: optionalText(10, 300),
  description: z.string().trim().min(20).max(50000),
  coverImage: httpUrl.optional(),
  techStack: z.string().trim().max(300),
  category: optionalText(1, 40),
  repoUrl: httpUrl.optional(),
  liveUrl: httpUrl.optional(),
  featured: z.boolean(),
  published: z.boolean(),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;

export const postSchema = z.object({
  id: z.string().optional(),
  title: optionalText(3, 120),
  slug: z
    .string()
    .trim()
    .max(90)
    .regex(
      /^$|^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Lowercase letters, numbers and dashes only",
    )
    .optional(),
  excerpt: optionalText(10, 300),
  content: z.string().trim().min(20).max(50000),
  coverImage: httpUrl.optional(),
  tags: z.string().trim().max(200),
  status: z.enum(["DRAFT", "PUBLISHED"]),
});

export type PostFormValues = z.infer<typeof postSchema>;

const socialsShape = z.object({
  github: httpUrl.optional(),
  linkedin: httpUrl.optional(),
  twitter: httpUrl.optional(),
  instagram: httpUrl.optional(),
  youtube: httpUrl.optional(),
  discord: httpUrl.optional(),
  whatsapp: httpUrl.optional(),
  telegram: httpUrl.optional(),
});

export const profileSchema = z.object({
  name: optionalText(2, 80),
  headline: optionalText(3, 140),
  tagline: optionalText(10, 240),
  bio: z.string().trim().min(20).max(10000),
  location: optionalText(2, 80),
  email: z.email(),
  avatarUrl: httpUrl.optional(),
  resumeUrl: httpUrl.optional(),
  socials: socialsShape,
  skills: z.array(
    z.object({
      category: optionalText(1, 60),
      items: z.string().trim().min(1).max(400),
    }),
  ),
  experiences: z.array(
    z.object({
      role: optionalText(2, 120),
      company: optionalText(1, 120),
      period: optionalText(1, 60),
      description: z.string().trim().max(2000),
    }),
  ),
  education: z.array(
    z.object({
      degree: optionalText(2, 140),
      school: optionalText(1, 140),
      period: z.string().trim().max(60),
      description: z.string().trim().max(2000),
      url: httpUrl.optional(),
    }),
  ),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

export const githubImportSchema = z.object({
  repo: z.string().trim().min(3).max(300),
  category: z.string().trim().max(40).optional(),
});

export type GithubImportValues = z.infer<typeof githubImportSchema>;
