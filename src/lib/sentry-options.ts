import type { init } from '@sentry/nextjs'

// Preserve Sentry 10's collection and tracing behavior during the SDK 11 migration.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/migration/v10-to-v11/
export const sentryCompatibilityOptions = {
  dataCollection: {
    userInfo: false,
    cookies: { deny: ['forwarded', '-ip', 'remote-', 'via', '-user'] },
    httpHeaders: {
      request: { deny: ['forwarded', '-ip', 'remote-', 'via', '-user'] },
      response: { deny: ['forwarded', '-ip', 'remote-', 'via', '-user'] },
    },
    httpBodies: [],
    urlQueryParams: { deny: ['forwarded', '-ip', 'remote-', 'via', '-user'] },
    genAI: { inputs: false, outputs: false },
    databaseQueryData: false,
    graphQL: { document: true, variables: true },
    stackFrameVariables: true,
    frameContextLines: 7,
    // These categories are new in SDK 11; do not expand collection implicitly.
    mcp: { inputs: false, outputs: false },
    queues: false,
  },
  traceLifecycle: 'static',
} satisfies NonNullable<Parameters<typeof init>[0]>
