import "dotenv/config";
import { PrismaClient } from "@generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

import { auth } from "../src/lib/auth";
import { serverEnv } from "../src/lib/env/serverEnv";

/**
 * Fallback admin credentials used when ADMIN_EMAIL / ADMIN_PASSWORD are not
 * configured. They guarantee `bun run db:seed` always leaves the site with a
 * working /login account. For anything reachable by other people, override
 * BOTH values in the host environment before seeding (or rotate the password
 * right after the first sign-in).
 */
const DEFAULT_ADMIN_EMAIL = "admin@example.com";
const DEFAULT_ADMIN_PASSWORD = "admin@example.com";

/** Remote databases get louder warnings when running on default creds. */
const isRemoteDatabase = serverEnv.DATABASE_URL.startsWith("libsql://");

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
  // Admin account: ADMIN_EMAIL / ADMIN_PASSWORD win; documented defaults are
  // the fallback so /login always works after a seed. Skips gracefully when
  // the account already exists, keeping re-seeds idempotent.
  // -------------------------------------------------------------------------
  // Blank-string values in .env (e.g. ADMIN_EMAIL= copied from
  // .env.example) are treated exactly like missing ones.
  const envEmail = process.env.ADMIN_EMAIL?.trim();
  const envPassword = process.env.ADMIN_PASSWORD;
  const usingDefaults = !envEmail || !envPassword;
  const adminEmail = (envEmail || DEFAULT_ADMIN_EMAIL).toLowerCase();
  const adminPassword = envPassword || DEFAULT_ADMIN_PASSWORD;

  if (usingDefaults) {
    console.warn(
      `ADMIN_EMAIL/ADMIN_PASSWORD not fully set - falling back to built-in ` +
        `defaults (${adminEmail}). Override both for real deployments.`,
    );
  }
  if (usingDefaults && isRemoteDatabase) {
    console.warn(
      "Targeting a REMOTE database (libsql://) with default admin " +
        "credentials. Set ADMIN_PASSWORD on the host environment before " +
        "/login can be reached by others.",
    );
  }

  console.log(`Ensuring admin account (${adminEmail})...`);
  const existing = await prisma.user.findFirst({
    where: { email: adminEmail },
  });

  let adminStatus: string;
  if (existing) {
    // The stored scrypt hash may predate the current ADMIN_PASSWORD (older
    // seeds skipped existing users, so later .env changes never applied).
    // Probe with the configured credentials and recreate the account when
    // they do not match, making .env the source of truth on every seed.
    const verified = await auth.api
      .signInEmail({
        body: { email: adminEmail, password: adminPassword },
      })
      .then(() => true, () => false);

    if (verified) {
      adminStatus = "verified against ADMIN_PASSWORD";
    } else {
      console.warn(
        `Admin account (${adminEmail}) exists but does not match ` +
          "ADMIN_PASSWORD - recreating it with the configured credentials.",
      );
      // Deleting the user cascades its Account + Session rows
      // (schema defines onDelete: Cascade).
      await prisma.user.delete({ where: { id: existing.id } });
      const result = await auth.api.signUpEmail({
        body: {
          email: adminEmail,
          password: adminPassword,
          name: "Admin",
        },
      });
      if (!result?.user?.id) {
        throw new Error("Admin user recreation failed");
      }
      adminStatus = "recreated with configured credentials";
    }
  } else {
    const result = await auth.api.signUpEmail({
      body: {
        email: adminEmail,
        password: adminPassword,
        name: "Admin",
      },
    });
    if (!result?.user?.id) {
      throw new Error("Admin user creation failed");
    }
    adminStatus = "created";
  }

  // Server-side auth API calls open real session rows (the probe above
  // included) that no browser will ever present. Remove them so seeding
  // leaves zero dangling sessions.
  const seededAdmin = await prisma.user.findFirst({
    where: { email: adminEmail },
    select: { id: true },
  });
  let cleanedSessions = 0;
  if (seededAdmin) {
    const removed = await prisma.session.deleteMany({
      where: { userId: seededAdmin.id },
    });
    cleanedSessions = removed.count;
  }

  const [profiles, projects] = await Promise.all([
    prisma.profile.count(),
    prisma.project.count(),
  ]);
  console.log(
    `Seed complete: ${profiles} profile, ${projects} projects, admin ` +
      `account ${adminStatus}.` +
      (cleanedSessions > 0 ? ` Cleaned ${cleanedSessions} seed session(s).` : ""),
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
