import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allow any hostname for external images (dummy images, property listings, s3, etc)
      },
      {
        protocol: 'http',
        hostname: 'localhost', // For local uploads
      }
    ]
  }
};

export default nextConfig;
