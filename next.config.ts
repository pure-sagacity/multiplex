import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  experimental: {
    serverActions: {
      bodySizeLimit: 2 * 1024 * 1024, // 4 MB
    }
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'onlcvwoumznbkbugtqas.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
