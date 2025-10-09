import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  /* config options here */
  // Only use outputFileTracingRoot in local development
  // When deploying to Vercel with root directory set to "chriscakes-new", this should be omitted
  ...(process.env.VERCEL !== '1' && {
    outputFileTracingRoot: path.join(__dirname, '../../'),
  }),
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
