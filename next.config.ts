import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "vanfestusa.com",
      },
    ],
  },
};

export default nextConfig;
