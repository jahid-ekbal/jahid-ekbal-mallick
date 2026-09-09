import type { EducationItem, ExperienceItem } from "@/components/profile";

// Static journey content. Draft entries, correct dates and details here.
export const experiences: ExperienceItem[] = [
  {
    role: "Independent Full-Stack Developer",
    company: "Self-employed",
    period: "2023 to Present",
    description:
      "Design and ship responsive web apps, portfolio sites, stores, and bots with React, Next.js, and TypeScript.",
  },
  {
    role: "Digital Creator",
    company: "Team Regix",
    period: "2022 to Present",
    description:
      "Produce thumbnails, video edits, and campaign assets with Photoshop, Premiere Pro, and Blender.",
  },
];

export const education: EducationItem[] = [
  {
    degree: "Full Stack Development",
    school: "Central Institute of Technology",
    period: "2023 to 2027",
    description:
      "IT Programming student at Central Institute of Technology, Kolkata (citindia.in), on the 4-year Full Stack Development track.",
    url: "https://citindia.in/courses/it-programming/full-stack-development",
  },
];
