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

export function getProfile(): Profile & {
  experiences: ExperienceItem[];
  education: EducationItem[];
} {
  return {
    ...profile,
    experiences,
    education,
  };
}

export function getAllProjects(): Project[] {
  return projects;
}

export function getProjectBySlug(slug: string): Project | null {
  return projects.find((p) => p.slug === slug) ?? null;
}
