import type { NextConfig } from "next";

// Static portfolio site. Served as plain files from the `out` directory,
// so server features (headers, redirects, rewrites, server actions) are off.
// Add security headers at the host level if needed.
const nextConfig: NextConfig = {
  output: "export",
  reactCompiler: true,
  typedRoutes: true,
  poweredByHeader: false,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
