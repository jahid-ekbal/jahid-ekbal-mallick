import prisma from "@/lib/dbClient/prisma";

const PRIMARY = "https://ipwho.is";
const FALLBACK = "http://ip-api.com/json";

export function isPrivateAddress(ip: string): boolean {
  if (!ip) return true;
  return (
    ip === "::1" ||
    ip === "127.0.0.1" ||
    ip.startsWith("::ffff:127.") ||
    ip.startsWith("10.") ||
    ip.startsWith("192.168.") ||
    ip.startsWith("169.254.") ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(ip) ||
    ip.startsWith("fc") ||
    ip.startsWith("fd")
  );
}

export async function resolveCountryCode(ip: string): Promise<string | null> {
  const cached = await prisma.ipGeoCache.findUnique({ where: { ip } });
  if (cached) return cached.countryCode;

  const code =
    (await lookup(PRIMARY, ip)) ?? (await lookup(FALLBACK, ip)) ?? null;

  await prisma.ipGeoCache.upsert({
    where: { ip },
    update: { countryCode: code },
    create: { ip, countryCode: code },
  });
  return code;
}

async function lookup(base: string, ip: string): Promise<string | null> {
  try {
    const response = await fetch(`${base}/${ip}`, {
      signal: AbortSignal.timeout(4000),
    });
    if (!response.ok) return null;
    const data = (await response.json()) as {
      success?: boolean;
      country_code?: string;
      countryCode?: string;
    };
    return data.country_code ?? data.countryCode ?? null;
  } catch {
    return null;
  }
}
