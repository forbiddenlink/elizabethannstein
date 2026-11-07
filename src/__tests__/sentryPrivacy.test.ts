import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({ init: vi.fn(), replay: vi.fn(() => ({ name: 'Replay' })) }))
vi.mock('@sentry/nextjs', () => ({
  init: mocks.init,
  replayIntegration: mocks.replay,
  captureRouterTransitionStart: vi.fn(),
  captureRequestError: vi.fn(),
}))

beforeEach(() => {
  vi.resetModules()
  vi.clearAllMocks()
})
afterEach(() => vi.unstubAllEnvs())

const entries = [
  ['server', () => import('../../sentry.server.config')],
  ['edge', () => import('../../sentry.edge.config')],
  ['client', () => import('../instrumentation-client')],
] as const

describe.each(entries)('Sentry %s privacy compatibility', (_runtime, load) => {
  it.each([
    ['production', 'production', true],
    ['production', 'preview', false],
    ['production', '', false],
    ['development', 'production', false],
  ])('preserves collection and enable gates for %s/%s', async (nodeEnv, deployEnv, enabled) => {
    vi.stubEnv('NODE_ENV', nodeEnv)
    vi.stubEnv('VERCEL_ENV', deployEnv)
    vi.stubEnv('NEXT_PUBLIC_VERCEL_ENV', deployEnv)
    vi.stubEnv('NEXT_PUBLIC_SENTRY_DSN', '')
    await load()
    const options = mocks.init.mock.calls[0][0]
    expect(options.enabled).toBe(enabled)
    expect(options.tracesSampleRate).toBe(0.1)
    expect(options.traceLifecycle).toBe('static')
    const deny = ['forwarded', '-ip', 'remote-', 'via', '-user']
    expect(options.dataCollection).toEqual({
      userInfo: false,
      cookies: { deny },
      httpHeaders: { request: { deny }, response: { deny } },
      httpBodies: [],
      urlQueryParams: { deny },
      genAI: { inputs: false, outputs: false },
      databaseQueryData: false,
      graphQL: { document: true, variables: true },
      stackFrameVariables: true,
      frameContextLines: 7,
      mcp: { inputs: false, outputs: false },
      queues: false,
    })
  })
})

it('preserves client replay masking and known-error filters', async () => {
  await import('../instrumentation-client')
  const options = mocks.init.mock.calls[0][0]
  expect(mocks.replay).toHaveBeenCalledWith({ maskAllText: true, blockAllMedia: true })
  expect(options.replaysSessionSampleRate).toBe(0)
  expect(options.replaysOnErrorSampleRate).toBe(1)
  expect(options.ignoreErrors[0].test('(my.productfruits.com)')).toBe(true)
  expect(options.beforeSend({ message: 'WebGL context lost' })).toBeNull()
  const normal = { message: 'Unexpected application error' }
  expect(options.beforeSend(normal)).toBe(normal)
})
