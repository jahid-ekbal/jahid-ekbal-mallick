# Admin dashboard + send-only Discord + setup/deploy commands

Approved plan. Session was in plan mode, so nothing is implemented yet. Execute top to bottom.

## User requirements (verbatim intent)

- Two commands: one installs/configures all dependencies (`bun run setup`), one deploys (`bun run deploy`).
- Remove ALL Discord bot commands; bot only SENDS messages (contact-form notifications).
- Private admin dashboard (full CRUD: create/read/update/delete everything) at unlinked routes; visitors see a static site.
- Login page visited manually via `url/login`; Prisma seed creates the admin login.
- Dashboard manages GitHub repos, blogs (add/update), and everything else, with dedicated edit routes.
- Constraint: always use framework-recommended routes and code structure.
- NEW: all server actions authenticate via the Better Auth API (`auth.api.getSession`) - no other auth mechanism.
- NEW: UI built exclusively from shadcn components (add missing ones via shadcn CLI into src/components/shadcnui/).
- NEW: visitor analytics dashboard: count visitors, country per visitor, time spent on site.

## Analytics decisions (user-confirmed round 2)

1. Self-hosted in-app tracking into existing Turso DB (no third-party service).
2. Country = **IP + GeoIP lookup**: store visitor IP (x-forwarded-for), resolve country via free HTTPS API (ipwho.is primary, ip-api fallback), cache per-IP in `IpGeoCache` table so each IP resolves once; "local" for dev loopback.
3. Track EVERYONE including the logged-in admin.
4. Prune raw rows older than 90 days during collection.

### Analytics schema

```prisma
model VisitorSession {
  id           String     @id @default(cuid())
  visitorKey   String     // first-party cookie id
  ipAddress    String?
  country      String?    // ISO alpha-2 after lookup; null until resolved
  referrer     String?
  landingPath  String
  device       String?    // coarse: desktop | mobile | tablet | bot
  startedAt    DateTime   @default(now())
  lastSeenAt   DateTime   @default(now())
  durationSec  Int        @default(0)
  pageviews    Pageview[]
  @@index([startedAt])
}
model Pageview {
  id        String         @id @default(cuid())
  session   VisitorSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  sessionId String
  path      String
  createdAt DateTime       @default(now())
  @@index([createdAt])
  @@index([path])
}
model IpGeoCache {
  ip          String   @id
  countryCode String?
  resolvedAt  DateTime @default(now())
}
```

### Analytics flow

- `src/components/analytics/tracker.tsx` ("use client", mounted in root layout): on pathname change POST `/api/analytics/collect`; heartbeat every ~15s while document visible; `navigator.sendBeacon` on pagehide with elapsed dwell seconds. Sets first-party `vkey` cookie (1y) client-side.
- `src/app/api/analytics/collect/route.ts`: bot UA filter; find-or-create VisitorSession from cookie sid; insert Pageview or apply dwell update; geo-resolve IP through IpGeoCache; prune >90d rows probabilistically (~5% of calls). No response body needed beyond 204.
- `src/server/analytics/{geo.ts,stats.ts}`: geo resolution + cached aggregate queries (daily visitors/pageviews series, top countries/pages/referrers/devices, avg duration).

### Dashboard analytics UI (/admin/analytics + overview widgets)

- shadcn Tabs range selector (7d / 30d / 90d); Card stat row: unique visitors, pageviews, avg session duration, pages/session.
- shadcn Chart (recharts wrapper) area/bar chart: daily visitors vs pageviews.
- Tables/lists: top countries (flag emoji from code), top pages, top referrers, devices breakdown, recent sessions (country, landing path, duration, relative time).
- Overview page shows compact versions linking to full page.

### shadcn additions needed

card, chart, table, badge, tabs, select, switch, separator, dropdown-menu, dialog, alert-dialog, label (+ field if available in registry). Existing: button, input, textarea, toast.

## Decisions made (user-confirmed)

1. Auth = **Better Auth** (prismaAdapter, sqlite provider over existing libsql client).
2. Seed credentials from env vars `ADMIN_EMAIL` / `ADMIN_PASSWORD`.
3. Deploy command = full pipeline (lint → build → Turso migrate+seed → git commit/push).
4. Dashboard sections = all four: Overview, Messages inbox, Profile editor, Projects CRUD (+GitHub import), Posts editor.
5. Routes = `/login` + `/admin/*`.

## Framework conventions verified

- Next 16: `middleware` renamed `proxy`. File: `src/proxy.ts`, export function named `proxy`, config.matcher. (node_modules/next/dist/docs/.../file-conventions/proxy.md)
- Better Auth Next guide: `src/lib/auth.ts`, `src/lib/auth-client.ts` (createAuthClient from better-auth/react), mount `src/app/api/auth/[...all]/route.ts` with toNextJsHandler, `nextCookies()` as LAST plugin, session in RSC/actions via `auth.api.getSession({ headers: await headers() })`, proxy uses `getSessionCookie(request)` optimistic check (cookie presence ONLY; real validation per page/action).
- Schema tables generated with `@better-auth/cli generate` after auth.ts exists, then Prisma migration.
- Seed admin via `auth.api.signUpEmail` (correct scrypt hashing, idempotent by email lookup).
- Project form convention (AGENTS.md): react-hook-form + zodResolver + Controller per field, schemas in src/lib/zodSchema.ts exporting schema + type.

## Phase 1 - Discord send-only (IN PROGRESS, files read, no edits landed)

Delete:

- src/server/discord/handlers/ (13 files), router.ts, commands.ts, verify.ts, blogService.ts, utils.ts
- src/app/api/discord/ tree
- scripts/discord-gateway.ts, scripts/register-discord-commands.ts
- deps: discord-interactions, concurrently

Keep + trim:

- types.ts -> only EmbedField, EmbedPayload, MessagePayload
- env.ts -> config { botToken, ownerUserId, logChannelId }; require botToken+ownerUserId only
- rest.ts -> keep apiRequest/createDmChannel/sendMessage/sendOwnerDm/sendLogMirror; DROP sendInteractionCallback
- notify.ts unchanged except truncate import path

Move:

- NEW src/lib/content.ts <- slugify, estimateReadingTime, parseTags, truncate (from discord/utils.ts)
- NEW src/server/github/repoImport.ts <- githubService.ts as-is (imports from @/lib/content, log tag [github]); delete original

Config:

- package.json: dev="next dev"; delete discord:dev, discord:register
- serverEnv.ts: drop DISCORD_APPLICATION_ID, DISCORD_PUBLIC_KEY
- .env.example Discord section rewritten (send-only, 3 vars)

## Phase 2 - Better Auth

- bun add better-auth
- src/lib/auth.ts: betterAuth({ database: prismaAdapter(prisma,{provider:"sqlite"}), emailAndPassword:{enabled:true}, plugins:[nextCookies()] })
- npx @better-auth/cli generate -> appends User/Session/Account/Verification to prisma/schema.prisma; then bun run migrate
- Mount src/app/api/auth/[...all]/route.ts
- serverEnv: BETTER_AUTH_SECRET required (min 32 chars)
- seed.ts: upsert admin via auth.api.signUpEmail({body:{email,name:"Admin",password}}) reading ADMIN_EMAIL/ADMIN_PASSWORD; skip if user exists
- scripts/setup.ts + package.json "setup": bun install -> copy .env.example if missing (+ auto-generate BETTER_AUTH_SECRET) -> prisma migrate dev -> prisma generate -> seed

## Phase 3 - Guard + login

- src/proxy.ts: getSessionCookie() optimistic redirect /admin/* -> /login; /login -> /admin if cookie present; matcher ["/admin/:path*","/login"]
- src/app/login/page.tsx: client signInEmail form per project form pattern; noindex metadata; zero links
- src/app/admin/layout.tsx: auth.api.getSession guard -> redirect("/login"); sidebar nav

## Phase 4 - Admin CRUD

Routes under src/app/admin/: page.tsx overview; messages/page.tsx; profile/page.tsx; projects/{page,new,[id]}; posts/{page,new,[id]}; analytics/page.tsx
Server actions in src/server/actions/admin/*.ts, each starts with auth.api.getSession({headers}) via Better Auth API and rejects unauthenticated callers. Zod schemas in zodSchema.ts.
Port logic: post seq = (_max.seq ?? 0)+1 (from blogService); uniqueSlug; parseTags; estimateReadingTime; project importProjectFromGitHub from src/server/github/repoImport.ts.
Post content limit raised beyond old Discord 4000 chars (~50000).
Messages: list w/ read/unread toggle, delete. Profile: structured repeatable editors for socials/skills/experiences/education.

## Phase 5 - Docs/hidden

robots.ts disallow /admin,/login; noindex metadata on both; AGENTS.md Discord section rewrite + auth gotchas + analytics notes; README deploy vars += BETTER_AUTH_SECRET.

## Phase 6 - Verify

bun lint && bun run build; smoke test login + CRUD + tracker beacon writes rows.

## Phase 7 - Visitor analytics (see "Analytics decisions" above)

1. Schema: VisitorSession, Pageview, IpGeoCache + migration
2. Tracker client component in root layout + /api/analytics/collect route handler
3. src/server/analytics/{geo.ts,stats.ts} (ipwho.is -> ip-api fallback, IpGeoCache, 90d prune)
4. shadcn component additions (card chart table badge tabs select switch separator dropdown-menu dialog alert-dialog label)
5. /admin/analytics page (range tabs, stat cards, daily chart, top countries/pages/referrers/devices tables) + overview widgets
