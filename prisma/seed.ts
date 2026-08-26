import "dotenv/config";
import { PrismaClient } from "@generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
  ...(process.env.TURSO_AUTH_TOKEN ?
    { authToken: process.env.TURSO_AUTH_TOKEN }
  : {}),
});
const prisma = new PrismaClient({ adapter });

const profile = {
  id: "main",
  name: "Jahid Ekbal Mallick",
  headline: "Full-Stack Engineer | UI/UX Designer",
  tagline:
    "I build fast, clean web apps end to end, and give interfaces life with motion.",
  bio: [
    "I'm Jahid Ekbal Mallick, a full-stack developer from Kolkata, India. I design and build complete products with Next.js, TypeScript and C#, and I care about the details: type-safe APIs, quick page loads, accessible interfaces, and code the next engineer can actually read.",
    "I'm equally comfortable in low-level territory: C++ with real-time vector math, C# desktop tools, Python network scripting, and PowerShell automation for Windows. Across two GitHub profiles I've shipped 60+ public repositories spanning web apps, Discord bots, auth platforms, and native tooling.",
    "I like interfaces that feel alive. Framer Motion and GSAP drive the transitions I prototype in Figma, leaning into a liquid-glass, cyberpunk-inspired visual language.",
    "Outside the editor I run video production for REGIX Esports, cutting cinematic intros and motion posters for esports broadcasts.",
  ].join("\n\n"),
  location: "Kolkata, India",
  email: "",
  avatarUrl: null,
  resumeUrl: null,
  socials: JSON.stringify({
    github: "https://github.com/jahid-ekbal",
    linkedin: "https://www.linkedin.com/in/jahid-developer",
    twitter: "https://x.com/JAHIDEKBAL01",
    instagram: "https://instagram.com/ceojahid",
    youtube: "https://www.youtube.com/@teamregix",
    discord: "https://discord.gg/zZwDv7ks5W",
    whatsapp: "https://wa.me/919733696362",
    telegram: "https://t.me/jahidekbal",
  }),
  skills: JSON.stringify([
    {
      category: "Frontend",
      items: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    },
    {
      category: "Backend",
      items: ["Node.js", "Bun", "SQLite", "Prisma", "API Design", "Go"],
    },
    {
      category: "Systems",
      items: ["C++", "C#", "Python", "PowerShell", "Windows Internals"],
    },
    {
      category: "Design",
      items: ["Figma", "Adobe XD", "Photoshop"],
    },
    {
      category: "Motion",
      items: ["After Effects", "Premiere Pro", "Framer Motion", "GSAP"],
    },
  ]),
  experiences: JSON.stringify([
    {
      role: "Founder & Lead Editor",
      company: "REGIX Esports",
      period: "2020 - Present",
      description:
        "Run video production for the REGIX Esports brand: high-octane cinematic intros, motion posters, and broadcast graphics. Built the team's visual identity around a liquid-glass, cyberpunk aesthetic.",
    },
    {
      role: "Independent Full-Stack Developer",
      company: "Open Source",
      period: "2021 - Present",
      description:
        "66 public repositories across two GitHub profiles (jahid-ekbal, official-jahid). Shipped Next.js and React products end to end: an auth platform pairing a Go backend with a TypeScript frontend, an e-commerce store, a realtime chat app, and full-stack CRUD on Prisma + SQLite. Built Discord bots in TypeScript for moderation, music playback, and chat filtering, plus local-AI dev setups around Ollama.",
    },
    {
      role: "Systems & Tooling Programmer",
      company: "REGIX Labs",
      period: "2020 - Present",
      description:
        "Low-level Windows and game-tooling engineering: C++ engines with real-time 3D vector math and ImGui interfaces, C# desktop panels, Python network automation and security scripting, and PowerShell optimization suites tuned for gaming PCs.",
    },
  ]),
  education: JSON.stringify([
    {
      degree: "IT Programming",
      school: "Central Institute of Technology (CIT), West Bengal",
      period: "",
      description:
        "Focus: data structures, web systems, and system architecture.",
      url: "https://citindia.in",
    },
  ]),
};

async function main() {
  await prisma.profile.upsert({
    where: { id: "main" },
    update: profile,
    create: profile,
  });

  const [profiles, projects] = await Promise.all([
    prisma.profile.count(),
    prisma.project.count(),
  ]);
  console.log(`Seed complete: ${profiles} profile, ${projects} projects.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
