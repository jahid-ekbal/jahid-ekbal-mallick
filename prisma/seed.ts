import "dotenv/config";
import { PrismaClient } from "@generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

import { serverEnv } from "../src/lib/env/serverEnv";

/**
 * Login is OTP-only (Better Auth email-otp plugin -> owner's Discord DMs).
 * There are no passwords anywhere: ADMIN_EMAIL just names WHICH identity is
 * the admin. Sign-up through the OTP flow is disabled, so this account must
 * exist - the seeder guarantees it.
 */
const DEFAULT_ADMIN_EMAIL = "admin@example.com";

/** Remote databases get louder warnings when Discord delivery is unconfigured. */
const isRemoteDatabase = serverEnv.DATABASE_URL.startsWith("libsql://");
const hasDiscordDelivery = Boolean(
  process.env.DISCORD_BOT_TOKEN && process.env.DISCORD_OWNER_USER_ID,
);

// Same adapter source-of-truth as src/lib/dbClient/prisma.ts: the validated
// serverEnv fails fast with a clear error if DATABASE_URL is missing/malformed.
const prisma = new PrismaClient({
  adapter: new PrismaLibSql({
    url: serverEnv.DATABASE_URL,
    ...(serverEnv.TURSO_AUTH_TOKEN ?
      { authToken: serverEnv.TURSO_AUTH_TOKEN }
    : {}),
  }),
});

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

async function main(): Promise<void> {
  // -------------------------------------------------------------------------
  // Profile: idempotent single-row upsert (id = "main").
  // -------------------------------------------------------------------------
  console.log('Seeding profile (id="main")...');
  await prisma.profile.upsert({
    where: { id: "main" },
    update: profile,
    create: profile,
  });

  // -------------------------------------------------------------------------
  // Admin identity: creates (or refreshes) the bare user row that the OTP
  // sign-in flow resolves against. No credentials of any kind are stored.
  // -------------------------------------------------------------------------
  const envEmail = process.env.ADMIN_EMAIL?.trim();
  // Blank-string values in .env count as unset.
  const adminEmail = (
    envEmail || DEFAULT_ADMIN_EMAIL
  ).toLowerCase();
  if (!envEmail) {
    console.warn(
      `ADMIN_EMAIL not set - defaulting to ${adminEmail}. Set it to rename ` +
        "the admin identity (display name/email in the dashboard).",
    );
  }
  if (!hasDiscordDelivery && isRemoteDatabase) {
    console.warn(
      "Targeting a REMOTE database without DISCORD_BOT_TOKEN / " +
        "DISCORD_OWNER_USER_ID - nobody will be able to receive login codes. " +
        "Configure both on the host environment.",
    );
  }

  console.log(`Ensuring admin account (${adminEmail})...`);
  const existing = await prisma.user.findFirst({
    where: { email: adminEmail },
  });
  let adminStatus: string;
  if (existing) {
    adminStatus = "already existed";
  } else {
    await prisma.user.create({
      data: {
        id: crypto.randomUUID(),
        name: "Admin",
        email: adminEmail,
        emailVerified: true,
      },
    });
    adminStatus = "created";
  }

  const [profiles, projects] = await Promise.all([
    prisma.profile.count(),
    prisma.project.count(),
  ]);
  console.log(
    `Seed complete: ${profiles} profile, ${projects} projects, admin ` +
      `account ${adminStatus}.`,
  );
}

try {
  await main();
} catch (error) {
  console.error("\nSeed failed:", error);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
