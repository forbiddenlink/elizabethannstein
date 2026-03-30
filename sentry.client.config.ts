import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Only enable in production
  enabled: process.env.NODE_ENV === 'production',

  // Performance Monitoring
  tracesSampleRate: 0.1, // 10% of transactions

  // Session Replay - capture errors
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 1.0,

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
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
})
