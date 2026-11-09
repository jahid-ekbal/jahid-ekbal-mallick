import { profile } from "@/components/profile";
import type {
  EducationItem,
  ExperienceItem,
  Profile,
  SkillGroup,
  Socials,
} from "@/components/profile";
import { experiences, milestones } from "@/components/journey";
import type { MilestoneItem } from "@/components/journey";
import { projects } from "@/components/projects";
import type { Project } from "@/components/projects";
import { education } from "@/components/journey";

export type {
  EducationItem,
  ExperienceItem,
  MilestoneItem,
  Profile,
  Project,
  SkillGroup,
  Socials,
};

export function getProfile(): Profile & {
  experiences: ExperienceItem[];
  education: EducationItem[];
  milestones: MilestoneItem[];
} {
  return {
    ...profile,
    experiences,
    education,
    milestones,
  };
}

export function getAllProjects(): Project[] {
  return projects;
}

export function getProjectBySlug(slug: string): Project | null {
  return projects.find((p) => p.slug === slug) ?? null;
}
