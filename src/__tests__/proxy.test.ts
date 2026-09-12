// @vitest-environment node
import { HttpResponse, http } from 'msw'
import { NextRequest } from 'next/server'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { server } from '@/mocks/server'

// Sentry ELIZABETHANNSTEIN-2: Arcjet's default Node transport holds a
// node:http2 session to decide.arcjet.com, and a GOAWAY on that idle session
// is thrown as an uncaughtException that kills the function. The decide call
// must go through fetch instead. msw intercepts fetch but not node:http2, so
// the handler below only sees the call when fetch made it.
const DECIDE_URL = 'https://decide.arcjet.com/proto.decide.v1alpha1.DecideService/Decide'

async function loadProxy() {
  vi.resetModules()
  vi.stubEnv('ARCJET_KEY', 'ajkey_test')
  return (await import('@/proxy')).proxy
}

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('proxy', () => {
  it('sends the Arcjet decide call through fetch and enforces a DENY', async () => {
    const authHeaders: string[] = []
    server.use(
      http.post(DECIDE_URL, ({ request }) => {
        authHeaders.push(request.headers.get('authorization') ?? '')
        return HttpResponse.json({
          decision: {
            id: 'test-decision',
            conclusion: 'CONCLUSION_DENY',
            reason: { shield: { shieldTriggered: true } },
            ruleResults: [],
            ttl: 0,
          },
        })
      })
    )
    const proxy = await loadProxy()

    const res = await proxy(
      new NextRequest('https://elizabethannstein.com/api/chat', {
        headers: { 'x-forwarded-for': '8.8.8.8' },
      })
    )

    expect(authHeaders).toEqual(['Bearer ajkey_test'])
    expect(res.status).toBe(403)
  })

  // Arcjet fails open: when decide errors, the request is allowed. That is the
  // right default for availability, but it must not be silent, or a broken
  // transport or key disables the shield, bot check and rate limit unnoticed.
  it('fails open on a decide error but logs it', async () => {
    server.use(
      http.post(DECIDE_URL, () =>
        HttpResponse.json({ code: 'internal', message: 'decide unavailable' }, { status: 500 })
      )
    )
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const proxy = await loadProxy()

    const res = await proxy(
      new NextRequest('https://elizabethannstein.com/api/chat', {
        headers: {
          'user-agent': 'Mozilla/5.0 (Macintosh) AppleWebKit/537.36 Chrome/140.0 Safari/537.36',
          'x-forwarded-for': '8.8.8.8',
        },
      })
    )

    expect(res.status).toBe(200)
    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining('[proxy] Arcjet'),
      expect.stringContaining('decide unavailable')
    )
    errorSpy.mockRestore()
  })
})
