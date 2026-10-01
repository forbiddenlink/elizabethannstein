// @vitest-environment node
import { describe, expect, it } from 'vitest'
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
