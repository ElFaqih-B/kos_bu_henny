import type { NextConfig } from "next";

const backend =
  process.env.BACKEND_INTERNAL_URL || "http://localhost:8000";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "*.trycloudflare.com",
  ],

  // Proxy FastAPI
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${backend}/api/v1/:path*`,
      },
      {
        source: "/media/:path*",
        destination: `${backend}/media/:path*`,
      },
    ];
  },
};

export default nextConfig;