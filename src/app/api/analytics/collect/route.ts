import { NextResponse, type NextRequest } from "next/server";

import prisma from "@/lib/dbClient/prisma";
import { checkRateLimit, clientIpFromHeaders } from "@/lib/rateLimit";
import { isPrivateAddress, resolveCountryCode } from "@/server/analytics/geo";

const VISITOR_COOKIE = "vkey";
const SESSION_COOKIE = "vsession";
const PRUNE_CHANCE = 0.05;

// Unauthenticated collector: generous enough for real browsing (pageview per
// navigation + 15s heartbeats), tight enough to blunt DB-flooding scripts.
const PAGEVIEW_LIMIT = { limit: 30, windowMs: 60_000 };
const DWELL_LIMIT = { limit: 60, windowMs: 60_000 };

/** Hard cap on request payload size; valid payloads are a few hundred bytes. */
const MAX_BODY_BYTES = 2048;
/** Lifetime ceiling for tracked session duration. */
const MAX_TOTAL_DURATION_SEC = 86_400;

function tooManyRequests(retryAfterSec: number): NextResponse {
  return new NextResponse(null, {
    status: 429,
    headers: {
      "Retry-After": String(Math.max(1, retryAfterSec)),
      "Cache-Control": "no-store",
    },
  });
}

function detectDevice(userAgent: string): string {
  const ua = userAgent.toLowerCase();
  if (!ua) return "unknown";
  if (/(bot|crawler|spider|crawling|headless)/.test(ua)) return "bot";
  if (/ipad|tablet/.test(ua)) return "tablet";
  if (/mobi|android|iphone/.test(ua)) return "mobile";
  return "desktop";
}

async function pruneOldRows(): Promise<void> {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 90);
  await prisma.visitorSession.deleteMany({
    where: { startedAt: { lt: cutoff } },
  });
}

export async function POST(request: NextRequest) {
  const ip = clientIpFromHeaders(request.headers);

  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return new NextResponse(null, { status: 400 });
  }
  if (raw.length > MAX_BODY_BYTES) {
    return new NextResponse(null, { status: 413 });
  }

  let body: {
    type?: string;
    path?: string;
    referrer?: string;
    dwellSeconds?: number;
  };
  try {
    body = JSON.parse(raw);
  } catch {
    return new NextResponse(null, { status: 400 });
  }

  const userAgent = request.headers.get("user-agent") ?? "";
  const device = detectDevice(userAgent);
  if (device === "bot" || !body.path || !body.path.startsWith("/")) {
    return new NextResponse(null, { status: 204 });
  }

  if (body.type === "dwell") {
    const limited = checkRateLimit(`analytics:${ip}`, DWELL_LIMIT);
    if (!limited.ok) return tooManyRequests(limited.retryAfterSec);

    const sessionCookie = request.cookies.get(SESSION_COOKIE)?.value;
    if (sessionCookie) {
      const seconds = Math.max(
        0,
        Math.min(3600, Math.round(body.dwellSeconds ?? 0)),
      );
      // Duration ceiling enforced at the row level so flooders cannot inflate
      // time-on-site beyond one day per session.
      await prisma.visitorSession.updateMany({
        where: { id: sessionCookie, durationSec: { lt: MAX_TOTAL_DURATION_SEC } },
        data: {
          lastSeenAt: new Date(),
          durationSec: { increment: seconds },
        },
      });
    }
    return new NextResponse(null, { status: 204 });
  }

  // Pageview
  const pageviewLimit = checkRateLimit(`analytics:${ip}`, PAGEVIEW_LIMIT);
  if (!pageviewLimit.ok) return tooManyRequests(pageviewLimit.retryAfterSec);

  const visitorKey =
    request.cookies.get(VISITOR_COOKIE)?.value ?? crypto.randomUUID();
  const sessionCookie = request.cookies.get(SESSION_COOKIE)?.value;
  const isLocal = isPrivateAddress(ip);

  const country = isLocal ? "Local" : await resolveCountryCode(ip);
  const now = new Date();

  const session =
    sessionCookie ?
      ((await prisma.visitorSession.findUnique({
        where: { id: sessionCookie },
      })) ?? null)
    : null;

  const isNewSession = !session;
  const activeSession =
    session ??
    (await prisma.visitorSession.create({
      data: {
        visitorKey,
        ipAddress: isLocal ? null : ip,
        country,
        referrer: body.referrer?.slice(0, 500) ?? null,
        landingPath: body.path.slice(0, 300),
        device,
        startedAt: now,
        lastSeenAt: now,
      },
    }));

  await prisma.pageview.create({
    data: {
      sessionId: activeSession.id,
      path: body.path.slice(0, 300),
    },
  });

  const response = new NextResponse(null, { status: 204 });
  const cookieOptions = {
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  } as const;
  response.cookies.set(VISITOR_COOKIE, visitorKey, {
    ...cookieOptions,
    maxAge: 60 * 60 * 24 * 365,
  });
  if (isNewSession) {
    response.cookies.set(SESSION_COOKIE, activeSession.id, {
      ...cookieOptions,
      maxAge: 60 * 30,
    });
  }

  if (Math.random() < PRUNE_CHANCE) {
    await pruneOldRows().catch(() => undefined);
  }

  return response;
}

