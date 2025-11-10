import type { NextConfig } from 'next';

const CONTENT_SECURITY_POLICY = `default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://js.stripe.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: https://images.unsplash.com https://placehold.co;
  font-src 'self' https://fonts.gstatic.com data:;
  connect-src 'self' https://api.github.com https://*.algolia.net https://www.google-analytics.com https://api.stripe.com;
  frame-src https://js.stripe.com https://hooks.stripe.com;
  frame-ancestors 'none';
`;

const securityHeaders = [
  // Referrer policy
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  // X Frame Options
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  // XSS Protection (legacy)
  {
    key: 'X-XSS-Protection',
    value: '0',
  },
  // Content Type Options
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  // Strict Transport Security
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  // Permissions Policy (formerly Feature-Policy)
  {
    key: 'Permissions-Policy',
    value: 'geolocation=(), microphone=(), camera=()',
  },
  // Content Security Policy
  {
    key: 'Content-Security-Policy',
    value: CONTENT_SECURITY_POLICY.replace(/\n/g, ' '),
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Configure allowed external image domains
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
  },
  // Apply headers for all routes and static assets
  async headers() {
    return [
      // Global security headers for all pages
      {
        source: '/:path*',
        headers: securityHeaders,
      },

      // Cache and security headers for _next static files
      {
        source: '/_next/static/:all*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },

      // Cache for public assets such as images
      {
        source: '/images/:all*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=604800, s-maxage=604800' }],
      },
    ];
  },
};

export default nextConfig;
