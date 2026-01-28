import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  experimental: {
    serverActions: {
      bodySizeLimit: 2 * 1024 * 1024, // 4 MB
    }
  }
};

export default nextConfig;
