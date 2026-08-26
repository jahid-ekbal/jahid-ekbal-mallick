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

  let contents = readFileSync(envPath, "utf8");
  const secret = randomBytes(32).toString("base64");
  if (!/^BETTER_AUTH_SECRET=/m.test(contents)) {
    contents += `\nBETTER_AUTH_SECRET=${secret}\n`;
    contents += "ADMIN_EMAIL=admin@example.com\n";
    contents += "ADMIN_PASSWORD=ChangeMe-Please-123!\n";
    writeEnv(envPath, contents);
    console.log(
      "Generated BETTER_AUTH_SECRET and placeholder admin credentials into .env",
    );
  } else {
    writeEnv(envPath, contents);
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
  1. Review .env (set ADMIN_EMAIL / ADMIN_PASSWORD before first seed if you
     want different credentials; delete the seeded admin user to re-seed).
  2. bun run dev      -> http://localhost:3000
  3. Admin dashboard: http://localhost:3000/admin (login at /login)
`);

function writeEnv(filePath: string, contents: string): void {
  writeFileSync(filePath, contents);
}
