import type { NextConfig } from 'next';

// Sourced from the environment so it cannot drift from the Sanity client,
// which reads the same variable (see lib/sanity.ts).
const sanityProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;

if (!sanityProjectId) {
  console.warn(
    'NEXT_PUBLIC_SANITY_PROJECT_ID is not set — Sanity image URLs will not be ' +
      'scoped to this project.'
  );
}

/**
 * Content Security Policy.
 *
 * `'unsafe-inline'` in script-src is unavoidable here: the App Router emits
 * per-page inline hydration scripts, and the nonce alternative requires
 * middleware, which would force every route to render dynamically and defeat
 * the static prerendering + ISR this site depends on. Everything else is
 * locked down, so this is a deliberate, bounded trade-off rather than an
 * oversight.
 *
 * style-src likewise needs 'unsafe-inline' for Next's injected critical CSS.
 */
const publicCsp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://cdn.sanity.io https://www.googletagmanager.com https://www.google-analytics.com",
  "font-src 'self' data:",
  "connect-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com",
  // VideoSection embeds YouTube.
  'frame-src https://www.youtube.com https://www.youtube-nocookie.com',
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  'upgrade-insecure-requests',
].join('; ');

/**
 * Sanity Studio runs same-origin at /studio and is a far heavier consumer than
 * the public site: it evaluates code at runtime, opens websockets to the
 * Sanity API, and renders previews and file uploads through blob: URLs.
 *
 * A deliberately relaxed policy is scoped to this path. The public site keeps
 * the strict policy above — the two sources must never both match a request,
 * or the browser would enforce the intersection of the two headers.
 */
const studioCsp = [
  "default-src 'self'",
  // core.sanity-cdn.com serves the visual-editing bridge that Studio loads at
  // runtime — verified blocked without this entry.
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https://core.sanity-cdn.com https://*.sanity-cdn.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://cdn.sanity.io https://*.sanity.io https://*.sanity-cdn.com",
  "font-src 'self' data: https://*.sanity.io https://*.sanity-cdn.com",
  "connect-src 'self' https://*.api.sanity.io wss://*.api.sanity.io https://*.apicdn.sanity.io https://cdn.sanity.io https://*.sanity.io https://*.sanity-cdn.com",
  "frame-src 'self' blob:",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
].join('; ');

const sharedHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        // Scope to this project's asset path so the loader cannot be pointed
        // at another project's images.
        ...(sanityProjectId
          ? { pathname: `/images/${sanityProjectId}/**` }
          : {}),
      },
    ],
  },
  async headers() {
    return [
      {
        // Everything except /studio. The negative lookahead keeps this from
        // overlapping the Studio entry below — two matching sources would
        // emit two CSP headers and the browser would enforce both.
        source: '/:path((?!studio).*)',
        headers: [
          ...sharedHeaders,
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Content-Security-Policy', value: publicCsp },
        ],
      },
      {
        source: '/studio/:path*',
        headers: [
          ...sharedHeaders,
          // Studio renders previews in same-origin iframes.
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Content-Security-Policy', value: studioCsp },
        ],
      },
    ];
  },
};

export default nextConfig;
