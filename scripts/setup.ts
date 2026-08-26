import { spawnSync } from "node:child_process";
import { copyFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { randomBytes } from "node:crypto";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

function run(cmd: string[], label: string): void {
  console.log(`\n==> ${label}`);
  const result = spawnSync(cmd[0]!, cmd.slice(1), {
    cwd: root,
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  if (result.status !== 0) {
    console.error(`Setup failed at: ${label}`);
    process.exit(result.status ?? 1);
  }
}

run(["bun", "install"], "Installing dependencies");

const envPath = path.join(root, ".env");
if (!existsSync(envPath)) {
  copyFileSync(path.join(root, ".env.example"), envPath);
  console.log("\nCreated .env from .env.example");

  const contents = readFileSync(envPath, "utf8");
  // Append each entry independently. Credentials mirror the built-in seed
  // fallbacks in prisma/seed.ts (admin@example.com for both).
  const additions: string[] = [];
  if (!/^BETTER_AUTH_SECRET=/m.test(contents)) {
    additions.push(`BETTER_AUTH_SECRET=${randomBytes(32).toString("base64")}`);
  }
  if (!/^ADMIN_EMAIL=/m.test(contents)) {
    additions.push("ADMIN_EMAIL=admin@example.com");
  }
  if (!/^ADMIN_PASSWORD=/m.test(contents)) {
    additions.push("ADMIN_PASSWORD=admin@example.com");
  }
  const updated =
    contents.replace(/\n*$/, "") +
    (additions.length > 0 ? `\n${additions.join("\n")}\n` : "\n");
  writeFileSync(envPath, updated);

  if (additions.length > 0) {
    console.log(
      [
        "Generated missing .env entries:",
        ...additions.map((line) =>
          line.startsWith("BETTER_AUTH_SECRET=")
            ? "BETTER_AUTH_SECRET=<generated>"
            : line,
        ),
      ].join("\n"),
    );
  }
} else {
  console.log(".env already exists - leaving it untouched");
}

run(["bunx", "prisma", "migrate", "dev"], "Applying database migrations");
run(["bunx", "prisma", "generate"], "Generating Prisma client");
run(["bun", "prisma/seed.ts"], "Seeding database (profile + admin user)");

console.log(`
Setup complete.

Next steps:
  1. Review .env - dashboard login defaults to
     admin@example.com / admin@example.com until you change ADMIN_EMAIL /
     ADMIN_PASSWORD (delete the seeded admin user to re-seed).
  2. bun run dev      -> http://localhost:3000
  3. Admin dashboard: http://localhost:3000/admin (login at /login)
`);
