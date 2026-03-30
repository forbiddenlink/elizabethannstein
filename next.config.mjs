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
  },
}

const sentryConfig = {
  // Suppresses source map upload logs during build
  silent: true,
  // Upload source maps for better stack traces
  widenClientFileUpload: true,
  // Hides source maps from generated client bundles
  hideSourceMaps: true,
  // Tree-shake Sentry logger statements
  disableLogger: true,
}

export default withSentryConfig(
  withAxiom(withBundleAnalyzer(nextConfig)),
  sentryConfig
)
