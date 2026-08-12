import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kos-bu-henny-api.vercel.app",
        pathname: "/media/**",
      },
    ],
  },
};

export default nextConfig;