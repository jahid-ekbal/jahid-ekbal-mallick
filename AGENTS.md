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
| Prisma        | ^7.9               | Uses `prisma-client` generator (not `prisma-client-js`). Output: `generated/prisma`. Driver adapter: `@prisma/adapter-libsql` for SQLite. Config: `prisma.config.ts`. DATABASE_URL accepts `file:./` (dev) or `libsql://` (Turso prod, needs TURSO_AUTH_TOKEN; wired in dbClient + seed). Prod setup: README "Deploying to Render" |
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
- `bun run dev` = plain Next dev (bot is send-only REST; no sidecar process); `bun run dev:web` is an alias
- `bun studio` = Prisma Studio

Deploy (Turso + Render), one-time:

```sh
turso db create portfolio
turso db show portfolio --url        # DATABASE_URL
turso db tokens create portfolio     # TURSO_AUTH_TOKEN
DATABASE_URL="libsql://..." TURSO_AUTH_TOKEN="..." bun run db:deploy
DATABASE_URL="libsql://..." TURSO_AUTH_TOKEN="..." bun run db:seed
```

- Provision via the committed Blueprint (`render.yaml`): Dashboard -> New + -> Blueprint -> pick this repo (or apply through the Render MCP server / CLI - `.vscode/mcp.json` configures it)
- Render env vars: DATABASE_URL, TURSO_AUTH_TOKEN, NEXT_PUBLIC_SITE_URL, BETTER_AUTH_URL, BETTER_AUTH_SECRET (generateValue in Blueprint), three optional DISCORD_*
- Keep the Render region matched to the Turso DB location (every SSR request queries libSQL over the network)
- Use Starter plan or above: Free instances sleep on idle (cold starts) and don't support preDeployCommand
- Every push to main auto-deploys; `preDeployCommand: bunx prisma migrate deploy` runs migrations before the new instance takes traffic
- `/api/health` is the liveness probe - keep it dependency-free (no DB touch) so DB blips can't fail deploys/false-positive rollbacks

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

## Discord bot (send-only)

No commands, no gateway, no webhook. The bot only SENDS: contact-form submissions are mirrored to the owner's DMs (+ optional log channel) via REST.

- Kept: `src/server/discord/{env,rest,notify,types}.ts`. Deleted: all handlers/router/commands/verify/blogService, gateway sidecar, register script, `/api/discord/interactions` route.
- Env shrunk to `DISCORD_BOT_TOKEN`, `DISCORD_OWNER_USER_ID`, `DISCORD_LOG_CHANNEL_ID` (all optional).
- Contact DM delivery still uses `after()` from `next/server` (Node runtime; works unchanged on Render).
- GitHub repo import moved out of Discord: `src/server/github/repoImport.ts` (`importProjectFromGitHub`), used by the admin projects page. Unauthenticated GitHub API = 60 req/hr; no token by design.
- SQLite can't autoincrement non-id columns: `Post.seq` is allocated via `_max.seq + 1` in `src/server/actions/admin/posts.ts`.
- Optional secrets in `serverEnv.ts` use a zod `preprocess` that maps empty strings to `undefined`.
- Temp scripts using `@/` aliases MUST live inside the project dir; `bun -e` breaks on PowerShell `$` escaping - use a temp file instead.

## Auth + admin dashboard

- Better Auth 1.7 + `@better-auth/prisma-adapter` over the existing libsql-backed Prisma client. Instance: `src/lib/auth.ts` (`nextCookies()` last plugin); client: `src/lib/auth-client.ts`; mounted at `/api/auth/[...all]`.
- Better Auth 1.7 REQUIRES an `issuer` column on Account (`local:credential` for passwords). The CLI schema generator missed it - it was added manually; keep it if regenerating.
- Login at `/login` (client form -> `authClient.signIn.email`). Dashboard at `/admin/*`, never linked publicly, `noindex`, disallowed in robots.
- Route protection layers: `src/proxy.ts` (Next 16 renamed middleware->proxy) does cookie-presence-only optimistic redirect via `getSessionCookie`; authoritative check is `auth.api.getSession({headers})` in `src/app/admin/layout.tsx` AND at the top of every server action in `src/server/actions/admin/*` (guard helper `requireAdminSession()`).
- Seed creates the admin via `auth.api.signUpEmail`; credentials come from `ADMIN_EMAIL`/`ADMIN_PASSWORD` env vars, falling back to built-in defaults `admin@example.com`/`admin@example.com` when unset (seed warns loudly when defaulting, especially against remote `libsql://`). Admin creation is skipped if the email already exists (idempotent re-seeds).
- Public pages live under route group `src/app/(site)/` (Header/Footer chrome); root layout only has html/body/ThemeProvider/AnalyticsTracker so admin+login render clean.
- typedRoutes is on: literal routes must exist after `next typegen`; dynamic/query-string URLs need `as Route` casts.

## Visitor analytics (self-hosted)

- Tracker: `src/components/analytics/AnalyticsTracker.tsx` in root layout - POSTs `/api/analytics/collect` per pathname change + dwell heartbeats/sendBeacon (~15s while visible).
- Collector sets first-party cookies `vkey` (visitor id, 1y) and `vkey` session id `vsession` (30min sliding). Bots filtered by UA. Everyone tracked incl. admin.
- Country: visitor IP (x-forwarded-for) resolved via ipwho.is then ip-api fallback, cached per-IP in `IpGeoCache`; loopback/private IPs store "Local".
- Retention: sessions older than 90 days pruned probabilistically (~5% of collects).
- Dashboard `/admin/analytics` (?range=7d|30d|90d): stat cards, daily bar chart (CSS bars, no chart lib runtime needed beyond recharts install), top countries/pages/referrers/devices tables, recent sessions with time spent.

## Git commits

Use PowerShell here-strings:

```powershell
git commit -m @"
<commit message here>
"@
```
