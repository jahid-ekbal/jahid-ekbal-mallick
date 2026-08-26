import prisma from "@/lib/dbClient/prisma";

export type RangeKey = "7d" | "30d" | "90d";

export function rangeStart(range: RangeKey): Date {
  const days =
    range === "7d" ? 7
    : range === "30d" ? 30
    : 90;
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(0, 0, 0, 0);
  return date;
}

function formatDay(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export async function getAnalytics(range: RangeKey) {
  const start = rangeStart(range);

  const [sessions, pageviews, totalVisitors, avgDuration] = await Promise.all([
    prisma.visitorSession.findMany({
      where: { startedAt: { gte: start } },
      select: {
        id: true,
        visitorKey: true,
        country: true,
        referrer: true,
        landingPath: true,
        device: true,
        startedAt: true,
        durationSec: true,
      },
    }),
    prisma.pageview.count({
      where: { createdAt: { gte: start } },
    }),
    prisma.visitorSession.findMany({
      select: { visitorKey: true },
      distinct: ["visitorKey"],
    }),
    prisma.visitorSession.aggregate({
      where: { startedAt: { gte: start } },
      _avg: { durationSec: true },
    }),
  ]);

  // Daily series
  const dailyMap = new Map<
    string,
    { visitors: Set<string>; pageviews: number }
  >();
  const pvRows = await prisma.pageview.findMany({
    where: { createdAt: { gte: start } },
    select: { createdAt: true, sessionId: true },
  });
  const sessionById = new Map(sessions.map((s) => [s.id, s]));
  for (let i = 0; i < 90; i++) {
    const day = new Date(start);
    day.setDate(start.getDate() + i);
    if (day.getTime() <= Date.now()) {
      dailyMap.set(formatDay(day), { visitors: new Set(), pageviews: 0 });
    }
  }
  for (const row of pvRows) {
    const entry = dailyMap.get(formatDay(row.createdAt));
    if (entry) {
      entry.pageviews += 1;
      const session = sessionById.get(row.sessionId);
      if (session) entry.visitors.add(session.visitorKey);
    }
  }
  const daily = [...dailyMap.entries()].map(([date, value]) => ({
    date,
    visitors: value.visitors.size,
    pageviews: value.pageviews,
  }));

  const byCountry = new Map<string, number>();
  for (const session of sessions) {
    const key = session.country ?? "Unknown";
    byCountry.set(key, (byCountry.get(key) ?? 0) + 1);
  }

  const byPath = new Map<string, number>();
  const byReferrer = new Map<string, number>();
  const byDevice = new Map<string, number>();
  for (const row of pvRows) {
    void row;
  }
  const pvWithPath = await prisma.pageview.findMany({
    where: { createdAt: { gte: start } },
    select: { path: true, sessionId: true },
  });
  for (const row of pvWithPath) {
    byPath.set(row.path, (byPath.get(row.path) ?? 0) + 1);
    const session = sessionById.get(row.sessionId);
    if (session?.referrer) {
      let host = session.referrer;
      try {
        host = new URL(session.referrer).hostname;
      } catch {
        /* keep raw */
      }
      byReferrer.set(host, (byReferrer.get(host) ?? 0) + 1);
    }
    if (session) {
      const key = session.device ?? "unknown";
      byDevice.set(key, (byDevice.get(key) ?? 0) + 1);
    }
  }

  const top = (map: Map<string, number>, n = 8) =>
    [...map.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, n)
      .map(([name, count]) => ({ name, count }));

  return {
    uniqueVisitors: new Set(sessions.map((s) => s.visitorKey)).size,
    totalVisitorsAllTime: totalVisitors.length,
    pageviews,
    avgDurationSec: Math.round(avgDuration._avg.durationSec ?? 0),
    daily,
    countries: top(byCountry),
    pages: top(byPath),
    referrers: top(byReferrer),
    devices: top(byDevice),
    recentSessions: sessions
      .sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime())
      .slice(0, 10)
      .map((session) => ({
        id: session.id,
        country: session.country,
        landingPath: session.landingPath,
        device: session.device,
        startedAt: session.startedAt.toISOString(),
        durationSec: session.durationSec,
        pageviews: 0,
      })),
  };
}

export type AnalyticsData = Awaited<ReturnType<typeof getAnalytics>>;
