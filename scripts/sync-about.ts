import "dotenv/config";
import { PrismaClient } from "@generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { serverEnv } from "../src/lib/env/serverEnv";

/**
 * Protected About sync — the safe way to push README-derived About to the
 * main (Turso) database without the foot-gun of `bun run db:seed`.
 *
 * Why this exists (no data loss on Render restarts):
 * - Render runs `prisma migrate deploy` only (see render.yaml preDeployCommand).
 *   The instance is stateless, but Turso (libsql:// + TURSO_AUTH_TOKEN) is the
 *   persistent store — data survives restarts/deploys by design.
 * - `prisma/seed.ts` does `profile.upsert({...})` over the entire row. Running
 *   it against the remote DB on every deploy would silently overwrite any edits
 *   made via /admin/profile. Never add it to render.yaml.
 * - This script is selective: it only overwrites the About fields derived from
 *   https://raw.githubusercontent.com/jahid-ekbal/jahid-ekbal/refs/heads/main/README.md
 *   (headline/tagline/bio/skills/email + optionally journey). Everything else —
 *   projects, posts, socials, avatar, etc. — is left untouched unless you pass
 *   an explicit reset flag.
 *
 * Usage:
 *   bun scripts/sync-about.ts --dry-run           # preview diff (default)
 *   bun scripts/sync-about.ts --apply             # push About to DB_URL (local or Turso)
 *   bun scripts/sync-about.ts --apply --reset-journey  # also empties experiences + education (requested: add later via admin)
 *
 * Remote (Turso) example — never commits secrets, just env on the call:
 *   DATABASE_URL="libsql://..." TURSO_AUTH_TOKEN="..." bun scripts/sync-about.ts --apply --reset-journey
 *
 * Admin persistence guarantee: /admin/profile writes go straight to the same
 * Turso DB via the Prisma libsql adapter and are revalidated with
 * revalidatePath("/"). They do not live on the Render instance filesystem and
 * are not cleared by restarts or redeploys.
 */

const DRY_RUN = process.argv.includes("--dry-run");
const APPLY = process.argv.includes("--apply");
const RESET_JOURNEY = process.argv.includes("--reset-journey");

// Effective write only when --apply is explicit. Bare invocation = dry-run.
const shouldWrite = APPLY && !DRY_RUN;

const prisma = new PrismaClient({
  adapter: new PrismaLibSql({
    url: serverEnv.DATABASE_URL,
    ...(serverEnv.TURSO_AUTH_TOKEN ?
      { authToken: serverEnv.TURSO_AUTH_TOKEN }
    : {}),
  }),
});

// Source of truth — must stay in sync with prisma/seed.ts profile (condensed README)
const aboutPatch = {
  headline: "Full-Stack Developer & Digital Creator",
  tagline:
    "I craft digital experiences that merge technical precision with visual innovation to build engaging web solutions.",
  bio: [
    "I'm Jahid Ekbal Mallick, a Full-Stack Developer & Digital Creator from Kolkata, India. I craft digital experiences that merge technical precision with visual innovation, bridging functionality and aesthetics to build engaging web solutions.",
    "Development expertise: HTML5, CSS3, JavaScript (ES6+), React, Next.js, TypeScript, Tailwind CSS, Bootstrap — responsive, mobile-first. Design specialization: UI/UX prototyping in Figma (advanced), Adobe Photoshop & Premiere Pro, Blender 3D, digital advertising, social content and YouTube thumbnail production.",
    "What I deliver: pixel-perfect responsive websites, interactive web apps, user-centric interfaces, social campaigns, professional video & thumbnails, and custom ad assets. My workflow combines clean, maintainable code with compelling visuals — solving digital challenges with creativity and precision. For business inquiries: jahidekbal.io@gmail.com",
  ].join("\n\n"),
  email: "jahidekbal.io@gmail.com",
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
  ...(RESET_JOURNEY ?
    {
      experiences: JSON.stringify([]),
      education: JSON.stringify([]),
    }
  : {}),
} as const;

async function main() {
  const isRemote = serverEnv.DATABASE_URL.startsWith("libsql://");
  console.log(
    `Target: ${isRemote ? "REMOTE Turso" : "local SQLite"} (${serverEnv.DATABASE_URL.slice(0, 32)}...)`,
  );
  console.log(
    `Mode: ${shouldWrite ? "APPLY" : "DRY-RUN"}${RESET_JOURNEY ? " + reset-journey" : " (journey untouched)"}`,
  );
  if (!shouldWrite) {
    console.log(
      "Tip: add --apply to write, or --apply --reset-journey to also clear Journey.",
    );
  }

  const existing = await prisma.profile.findUnique({ where: { id: "main" } });
  if (!existing) {
    console.error(
      'No profile id="main" found. Run `bun run db:seed` once locally to create it, or create via /admin/profile.',
    );
    process.exitCode = 1;
    return;
  }

  // Diff preview
  const changed: string[] = [];
  for (const [k, v] of Object.entries(aboutPatch)) {
    const cur = (existing as unknown as Record<string, unknown>)[k];
    const curStr = typeof cur === "string" ? cur : JSON.stringify(cur);
    const nextStr = typeof v === "string" ? v : JSON.stringify(v);
    if (curStr !== nextStr) changed.push(k);
  }
  if (RESET_JOURNEY) {
    // also report journey emptiness even if already empty
    const expEmpty = existing.experiences === "[]";
    const eduEmpty = existing.education === "[]";
    if (!expEmpty || !eduEmpty) {
      if (!changed.includes("experiences")) changed.push("experiences (→ [])");
      if (!changed.includes("education")) changed.push("education (→ [])");
    }
  }

  if (changed.length === 0) {
    console.log("No changes — About already matches source of truth.");
    return;
  }

  console.log(`Fields to update: ${changed.join(", ")}`);
  console.log("\n--- About preview ---");
  console.log(`headline: ${aboutPatch.headline}`);
  console.log(`tagline: ${aboutPatch.tagline}`);
  console.log(`bio (first 220 chars): ${aboutPatch.bio.slice(0, 220)}...`);
  console.log(`email: ${aboutPatch.email}`);
  console.log(`skills: ${aboutPatch.skills.slice(0, 120)}...`);
  if (RESET_JOURNEY)
    console.log(
      "journey: experiences + education will be emptied (re-add via /admin/profile later)",
    );

  if (!shouldWrite) {
    console.log("\nDry-run — no DB write. Re-run with --apply.");
    return;
  }

  await prisma.profile.update({
    where: { id: "main" },
    data: aboutPatch,
  });
  console.log(
    "\nApplied — About synced to DB. Admin edits to other fields preserved.",
  );
  if (RESET_JOURNEY)
    console.log(
      "Journey cleared (experiences/education = []). Repopulate any time at /admin/profile.",
    );
}

try {
  await main();
} catch (e) {
  console.error(e);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
