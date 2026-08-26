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

- Better Auth 1.7 + `@better-auth/prisma-adapter` over the existing libsql-backed Prisma client. Instance: `src/lib/auth.ts` (`nextCookies()` LAST plugin); client: `src/lib/auth-client.ts`; mounted at `/api/auth/[...all]`.
- Better Auth 1.7 REQUIRES an `issuer` column on Account (`local:credential` for passwords). The CLI schema generator missed it - it was added manually; keep it if regenerating.
- LOGIN IS OTP-ONLY (since the password removal): `emailAndPassword.enabled:false`, official `emailOTP()` plugin. Code = 6 chars `[A-Z0-9]` w/ guaranteed mixed letter+digit via custom `generateOTP`; `expiresIn:180`s, hashed storage (`storeOTP:"hashed"`), `allowedAttempts:5`, plugin rate limit 3/min, `disableSignUp:true`. Delivery = `sendVerificationOTP` hook -> `src/server/auth/discordOtp.ts` -> owner DM (reuse send-only rest stack). Codes live in the EXISTING Verification table (identifier `${type}-otp-${email}`) - no new tables.
- Server actions in `src/server/actions/login.ts`: `requestLoginCode()` (3 sends/10min/IP app limiter + 30s resend cooldown Map + config pre-check + auto-provision bare admin User row) and `verifyLoginCode()` (`auth.api.signInEmailOTP`; zod `^[A-Z0-9]{6}$` uppercased; ALL failures collapse to one generic message).
- UI `src/components/admin/LoginForm.tsx`: single OTP input (`autoComplete="one-time-code"`, auto-uppercase, mono tracking), Send->Resend cooldown countdowns from server `cooldownMs`, expiry countdown from 180s TTL constant mirrored client-side.
- Dashboard at `/admin/*`, never linked publicly, `noindex`, disallowed in robots.
- Route protection layers: `src/proxy.ts` (Next 16 renamed middleware->proxy) does cookie-presence-only optimistic redirect for `/admin/*` ONLY (matcher `/admin/:path*`; deliberately NO `/login` rule - cookie presence ≠ validity and caused login↔admin loops with stale cookies). Authoritative checks: login PAGE redirects valid sessions to `/admin` via `auth.api.getSession({headers})`, `src/app/admin/layout.tsx` guards all `/admin/*`, and every server action in `src/server/actions/admin/*` starts with the guard helper `requireAdminSession()`.
- Migrations: history squashed to a single baseline `20260826181414_init`. Turso/remote DBs provisioned from the OLD 6-migration history need a one-time drop+recreate (or clearing `_prisma_migrations`) before `db:deploy`. `bun run db:reset` wipes local data non-interactively (`prisma migrate reset --force`).
- Seed creates the admin via `auth.api.signUpEmail`; credentials come from `ADMIN_EMAIL`/`ADMIN_PASSWORD` env vars, falling back to built-in defaults `admin@example.com`/`admin@example.com` when unset (seed warns loudly when defaulting, especially against remote `libsql://`). If the account exists but its hash does NOT match ADMIN_PASSWORD, the seeder probes with `auth.api.signInEmail`, deletes the user row (cascades Account/Session), and recreates it - `.env` always wins on re-seed. Throwaway sessions opened by these server-side auth calls are deleted so seeding leaves zero dangling sessions.
- Public pages live under route group `src/app/(site)/` (Header/Footer chrome); root layout only has html/body/ThemeProvider/AnalyticsTracker so admin+login render clean.
- typedRoutes is on: literal routes must exist after `next typegen`; dynamic/query-string URLs need `as Route` casts.

## Visitor analytics (self-hosted)

- Tracker: `src/components/analytics/AnalyticsTracker.tsx` in root layout - POSTs `/api/analytics/collect` per pathname change + dwell heartbeats/sendBeacon (~15s while visible).
- Collector sets first-party cookies `vkey` (visitor id, 1y) and `vkey` session id `vsession` (30min sliding). Bots filtered by UA. Everyone tracked incl. admin.
- Country: visitor IP (x-forwarded-for) resolved via ipwho.is then ip-api fallback, cached per-IP in `IpGeoCache`; loopback/private IPs store "Local".
- Retention: sessions older than 90 days pruned probabilistically (~5% of collects).
- Dashboard `/admin/analytics` (?range=7d|30d|90d): stat cards, daily bar chart (CSS bars, no chart lib runtime needed beyond recharts install), top countries/pages/referrers/devices tables, recent sessions with time spent.

## Security posture

- Security headers + CSP are centralized in `next.config.ts` (`headers()`): strict CSP (`default-src 'self'`, no frames/object), HSTS, XCTO, XFO DENY, Referrer-Policy, Permissions-Policy, `X-XSS-Protection: 0`. CSP keeps `'unsafe-inline'` for scripts/styles because Next ships inline bootstrap scripts/React inline styles and there is no nonce infrastructure at proxy level; `img-src https:` exists because admin-entered cover images point at arbitrary hosts. `poweredByHeader: false`; `serverActions.bodySizeLimit: "512kb"`.
- Rate limiting layers: Better Auth core `{enabled:true, window:60, max:30}` in-memory plus its built-in special rule `POST /sign-in/email` = 3 req/10s (verified: burst returns 401,401,401,429…). App-level limiter `src/lib/rateLimit.ts` (fixed-window Map with GC sweep) guards contact action (5 msg/10min/IP) and analytics collect (30 pageviews & 60 dwell/min/IP; verified 429 tail). In-memory is correct for the single Render instance - if ever multi-instance, switch auth rateLimit storage to database.
- `clientIpFromHeaders()` returns the RIGHTMOST `x-forwarded-for` token (appending proxies like Render add the true peer at the END; leftmost is client-spoofable). Matches Better Auth's own walk direction - do not "optimize" back to `[0]`.
- Analytics collector hardening: 2KB body cap (413), JSON-parse guard, dwell has a 86,400s lifetime ceiling enforced in the updateMany WHERE, visitor/session cookies are `httpOnly` + `secure` in production.
- XSS surface: blog/project markdown renders through `react-markdown` (raw HTML stripped by default) under the CSP above; admin inputs are zod-capped server-side even though forms validate client-side too. GitHub import fetches only `api.github.com` paths built from `[\w.-]+` capture groups (no SSRF).
- Health endpoint stays dependency-free by design (deploy gate must never fail on DB blips).

## Git commits

Use PowerShell here-strings:

```powershell
git commit -m @"
<commit message here>
"@
```
