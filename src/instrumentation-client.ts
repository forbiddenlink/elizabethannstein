import * as Sentry from '@sentry/nextjs'

// Next 15+ loads this file on the client. The SDK only injects the legacy
// sentry.client.config.ts through a webpack entry, so under Turbopack (this
// app's bundler) that file was never bundled and client errors went nowhere.
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Only the real production deploy reports; a local `next start` is also NODE_ENV=production.
  enabled:
    process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_VERCEL_ENV === 'production',

  // Performance Monitoring
  tracesSampleRate: 0.1, // 10% of transactions

  // Session Replay - capture errors
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 1.0,

  // Third-party script injected by a visitor's browser extension (not in this repo);
  // its own network failure is not actionable. ELIZABETHANNSTEIN-5.
  ignoreErrors: [/\(my\.productfruits\.com\)/],

  // WebGL/Three.js specific settings
  beforeSend(event) {
    // Filter out known WebGL context lost errors (common, not actionable)
    if (event.message?.includes('WebGL context lost')) {
      return null
    }
    return event
  },

  integrations: [
    Sentry.replayIntegration({
      // Mask text in replays by default — safer for visitors on a public portfolio site
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
})

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart
