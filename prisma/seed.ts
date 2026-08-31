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
  headline: "Full-Stack Developer & Digital Creator",
  tagline:
    "I craft digital experiences that merge technical precision with visual innovation to build engaging web solutions.",
  bio: [
    "I'm Jahid Ekbal Mallick, a Full-Stack Developer & Digital Creator from Kolkata, India. I craft digital experiences that merge technical precision with visual innovation, bridging functionality and aesthetics to build engaging web solutions.",
    "Development expertise: HTML5, CSS3, JavaScript (ES6+), React, Next.js, TypeScript, Tailwind CSS, Bootstrap — responsive, mobile-first. Design specialization: UI/UX prototyping in Figma (advanced), Adobe Photoshop & Premiere Pro, Blender 3D, digital advertising, social content and YouTube thumbnail production.",
    "What I deliver: pixel-perfect responsive websites, interactive web apps, user-centric interfaces, social campaigns, professional video & thumbnails, and custom ad assets. My workflow combines clean, maintainable code with compelling visuals — solving digital challenges with creativity and precision. For business inquiries: jahidekbal.io@gmail.com",
  ].join("\n\n"),
  location: "Kolkata, India",
  email: "jahidekbal.io@gmail.com",
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
      items: [
        "HTML5",
        "CSS3",
        "JavaScript (ES6+)",
        "TypeScript",
        "React",
        "Next.js",
      ],
    },
    {
      category: "Backend",
      items: [
        "Node.js",
        "Bun",
        "SQLite",
        "Prisma",
        "Tailwind CSS",
        "Bootstrap",
      ],
    },
    {
      category: "Design",
      items: ["Figma", "Adobe XD", "Photoshop", "Premiere Pro", "Blender"],
    },
    {
      category: "Delivery",
      items: [
        "Responsive Design",
        "UI/UX",
        "Video Production",
        "Digital Ads",
        "Thumbnails",
      ],
    },
  ]),
  // Journey emptied per request — repopulate later via /admin/profile (experiences/education)
  experiences: JSON.stringify([]),
  education: JSON.stringify([]),
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
  const adminEmail = (envEmail || DEFAULT_ADMIN_EMAIL).toLowerCase();
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
