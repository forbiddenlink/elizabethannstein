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
    // `experimental.viewTransition` was removed in Next 16 and every build
    // logged it as an unrecognized key, so the flag never did anything. View
    // transitions now come from React's own `<ViewTransition>` component, which
    // Next triggers on navigation with no config. Nothing here uses it yet.
  },
  // Preserve the old case-study URL after the confidentiality rename.
  async redirects() {
    return [
      {
        source: '/work/crc-ready5-assessment',
        destination: '/work/security-readiness-platform',
        permanent: true,
      },
    ]
  },
  // Security headers for production
  async headers() {
    const isDev = process.env.NODE_ENV !== 'production'

    // Content Security Policy, split into explicit directives instead of one loose
    // default-src (RV scan 2026-09-22: csp_eval_plain_url_scheme, csp_eval_script_unsafe_inline,
    // csp_unsafe_eval, csp_wildcard_source). Every host below was verified against the
    // codebase (Google Analytics/GTM in src/components/Analytics.tsx, Vercel Web Vitals
    // beacon host from the existing dns-prefetch hint, Sentry's ingest pattern) — no
    // remote images, fonts (next/font self-hosts), or eval()/new Function() usage exist,
    // so those directives can be tight. 'unsafe-inline' stays on script-src/style-src:
    // the GA inline snippet and the per-page JSON-LD <script> blocks (layout.tsx,
    // work/page.tsx, work/[slug]/page.tsx, about/page.tsx) are inline scripts, and
    // nonce-based CSP would force those routes off static generation (SSG) onto
    // per-request dynamic rendering — not worth it for a script surface that's 100%
    // first-party, developer-authored content with no user input reflected into it.
    const cspDirectives = [
      // Safety net for any fetch directive not explicitly overridden below
      // (manifest-src, media-src, worker-src, ...) — without this, an unlisted
      // directive falls back to unrestricted rather than 'self'.
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval' https://va.vercel-scripts.com" : ''} https://www.googletagmanager.com`,
      "style-src 'self' 'unsafe-inline'",
      // data: is needed for the inline SVG noise texture in globals.css and for
      // next/image blur placeholders; both are first-party, author-written markup.
      "img-src 'self' data:",
      "font-src 'self'",
      "connect-src 'self' https://www.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com https://vitals.vercel-insights.com https://*.ingest.sentry.io https://*.ingest.us.sentry.io",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
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
