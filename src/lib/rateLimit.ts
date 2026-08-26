// Minimal in-memory fixed-window rate limiter. Deliberately dependency-free
// and single-process: this app runs as exactly one Render instance, so an
// in-memory map is sufficient and adds no cold-start/network cost. Keys are
// namespaced by callers, e.g. `contact:${ip}` or `analytics:${ip}`.
interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();
let lastSweepAt = Date.now();
const SWEEP_INTERVAL_MS = 60_000;

export interface RateLimitResult {
  ok: boolean;
  /** Seconds until the window resets; 0 when allowed. */
  retryAfterSec: number;
}

export function checkRateLimit(
  key: string,
  options: { limit: number; windowMs: number },
): RateLimitResult {
  const { limit, windowMs } = options;
  const now = Date.now();

  // Opportunistic garbage collection so attacker-controlled keys cannot grow
  // the map without bound.
  if (now - lastSweepAt >= SWEEP_INTERVAL_MS) {
    lastSweepAt = now;
    for (const [bucketKey, bucket] of buckets) {
      if (bucket.resetAt <= now) buckets.delete(bucketKey);
    }
  }

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfterSec: 0 };
  }

  bucket.count += 1;
  if (bucket.count > limit) {
    return { ok: false, retryAfterSec: Math.ceil((bucket.resetAt - now) / 1000) };
  }
  return { ok: true, retryAfterSec: 0 };
}

/**
 * Best-effort client IP behind an appending proxy such as Render's load
 * balancer. Appending proxies ADD the real socket peer to the END of any
 * client-supplied X-Forwarded-For chain, so the RIGHTMOST token is the only
 * one an attacker cannot spoof by sending their own header. (Better Auth
 * walks the same direction internally.)
 */
export function clientIpFromHeaders(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  const fromChain =
    forwarded?.split(",").at(-1)?.trim() ?? headers.get("x-real-ip") ?? "";
  return fromChain.slice(0, 45) || "unknown";
}
