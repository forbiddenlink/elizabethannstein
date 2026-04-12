import bundleAnalyzer from '@next/bundle-analyzer'
import { withSentryConfig } from '@sentry/nextjs'
import { withAxiom } from 'next-axiom'

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  allowedDevOrigins: [
    'http://127.0.0.1:3100',
    'http://localhost:3100',
    'http://127.0.0.1:3000',
    'http://localhost:3000',
  ],
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', '@react-three/drei'],
    // Native view transitions for route changes (React 19 + Next 16)
    viewTransition: true,
  },
  // Security headers for production
  async headers() {
    // Content Security Policy - allows Three.js/WebGL, analytics, fonts
    const cspDirectives = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://vitals.vercel-insights.com https://va.vercel-scripts.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: blob: https://www.google-analytics.com https://www.googletagmanager.com",
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://vitals.vercel-insights.com https://va.vercel-scripts.com https://*.sentry.io https://*.ingest.sentry.io wss://*.sentry.io",
      "worker-src 'self' blob:",
      "child-src 'self' blob:",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; ')

    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Content-Security-Policy', value: cspDirectives },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      {
        // Cache OG images for 24 hours
        source: '/api/og/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=86400, immutable' }],
      },
    ]
  },
}

const sentryConfig = {
  // Suppresses source map upload logs during build
  silent: true,
  // Upload source maps for better stack traces
  widenClientFileUpload: true,
  // Hides source maps from generated client bundles
  hideSourceMaps: true,
  webpack: {
    treeshake: {
      removeDebugLogging: true,
    },
  },
}

export default withSentryConfig(withAxiom(withBundleAnalyzer(nextConfig)), sentryConfig)
