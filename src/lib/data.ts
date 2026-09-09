import { profile } from "@/components/profile";
import type {
  EducationItem,
  ExperienceItem,
  Profile,
  SkillGroup,
  Socials,
} from "@/components/profile";
import { experiences } from "@/components/journey";
import { projects } from "@/components/projects";
import type { Project } from "@/components/projects";
import { education } from "@/components/journey";

export type {
  EducationItem,
  ExperienceItem,
  Profile,
  Project,
  SkillGroup,
  Socials,
};

export const getProfile = async (): Promise<
  Profile & {
    experiences: ExperienceItem[];
    education: EducationItem[];
  }
> => ({
  ...profile,
  experiences,
  education,
});

export const getAllProjects = async (): Promise<Project[]> => projects;

export const getProjectBySlug = async (slug: string): Promise<Project | null> =>
  projects.find((p) => p.slug === slug) ?? null;
