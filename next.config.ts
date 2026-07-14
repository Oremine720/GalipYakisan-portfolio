import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "github-readme-stats.vercel.app",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  // /frezya klasörü (public/frezya) için temiz URL — mevcut route'ları etkilemez
  async rewrites() {
    return [{ source: "/frezya", destination: "/frezya/index.html" }];
  },
};

export default nextConfig;
