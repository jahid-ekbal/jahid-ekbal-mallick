import { NextResponse } from "next/server";

// Liveness probe for platform health checks (e.g. Render healthCheckPath).
// Deliberately dependency-free and cache-disabled so it always reflects the
// running process; a failed HTTP check rolls back a Render deploy safely.
export async function GET() {
  return NextResponse.json(
    {
      status: "ok",
      uptimeSec: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}