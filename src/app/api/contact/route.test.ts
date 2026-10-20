// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest'
import { POST } from './route'

function post(body: string): Promise<Response> {
  return POST(
    new Request('http://localhost/api/contact', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body,
    })
  )
}

describe('POST /api/contact body validation', () => {
  it('returns 400 for malformed JSON', async () => {
    const res = await post('{not json')
    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ error: 'Invalid request body' })
  })

  it('returns 400 for a non-object JSON body', async () => {
    const res = await post('null')
    expect(res.status).toBe(400)
    expect(await res.json()).toHaveProperty('error')
  })

  it('returns 400 for missing fields', async () => {
    const res = await post('{}')
    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ error: 'Missing required fields' })
  })
})

describe('POST /api/contact without RESEND_API_KEY', () => {
  const valid = JSON.stringify({ name: 'Ada', email: 'ada@example.com', message: 'Hello there' })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('returns 503 in production so the visitor is not told it was sent', async () => {
    vi.stubEnv('RESEND_API_KEY', '')
    vi.stubEnv('NODE_ENV', 'production')
    const err = vi.spyOn(console, 'error').mockImplementation(() => {})
    const res = await post(valid)
    expect(res.status).toBe(503)
    expect(await res.json()).toHaveProperty('error')
    expect(err).toHaveBeenCalled()
    err.mockRestore()
  })

  it('keeps the dev convenience outside production', async () => {
    vi.stubEnv('RESEND_API_KEY', '')
    vi.stubEnv('NODE_ENV', 'development')
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const res = await post(valid)
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ ok: true, dev: true })
    warn.mockRestore()
  })
})
