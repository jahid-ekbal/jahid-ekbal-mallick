import type { NextConfig } from "next";
import "./src/lib/env/clientEnv";
import "./src/lib/env/serverEnv";

const isDev = process.env.NODE_ENV === "development";

// Content-Security-Policy kept intentionally strict for a portfolio app:
// - script/style keep 'unsafe-inline' because Next.js ships inline bootstrap
//   scripts and React inline styles (no nonce infrastructure at proxy level).
// - img-src allows https: because admin-entered project cover images point at
//   arbitrary remote hosts.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self'",
  "connect-src 'self'",
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  // Render terminates TLS; browsers ignore HSTS delivered over plain HTTP,
  // so local development stays unaffected.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
  // Modern best practice: disable the legacy XSS auditor's unsafe heuristics.
  { key: "X-XSS-Protection", value: "0" },
];

const nextConfig: NextConfig = {
  reactCompiler: true,
  typedRoutes: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  experimental: {
    serverActions: {
      // Server Actions accept JSON-RPC-ish payloads; cap them well below the
      // framework default (1MB) - the largest legitimate payload is a blog
      // post body (50KB zod-max'd) plus markdown overhead.
      bodySizeLimit: "512kb",
    },
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
