<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/nextjs--starter--fullstack--node-0a0a0a?style=for-the-badge&logo=next.js&logoColor=white">
    <img alt="nextjs-starter-fullstack-node" src="https://img.shields.io/badge/nextjs--starter--fullstack--node-ffffff?style=for-the-badge&logo=next.js&logoColor=black">
  </picture>
</p>

<p align="center">
  <a href="https://github.com/MrSaikatS/nextjs-starter-fullstack-node/stargazers">
    <img src="https://img.shields.io/github/stars/MrSaikatS/nextjs-starter-fullstack-node?style=for-the-badge&logo=github&color=gold" alt="GitHub Stars">
  </a>
  <a href="https://github.com/MrSaikatS/nextjs-starter-fullstack-node/issues">
    <img src="https://img.shields.io/github/issues/MrSaikatS/nextjs-starter-fullstack-node?style=for-the-badge&logo=github" alt="GitHub Issues">
  </a>
  <a href="https://github.com/MrSaikatS/nextjs-starter-fullstack-node/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/MrSaikatS/nextjs-starter-fullstack-node?style=for-the-badge&logo=github" alt="License">
  </a>
</p>

<p align="center">
  ⭐ If you find this project useful, consider giving it a star - it helps others discover it!
</p>

<p align="center">Production-ready Next.js starter template - TypeScript, Prisma 7 + SQLite, shadcn/ui, React Compiler, and modern tooling out of the box.</p>

---

## 🧰 What's Inside

| Feature                    | Description                                          |
| -------------------------- | ---------------------------------------------------- |
| **Next.js 16**             | App Router, React 19, typed routes, React Compiler   |
| **Prisma 7 + SQLite**      | Type-safe database client via libSQL adapter         |
| **shadcn/ui**              | Base UI primitives, base-vega style, dark/light mode |
| **react-hook-form + Zod**  | Form validation pattern ready to use                 |
| **next-themes**            | Dark/light mode with system preference detection     |
| **Tailwind CSS 4**         | Utility-first CSS, tw-animate-css                    |
| **ESLint + Prettier**      | Flat config, core-web-vitals, Tailwind plugin        |
| **Environment Validation** | `@t3-oss/env-nextjs` for client & server env vars    |

## ✅ Prerequisites

- [Bun](https://bun.sh) - runtime + package manager
- Node.js >=20.x, npm >=9.x (matches `engines` in package.json)
- PowerShell 7+ (Windows) or bash (macOS/Linux)
- [Turso CLI](https://docs.turso.tech/cli/install) (production database only)

## 🚀 Getting Started

```bash
git clone https://github.com/MrSaikatS/nextjs-starter-fullstack-node.git
cd nextjs-starter-fullstack-node
bun run setup          # install deps, create .env, migrate, seed (incl. admin user)
bun run dev            # http://localhost:3000
```

`bun run setup` copies `.env.example` to `.env` (generating a
`BETTER_AUTH_SECRET` + placeholder admin credentials if missing), applies
migrations, generates the Prisma client and seeds the database. Set
`ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env` before the first seed to control
the dashboard login - if they are unset, the seeder falls back to the
built-in defaults `admin@example.com` / `admin@example.com`. The admin
dashboard lives at `/admin`; sign in manually at `/login` - neither page is
linked anywhere public.

## 📦 Tech Stack

| Layer     | Technology                                      |
| --------- | ----------------------------------------------- |
| Framework | Next.js 16 (App Router)                         |
| Language  | TypeScript 5.9 (strict)                         |
| UI        | React 19, Tailwind CSS 4, shadcn/ui (base-vega) |
| Forms     | react-hook-form + Zod 4 + @hookform/resolvers   |
| Database  | SQLite via Prisma 7 + libSQL adapter            |
| Icons     | lucide-react                                    |
| Theme     | next-themes                                     |
| Compiler  | React Compiler enabled                          |
| Lint      | ESLint 9 (flat config) + Prettier 3             |

## ⚙️ Scripts

| Script      | Command                                               |
| ----------- | ----------------------------------------------------- |
| `setup`     | install + configure everything (deps, .env, DB, seed) |
| `deploy`    | lint, build, Turso migrate+seed, git commit/push      |
| `dev`       | `next dev`                                            |
| `build`     | `prisma generate && next build`                       |
| `start`     | `next start`                                          |
| `lint`      | `next typegen && tsc --noEmit && eslint`              |
| `prod`      | `prisma generate && next build && next start`         |
| `migrate`   | `prisma migrate dev && prisma generate`               |
| `studio`    | `prisma studio --browser none`                        |
| `db:seed`   | `bun prisma/seed.ts`                                  |
| `db:deploy` | `prisma migrate deploy`                               |

## 🧾 Command Reference

### Local development

```sh
bun run setup              # one command: install + configure all dependencies
cp .env.example .env       # or configure env manually (see file comments)
bun run migrate            # apply/create migrations + generate Prisma client
bun run db:seed            # seed profile data + first admin user
bun studio                 # browse/edit database (Prisma Studio)
bun run dev                # dev server at http://localhost:3000
bun lint                   # typegen + typecheck + eslint
bun run build              # production build check
bun prod                   # full local production server
```

### Render production (one-time setup)

```sh
# 1. Create the Turso database (same region as your Render service!)
turso db create portfolio
turso db show portfolio --url        # -> DATABASE_URL (libsql://...)
turso db tokens create portfolio     # -> TURSO_AUTH_TOKEN

# 2. Apply schema + seed against Turso (run from your machine)
DATABASE_URL="libsql://..." TURSO_AUTH_TOKEN="..." bun run db:deploy
DATABASE_URL="libsql://..." TURSO_AUTH_TOKEN="..." bun run db:seed

# 3. Provision the web service from the committed Blueprint
#    Render Dashboard -> "New +" -> "Blueprint" -> select this repo
#    (or apply the same render.yaml spec via the Render CLI / MCP server)
```

Full environment-variable list and the Discord webhook flip are described in
[Deploying to Render](#-deploying-to-render) below.

## 🚀 Deploying to Render

Local SQLite files do not persist across instances, so production uses
[Turso](https://turso.tech) through the same `@prisma/adapter-libsql`
adapter. No code changes are needed; only environment variables differ.

The repo ships a Blueprint ([render.yaml](render.yaml)) that defines the web
service as code: Node runtime with Bun, `bun install && bun run build`,
`prisma migrate deploy` as a pre-deploy command, `bun run start`, and a
`/api/health` liveness probe enabling zero-downtime deploys with automatic
rollback on failure.

1. **Create the database**
   ```sh
   turso db create portfolio
   turso db show portfolio --url      # -> DATABASE_URL (libsql://...)
   turso db tokens create portfolio   # -> TURSO_AUTH_TOKEN
   ```
2. **Push the schema and seed it** (from your machine, env pointed at Turso)
   ```sh
   DATABASE_URL="libsql://..." TURSO_AUTH_TOKEN="..." bun run db:deploy
   DATABASE_URL="libsql://..." TURSO_AUTH_TOKEN="..." bun run db:seed
   ```
   Migration history is a single squashed baseline (`init`). If your Turso
   database still carries the pre-squash six-migration history, drop and
   recreate it once (or clear `_prisma_migrations`) before this step.
3. **Create the service on Render** via the Blueprint ("New +" -> "Blueprint"
   -> this repo), or wire the official Render MCP server (`.vscode/mcp.json`)
   into your agent and have it apply the spec. Fill in the prompted variables:
   - `DATABASE_URL` = your `libsql://...` URL
   - `TURSO_AUTH_TOKEN` = the token from step 1
   - `NEXT_PUBLIC_SITE_URL` = `https://<your-domain>` (canonical/OG/sitemap)
   - `BETTER_AUTH_URL` = same origin as `NEXT_PUBLIC_SITE_URL`
   - `BETTER_AUTH_SECRET` is minted automatically by Render
     (`generateValue: true`); the three `DISCORD_*` vars are optional
     (send-only contact-form DMs).
4. **Co-locate the region**: pick the Render region closest to (ideally the
   same as) your Turso database location - server-rendered pages query libSQL
   over the network on every request, so this is the largest latency win. Use
   the Starter instance type or above: Free instances sleep when idle (cold
   starts on public pages) and don't support pre-deploy commands.
5. **Admin dashboard**: sign in at `https://<your-domain>/login`. Defaults are
   `admin@example.com` / `admin@example.com` when `ADMIN_EMAIL` /
   `ADMIN_PASSWORD` were not set before seeding - change them for anything
   public. The dashboard is never linked from public pages and is excluded
   from robots/sitemaps.
6. **Ongoing deploys**: every push to `main` rebuilds and redeploys
   automatically. Migrations run in the pre-deploy command before the new
   instance accepts traffic - no manual `db:deploy` per release. A failed
   health check cancels the rollout and keeps the previous version live.

### Managing Render from the editor

[.vscode/mcp.json](.vscode/mcp.json) registers the official Render MCP server
(`https://mcp.render.com/mcp`, Bearer API-key auth). Once enabled it lets
coding agents create services, update env vars, trigger deploys (optionally
clearing the build cache), and inspect logs/metrics without leaving chat.
Generate the key under Account Settings -> API Keys; VS Code stores it in
secret storage, not in this repo.

## 🔒 Security

Defense-in-depth out of the box:

- **Headers**: strict Content-Security-Policy, HSTS, `X-Frame-Options: DENY`, nosniff, locked-down Permissions-Policy; `X-Powered-By` removed.
- **Brute force**: Better Auth rate limiting (login capped at 3 attempts / 10 s per IP; broader auth budget 30/min), verified returning `429` under burst.
- **Abuse caps**: contact form limited to 5 messages / IP / 10 min; analytics collector capped at 30 pageviews + 60 heartbeats / min / IP with 2 KB payload limits - both return honest `429`s instead of burning your Turso quota.
- **Authored safety**: all admin mutations re-check sessions server-side (`requireAdminSession`), all input passes zod schemas regardless of client validation, markdown is rendered HTML-stripped, and Server Action bodies are capped at 512 KB.
- **Cookie hygiene**: first-party analytics cookies are `HttpOnly` + `Secure` in production; session cookies follow Better Auth secure defaults.

Rotating credentials after any secret exposure (e.g. regenerating the Discord bot token in the Developer Portal) remains your operational responsibility.

## 🔌 Integrations

| Tool                       | Purpose                                                              |
| -------------------------- | -------------------------------------------------------------------- |
| **shadcn/ui**              | Registry-based component system (`@/components/shadcnui` alias)      |
| **Prisma ORM 7**           | Schema-first DB with migration pipeline                              |
| **React Compiler**         | Automatic memoization via `babel-plugin-react-compiler`              |
| **Environment Validation** | `@t3-oss/env-nextjs` - validated `DATABASE_URL`, client/server split |

## 🤝 Contributing

1. 🍴 Fork the repository
2. 🌿 Create a feature branch: `git checkout -b feat/amazing-feature`
3. 💻 Make your changes
4. 📝 Commit using [conventional commits](https://www.conventionalcommits.org/)
5. 🚀 Open a Pull Request

Check the [issues page](https://github.com/MrSaikatS/nextjs-starter-fullstack-node/issues) for bugs or feature requests.

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/MrSaikatS">Saikat Sardar</a>
  <br>
  🐛 Report Bug | 💡 Suggest Feature
</p>
