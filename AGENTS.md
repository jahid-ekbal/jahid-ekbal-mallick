<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Stack

| Pkg           | Ver             | Note                                                                                          |
| ------------- | --------------- | --------------------------------------------------------------------------------------------- |
| Next.js       | ^16.2           | `reactCompiler: true`, `typedRoutes: true`, `output: export` (static, no server)              |
| React         | ^19.2           |                                                                                               |
| TypeScript    | ^5.9            | strict, ESNext module, bundler resolution                                                     |
| shadcn/ui     | base-vega style | Components in `src/components/shadcnui/`. Aliased as `@/components/shadcnui`                  |
| Base UI React | ^1.6            | Primitive provider for shadcn components (e.g., `@base-ui/react/button`)                      |
| Tailwind CSS  | ^4.3            | `@tailwindcss/postcss` plugin, `tw-animate-css`, data-state variants inlined in `globals.css` |

Path aliases: `@/*` → `./src/*`.

## Standing user rules (do not drop)

- **Verification uses `playwright-cli` only, always in `--headed` mode.** On this Windows setup the working binary is `npx --yes playwright cli`, bare `playwright-cli` is not on PATH. Run `npx --yes playwright cli --help` to see all commands. Core flow: `open --headed <url>`, `goto`, `snapshot`, `find`, `click`, `fill`, `eval`, `screenshot`, `console`, `requests`. Save screenshots for every route change. Full command reference came from `playwright-cli --help` output: Core (open, attach, close, detach, goto, type, click, dblclick, fill, drag, drop, hover, select, upload, check, uncheck, snapshot, find, eval, dialog-accept, dialog-dismiss, resize, delete-data), Navigation (go-back, go-forward, reload), Keyboard (press, keydown, keyup), Mouse (mousemove, mousedown, mouseup, mousewheel), Save as (screenshot, pdf), Tabs (tab-list, tab-new, tab-close, tab-select), Storage (state-_, cookie-_, localstorage-_, sessionstorage-_), Network (requests, request, route, unroute, network-state-set), DevTools (console, run-code, recording-_, tracing-_, video-*), Install (install, install-browser), sessions (list, close-all, kill-all). Global options: `--help [command]`, `--json`, `--raw`, `--version`.
- **Ask one question at a time during planning.** One answer can change the next question, so never batch planning questions. This rule stays active across turns until the user lifts it.
- **Button that looks like a link: use `Link` with `buttonVariants()`.** Example:
  `<Link href="#" className={buttonVariants({ variant: "secondary", size: "sm" })}>Login</Link>`
- **Always remove all test data after test complete.** Delete temp files, screenshots, coverage, and any fixture output.
- **Always remove `playwright-cli` test data after complete test.** Delete `.playwright-cli/` in the repo and any screenshots in `%LOCALAPPDATA%/Temp/opencode/`. Then close the browser with `close`.
- **Static frontend only.** No admin panels, no backend, no server actions, no DB. This is a normal static portfolio site (`output: export`).
- **Never use the em dash character anywhere** in code, copy, or docs. Use commas or hyphens instead.
- **No duplicate text or info blocks in a single page.** Each fact appears once per page.

## Agent behavior

- **Ask questions** when ambiguous or before destructive actions. Prefer one batched question.
- **Update this file** when you discover non-obvious gotchas, fixes, or conventions.
- **Use skills + MCPs** before writing code matching `next-*`, etc. Use `shadcn` MCP for component add/search/audit.

## Verification

- **Primary**: `bun lint` - runs `next typegen && tsc --noEmit && eslint`
- **Build gate**: `bun run build` - `next build` (static export to `out/`)
- **Preview**: `bun run start` - serves `./out` on port 3000
- **Browser check**: `playwright-cli` in `--headed` mode across `/`, `/projects`, `/projects/[slug]`, `/journey`, `/contact`, `/resume`, with screenshots per route

## Commands

Development:

- `bun install`; the static site needs no `.env` (optional `NEXT_PUBLIC_SITE_URL` override)
- `bun run dev` = plain Next dev

Deploy (static hosting, e.g. Render Static Site):

- Build command: `bun install && bun run build`; publish directory: `out`
- Canonical URL: `https://jahid-ekbal-mallick.onrender.com` via `NEXT_PUBLIC_SITE_URL`
- No migrations, no health endpoint, no server env vars. `render.yaml` holds the static site Blueprint (build plus publish `out`), auto deploys on push.

## Project structure

```
src/
  app/              # App Router (layout.tsx, sitemap.ts, robots.ts, opengraph-image.tsx)
  app/(site)/       # Public pages: page.tsx (Home), projects, journey, contact, resume
  components/
    Layout/         # DockNav (floating bottom dock), ThemeToggleButton
    Providers/      # ThemeProvider (next-themes)
    shadcnui/       # shadcn primitives
    profile.tsx     # Static profile content (edit here)
    projects.tsx    # Static project content, 5 GitHub repos (edit here)
    journey.tsx     # Static experience/education (edit here)
    HomeHero.tsx    # Home hero with gradient plus accents + portrait, no WebGL
    Reveal.tsx      # Scroll fade+rise wrapper, visible by default, no-JS safe
    Typewriter.tsx  # Hero role line, reduced-motion safe, no live region noise
  lib/
    data.ts         # Static sync getters over the component content files
    site.ts         # Site meta + navItems (Projects, Journey, Contact, Resume)
    fonts.ts        # next/font (Geist Sans, Geist Mono)
    types.ts        # LayoutProps
    utils.ts        # cn() helper (clsx + tailwind-merge)
public/
  images/profile.jpg  # Home + resume portrait (replace the file to update)
  uploads/            # User uploads (all files ignored except .gitkeep)
```

Content rules: profile, projects, and journey content live directly in `src/components/{profile,projects,journey}.tsx`, per user choice. `src/lib/data.ts` only re-exports them behind the old getter names so pages stay thin. Contact shows GitHub, LinkedIn, X, Discord, WhatsApp, Telegram + email only (no YouTube, no Instagram). Home shows portrait + headline + about + resume button + skills only (no featured projects).

## Gitignore pattern: uploads

`public/uploads/*` + `!public/uploads/.gitkeep` - ignores all uploaded files but keeps empty dir tracked via `.gitkeep`. Do not add `public/uploads/` itself to gitignore.

## Key restrictions

- **ESLint**: Locked at <eslint@9.x> until `eslint-plugin-react` ships v10 support. Do NOT bump.
- **TypeScript**: Currently ^5.9. TS 7.0 (Go-native compiler) blocked until typescript-eslint API stabilizes (~Oct 2026). Do not migrate.

## Removed systems (do not re-add without asking)

- Deleted for the static conversion: `src/app/admin/*`, `src/app/login`, `src/app/api/*`, `src/server/*`, `src/lib/auth*`, `src/lib/dbClient`, `src/lib/rateLimit.ts`, `src/lib/zodSchema.ts`, `src/lib/env`, `src/proxy.ts`, `prisma/*`, `prisma.config.ts`, backend `scripts/*`, `generated/*`, `src/components/admin/*`, `src/components/analytics/*`, `src/components/ContactForm.tsx`.
- Removed deps: `better-auth`, `@better-auth/prisma-adapter`, `@prisma/client`, `@prisma/adapter-libsql`, `prisma`, `dotenv`, `recharts`, `@react-three/fiber`, `three`, `@types/three`, `react-markdown`, `remark-gfm`, `react-hook-form`, `@hookform/resolvers`, `zod`, `@t3-oss/env-nextjs`, `sharp`, `shadcn`.
- Temp scripts using `@/` aliases MUST live inside the project dir; `bun -e` breaks on PowerShell `$` escaping - use a temp file instead.

## Git commits

Use PowerShell here-strings:

```powershell
git commit -m @"
<commit message here>
"@
```
