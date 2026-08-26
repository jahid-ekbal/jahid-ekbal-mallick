<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes - APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

## Stack

| Pkg           | Ver                | Note                                                                                                                                                                                                                                                                                                                               |
| ------------- | ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Next.js       | ^16.2              | `reactCompiler: true`, `typedRoutes: true`                                                                                                                                                                                                                                                                                         |
| React         | ^19.2              |                                                                                                                                                                                                                                                                                                                                    |
| TypeScript    | ^5.9               | strict, ESNext module, bundler resolution                                                                                                                                                                                                                                                                                          |
| Prisma        | ^7.9               | Uses `prisma-client` generator (not `prisma-client-js`). Output: `generated/prisma`. Driver adapter: `@prisma/adapter-libsql` for SQLite. Config: `prisma.config.ts`. DATABASE_URL accepts `file:./` (dev) or `libsql://` (Turso prod, needs TURSO_AUTH_TOKEN; wired in dbClient + seed). Prod setup: README "Deploying to Vercel" |
| shadcn/ui     | base-vega style    | Components in `src/components/shadcnui/`. Aliased as `@/components/shadcnui`                                                                                                                                                                                                                                                       |
| Base UI React | ^1.6               | Primitive provider for shadcn components (e.g., `@base-ui/react/button`)                                                                                                                                                                                                                                                           |
| Tailwind CSS  | ^4.3               | `@tailwindcss/postcss` plugin, `tw-animate-css`, `shadcn/tailwind.css`                                                                                                                                                                                                                                                             |
| Zod           | ^4.4               | Schema validation                                                                                                                                                                                                                                                                                                                  |
| env           | @t3-oss/env-nextjs | Split: `src/lib/env/serverEnv.ts` + `clientEnv.ts`                                                                                                                                                                                                                                                                                 |

Path aliases: `@/*` → `./src/*`, `@generated/*` → `./generated/*`.

## Agent behavior

- **Ask questions** when ambiguous or before destructive actions. Prefer one batched question.
- **Update this file** when you discover non-obvious gotchas, fixes, or conventions.
- **Use skills + MCPs** before writing code matching `prisma-*`, `next-*`, `better-auth-*`, `zod`, etc. Use `shadcn` MCP for component add/search/audit. Use `better-auth` MCP for auth docs.

## Verification

- **Primary**: `bun lint` - runs `next typegen && tsc --noEmit && eslint`
- **Build gate**: `bun run build` - `prisma generate && next build`
- **Full prod**: `bun prod` - `prisma generate && next build && next start` (before schema/env changes)

## Commands

Development:

- `bun install`; copy `.env.example` to `.env` (DISCORD_* optional locally)
- `bun run migrate` after schema edits; `bun run db:seed` upserts profile data
- `bun run dev` = Next dev + Discord gateway sidecar via concurrently; `bun run dev:web` skips the bot
- `bun studio` = Prisma Studio; `bun discord:register` republishes global slash commands

Deploy (Turso + Vercel), one-time:

```sh
turso db create portfolio
turso db show portfolio --url        # DATABASE_URL
turso db tokens create portfolio     # TURSO_AUTH_TOKEN
DATABASE_URL="libsql://..." TURSO_AUTH_TOKEN="..." bun run db:deploy
DATABASE_URL="libsql://..." TURSO_AUTH_TOKEN="..." bun run db:seed
```

- Vercel env vars: DATABASE_URL, TURSO_AUTH_TOKEN, NEXT_PUBLIC_SITE_URL, five DISCORD_*
- After first deploy paste `https://<domain>/api/discord/interactions` into the Dev Portal Interactions Endpoint URL (gateway/webhook delivery is mutually exclusive)
- Every push to prod branch auto-deploys; run `db:deploy` against Turso once per new migration

## Project structure

```
src/
  app/              # App Router (layout.tsx, page.tsx, globals.css)
  components/
    Layout/         # Header, ThemeToggleButton
    Providers/      # ThemeProvider (next-themes)
    shadcnui/       # shadcn primitives (button.tsx, toast.tsx)
  hooks/            # Custom hooks (currently empty)
  lib/
    dbClient/       # Prisma singleton with libSQL adapter
    env/            # serverEnv.ts, clientEnv.ts (t3-env)
    fonts.ts        # next/font (Geist, Inter)
    types.ts        # LayoutProps
    utils.ts        # cn() helper (clsx + tailwind-merge)
  server/           # API routes placeholder (empty)
generated/prisma/   # Prisma client output (gitignored)
public/uploads/     # User uploads (all files ignored except .gitkeep)
```

## Gitignore pattern: uploads

`public/uploads/*` + `!public/uploads/.gitkeep` - ignores all uploaded files but keeps empty dir tracked via `.gitkeep`. Do not add `public/uploads/` itself to gitignore.

## Key restrictions

- **ESLint**: Locked at eslint@9.x until `eslint-plugin-react` ships v10 support. Do NOT bump.
- **TypeScript**: Currently ^5.9. TS 7.0 (Go-native compiler) blocked until typescript-eslint API stabilizes (~Oct 2026). Do not migrate.

## Form patterns

Schemas in `src/lib/zodSchema.ts` - export both schema and `type X = z.infer<typeof xSchema>`.

Components use `"use client"`, `react-hook-form` + `@hookform/resolvers/zod`, and shadcn primitives:

```typescript
const { handleSubmit, control, formState: { isSubmitting } } = useForm({
  resolver: zodResolver(mySchema),
  defaultValues: { ... },
  mode: "all",
});
```

Each field goes through `Controller`:

```typescript
<Controller
  name="fieldName"
  control={control}
  render={({ field, fieldState }) => (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor={field.name}>Label</FieldLabel>
      <Input {...field} id={field.name} aria-invalid={fieldState.invalid} autoComplete="..." />
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )}
/>
```

Submit: `<form onSubmit={handleSubmit(handler)} noValidate>`. Button disabled while submitting with icon toggle.

## Discord bot

HTTP Interactions webhook at `src/app/api/discord/interactions/route.ts` (no discord.js). Gotchas:

- Read the raw body as `request.text()` BEFORE parsing; Ed25519 verification (`discord-interactions` v4, WebCrypto) needs the exact bytes.
- All interaction handlers respond synchronously (type 4/7/9) - DB + REST calls stay well under the 3s ack window. No deferral needed.
- SQLite can't autoincrement non-id columns: `Post.seq` is allocated via `_max.seq + 1` in `src/server/discord/blogService.ts`.
- Optional secrets in `serverEnv.ts` use a zod `preprocess` that maps empty strings to `undefined`, so a fresh `.env.example` copy boots without Discord vars.
- Post-response background work (contact DM delivery) must use `after()` from `next/server` on Vercel.
- Local webhook testing: spawn `bun run start` with `DISCORD_PUBLIC_KEY` overridden by a test keypair's public key (process env beats `.env`); sign with the matching private key. Kill port 3000 strays first - `Stop-Process` on the bun wrapper PID leaves the node child alive; kill `Get-NetTCPConnection -LocalPort 3000` owners instead.
- Register/re-register global commands with `bun discord:register`.
- **Gateway sidecar** (`scripts/discord-gateway.ts`, auto-started by `bun dev` via concurrently): receives INTERACTION_CREATE over a raw WebSocket (Bun native, no deps) and routes through the same `handleInteraction()`; responses go via REST callback (`sendInteractionCallback`). Discord delivers interactions over gateway OR webhook, never both: while developing locally the Dev Portal Interactions Endpoint URL must be EMPTY, after deploy paste the Vercel URL and the sidecar just stops receiving events. Sidecar exits quietly when DISCORD_* vars are missing.
- `/addrepo url: [category:]` imports a public GitHub repo into Project: fetches repo metadata + base64 README (`githubService.ts`), maps techStack = [language, ...topics] cap 8, category = `category:` override else first topic/language, liveUrl = homepage only if http(s), stores GitHub `pushed_at` as `Project.repoUpdatedAt` (cards render relative "Updated X ago"), published instantly. Unauthenticated GitHub API = 60 req/hr; no token by design.
- Temp scripts using `@/` aliases MUST live inside the project dir to resolve (bun doesn't apply tsconfig paths outside it); `%TEMP%` scripts need absolute imports. Also `bun -e` breaks on PowerShell `$` escaping - use a temp file instead.

## Git commits

Use PowerShell here-strings:

```powershell
git commit -m @"
<commit message here>
"@
```
