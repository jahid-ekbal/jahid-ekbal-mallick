import { NextResponse, type NextRequest } from "next/server";

import prisma from "@/lib/dbClient/prisma";
import { isPrivateAddress, resolveCountryCode } from "@/server/analytics/geo";

const VISITOR_COOKIE = "vkey";
const SESSION_COOKIE = "vsession";
const PRUNE_CHANCE = 0.05;

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return request.headers.get("x-real-ip") ?? "";
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
  let body: {
    type?: string;
    path?: string;
    referrer?: string;
    dwellSeconds?: number;
  };
  try {
    body = await request.json();
  } catch {
    return new NextResponse(null, { status: 400 });
  }

  const userAgent = request.headers.get("user-agent") ?? "";
  const device = detectDevice(userAgent);
  if (device === "bot" || !body.path || !body.path.startsWith("/")) {
    return new NextResponse(null, { status: 204 });
  }

  const visitorKey =
    request.cookies.get(VISITOR_COOKIE)?.value ?? crypto.randomUUID();
  const sessionCookie = request.cookies.get(SESSION_COOKIE)?.value;
  const ip = getClientIp(request);
  const isLocal = isPrivateAddress(ip);

  if (body.type === "dwell") {
    if (sessionCookie) {
      const seconds = Math.max(
        0,
        Math.min(3600, Math.round(body.dwellSeconds ?? 0)),
      );
      await prisma.visitorSession.updateMany({
        where: { id: sessionCookie },
        data: {
          lastSeenAt: new Date(),
          durationSec: { increment: seconds },
        },
      });
    }
    return new NextResponse(null, { status: 204 });
  }

  // Page view
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
  const year = 60 * 60 * 24 * 365;
  response.cookies.set(VISITOR_COOKIE, visitorKey, {
    maxAge: year,
    sameSite: "lax",
    path: "/",
  });
  if (isNewSession) {
    response.cookies.set(SESSION_COOKIE, activeSession.id, {
      maxAge: 60 * 30,
      sameSite: "lax",
      path: "/",
    });
  }

  if (Math.random() < PRUNE_CHANCE) {
    await pruneOldRows().catch(() => undefined);
  }

  return response;
}
