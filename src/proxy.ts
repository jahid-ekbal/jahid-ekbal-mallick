import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Optimistic, cookie-PRESENCE-only guard for /admin/*. The authoritative
// check lives in src/app/admin/layout.tsx (auth.api.getSession).
//
// There is deliberately NO "/login -> /admin if a cookie exists" redirect
// here: presence says nothing about validity, so stale cookies used to cause
// an endless /login <-> /admin bounce. The login page itself performs the
// authoritative redirect for users who arrive at /login while still signed
// in with a VALID session.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSessionCookie = getSessionCookie(request) !== null;

  if (pathname.startsWith("/admin")) {
    if (!hasSessionCookie) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
