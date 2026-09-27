import * as Sentry from '@sentry/nextjs'

// Next 15+ loads this file on the client. The SDK only injects the legacy
// sentry.client.config.ts through a webpack entry, so under Turbopack (this
// app's bundler) that file was never bundled and client errors went nowhere.
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

    // troika-three-text (behind @react-three/drei's <Text>, used by
    // GalaxyLabels/ScanSystem/PlanetSurfaceExplorer on /explore) falls back to
    // a Web Worker for glyph SDF generation when its main-thread WebGL path
    // fails. Mobile Safari can silently fail `importScripts()` on the blob:
    // URL that worker rehydrates its init function from, so the worker
    // reports back "not callable" instead of throwing loudly. Nothing in app
    // code can intercept that internal Promise chain without patching the
    // dependency, so this is unactionable noise, not a real crash: the rest
    // of /explore keeps working, only that text label fails to render.
    const exceptionValue = event.exception?.values?.[0]?.value
    if (exceptionValue?.includes('did not return a callable function')) {
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
