/**
 * API Smoke Tests
 *
 * Priority: P0 - Critical
 * Run: Before every deploy
 *
 * Validates:
 * - /api/chat accepts valid requests
 * - API returns proper response format
 */

import { test, expect } from '@playwright/test'

test.describe('Chat API Smoke Tests', () => {
  test('POST /api/chat accepts valid request', async ({ request }) => {
    const response = await request.post('/api/chat', {
      data: {
        messages: [
          { role: 'user', content: 'Hello' }
        ]
      }
    })

    expect(response.status()).toBe(200)

    const body = await response.json()
    expect(body).toHaveProperty('role', 'assistant')
    expect(body).toHaveProperty('content')
    expect(typeof body.content).toBe('string')
  })

  test('POST /api/chat returns 400 for empty messages', async ({ request }) => {
    const response = await request.post('/api/chat', {
      data: {
        messages: []
      }
    })

    expect(response.status()).toBe(400)

    const body = await response.json()
    expect(body).toHaveProperty('error')
  })
})
