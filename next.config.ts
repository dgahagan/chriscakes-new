import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  // outputFileTracingRoot removed - not needed when Vercel root directory is set to "chriscakes-new"
  // This was causing 404s on Vercel deployments
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
};

export default nextConfig;
