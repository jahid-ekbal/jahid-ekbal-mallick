# Jahid Ekbal Mallick

Static portfolio for Jahid Ekbal Mallick, Full-Stack Developer and UI/UX Designer from Kolkata, India. Public, free, and with no login required.

Built with Next.js 16 with React Compiler, React 19, TypeScript 5.9 strict, Tailwind CSS 4, shadcn/ui base-vega on Base UI React, and next-themes for dark and light mode. Output is a static export with no server, no database, and no server actions.

## Getting started

Prerequisites: Bun and Node.js 20 or newer.

```bash
bun install
bun run dev
```

Open http://localhost:3000 for the dev server.

## Commands

| Script               | What it does                                              |
| -------------------- | --------------------------------------------------------- |
| `bun install`        | Install dependencies                                      |
| `bun run dev`        | Plain Next dev server                                     |
| `bun run build`      | Static build to `out/`                                    |
| `bun run start`      | Serve `out/` on port 1000 with `bunx serve ./out -l 1000` |
| `bun lint`           | ESLint check                                              |
| `bun run lint:check` | Typegen plus typecheck plus ESLint                        |

## Content

Edit these files directly, do not create a CMS:

- `src/components/profile.tsx` for name, headline, tagline, bio, socials, and skills
- `src/components/projects.tsx` for the 5 projects
- `src/components/journey.tsx` for experiences, education, and milestones
- `src/lib/site.ts` for site name, role, description, URL, nav items, and SEO helper
- `src/lib/data.ts` for getters over the content files above

Pages live in `src/app/(site)/`:

- `/` Home with hero plus About
- `/projects` Projects plus Skills and tools
- `/projects/[slug]` Project detail for each slug
- `/journey` Journey timeline, education, and milestones
- `/contact` Contact cards for GitHub, LinkedIn, X, Discord, WhatsApp, Telegram, and email
- `/resume` Print-ready resume

## Styling

Tailwind CSS 4 with `@tailwindcss/postcss`. Theme tokens live in `src/app/globals.css`. Fonts use `next/font`: Geist Sans, Geist Mono, and Anton for display. Path alias is `@/*` to `./src/*`.

## Verification

Primary checks:

```bash
bun lint
bun run build
bun run start
```

Browser checks use `playwright-cli` in `--headed` mode only. The working binary on this Windows setup is `npx --yes playwright cli`. Run `npx --yes playwright cli --help` to see commands. Core flow is `open --headed <url>`, `goto`, `snapshot`, `find`, `click`, `fill`, `eval`, `screenshot`, `console`, and `requests`. Save screenshots for every route change across `/`, `/projects`, `/projects/[slug]`, `/journey`, `/contact`, and `/resume`.

After testing, always delete temp files, screenshots, coverage, and fixture output. Always delete `.playwright-cli/` in the repo and any screenshots in `%LOCALAPPDATA%/Temp/opencode/`, then close the browser with `close`.

## Deploy

Render Static Site:

- Build command: `bun install && bun run build`
- Publish directory: `out`
- Canonical URL: `https://jahid-ekbal-mallick.onrender.com` via `NEXT_PUBLIC_SITE_URL`
- No migrations, no health endpoint, no server environment variables. `render.yaml` holds the Blueprint.

## Rules

- Static frontend only. No admin panels, no backend, no server actions, no DB.
- Button that looks like a link: use `Link` with `buttonVariants()`.
- Never use the em dash character in code, copy, or docs. Use commas or hyphens instead.
- No duplicate text or info blocks in a single page. Each fact appears once per page.

## License

MIT
