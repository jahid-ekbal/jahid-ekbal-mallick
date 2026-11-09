import type { EducationItem, ExperienceItem } from "@/components/profile";

export type MilestoneItem = {
  title: string;
  period: string;
  description: string;
};

export const experiences: ExperienceItem[] = [
  {
    role: "Independent Full-Stack Developer",
    company: "Self-employed",
    period: "2023 to Present",
    description:
      "Design and ship responsive web apps, portfolio sites, stores, and bots with React, Next.js, and TypeScript. Focus on accessible, mobile-first builds with clean, maintainable code.",
  },
  {
    role: "Digital Creator",
    company: "Team Regix",
    period: "2022 to Present",
    description:
      "Produce thumbnails, video edits, and campaign assets with Photoshop, Premiere Pro, and Blender. Support social content and ad creatives with a visual-first workflow.",
  },
];

export const education: EducationItem[] = [
  {
    degree: "B.A. (Hons) Geography",
    period: "2026 to Present",
    description:
      "Four year honours in Geography, building on my full stack background. Geography grounds how I think about people, places, and maps, and I turn that into web builds.",
  },
  {
    degree: "Full Stack Development",
    school: "Central Institute of Technology",
    period: "2023 to 2027",
    description:
      "IT Programming student on the 4-year Full Stack Development track, covering front end, back end, and deployment.",
    url: "https://citindia.in/courses/it-programming/full-stack-development",
  },
  {
    degree: "Higher Secondary (Class 12), Arts stream",
    school: "Paschim Joynagar J.C. High School (H.S.)",
    period: "2024 to 2026",
    description:
      "Passed higher secondary in 2026 after choosing the arts stream in class 11. Joined the school in class 5.",
  },
];

export const milestones: MilestoneItem[] = [
  {
    title: "Drama artist, classes 6 to 11",
    period: "Class 6 to 11",
    description:
      "Performed drama through school years, including Rabindra Sadan in Kolkata, Gobardanga Town Hall three times, my own school stage, and stages at other schools and places. Acting taught me timing, rehearsal discipline, and teamwork.",
  },
  {
    title: "Higher secondary passout, arts stream",
    period: "2026",
    description:
      "Completed class 12 higher secondary at Paschim Joynagar J.C. High School (H.S.) after joining in class 5 and taking the arts stream in class 11.",
  },
  {
    title: "Geography honours",
    period: "2026",
    description:
      "Began a four year honours in Geography, joining my earlier full stack track and shifting toward people and place centered design.",
  },
  {
    title: "Independent building and creator work",
    period: "2022 to Present",
    description:
      "Ship web projects as a self-employed developer and support Team Regix with thumbnails, video edits, and campaign assets. Parallel tracks that keep code and visuals improving together.",
  },
];
