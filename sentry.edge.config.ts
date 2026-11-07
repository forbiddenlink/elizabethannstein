import * as Sentry from '@sentry/nextjs'
import { sentryCompatibilityOptions } from './src/lib/sentry-options'

Sentry.init({
  ...sentryCompatibilityOptions,
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Only the real production deploy reports; a local `next start` is also NODE_ENV=production.
  enabled: process.env.NODE_ENV === 'production' && process.env.VERCEL_ENV === 'production',

  // Performance Monitoring
  tracesSampleRate: 0.1,
})
