import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.tmdb.org',
        port: '',
        search: '',
      },
    ],
  },
};

export default nextConfig;
