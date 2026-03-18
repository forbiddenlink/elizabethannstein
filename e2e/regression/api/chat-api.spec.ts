/**
 * Chat API Regression Tests
 *
 * Priority: P1 - High
 * Category: API Validation
 *
 * Validates:
 * - Input validation (400 errors)
 * - Response format
 * - Error handling
 */

import { test, expect } from '@playwright/test'
import { testData } from '../../fixtures/test-fixtures'

test.describe('Chat API Input Validation', () => {
  test('rejects empty messages array', async ({ request }) => {
    const response = await request.post('/api/chat', {
      data: testData.chat.invalidRequests.emptyArray
    })

    expect(response.status()).toBe(400)
    const body = await response.json()
    expect(body.error).toBe('Invalid messages format')
  })

  test('rejects message without content', async ({ request }) => {
    const response = await request.post('/api/chat', {
      data: testData.chat.invalidRequests.missingContent
    })

    expect(response.status()).toBe(400)
    const body = await response.json()
    expect(body.error).toBe('Invalid message structure')
  })

  test('rejects message without role', async ({ request }) => {
    const response = await request.post('/api/chat', {
      data: testData.chat.invalidRequests.missingRole
    })

    expect(response.status()).toBe(400)
    const body = await response.json()
    expect(body.error).toBe('Invalid message structure')
  })

  test('rejects more than 50 messages', async ({ request }) => {
    const response = await request.post('/api/chat', {
      data: testData.chat.invalidRequests.tooManyMessages
    })

    expect(response.status()).toBe(400)
    const body = await response.json()
    expect(body.error).toBe('Invalid messages format')
  })

  test('rejects message longer than 2000 chars', async ({ request }) => {
    const response = await request.post('/api/chat', {
      data: testData.chat.invalidRequests.messageTooLong
    })

    expect(response.status()).toBe(400)
    const body = await response.json()
    expect(body.error).toBe('Message too long')
  })
})

test.describe('Chat API Response Format', () => {
  test('returns assistant role in response', async ({ request }) => {
    const response = await request.post('/api/chat', {
      data: testData.chat.validRequest
    })

    expect(response.status()).toBe(200)
    const body = await response.json()
    expect(body.role).toBe('assistant')
  })

  test('returns content as string', async ({ request }) => {
    const response = await request.post('/api/chat', {
      data: testData.chat.validRequest
    })

    const body = await response.json()
    expect(typeof body.content).toBe('string')
    expect(body.content.length).toBeGreaterThan(0)
  })

  test('handles multi-turn conversation', async ({ request }) => {
    const response = await request.post('/api/chat', {
      data: {
        messages: [
          { role: 'user', content: 'Hello' },
          { role: 'assistant', content: 'Hi there!' },
          { role: 'user', content: 'Tell me about React projects' }
        ]
      }
    })

    expect(response.status()).toBe(200)
    const body = await response.json()
    expect(body.role).toBe('assistant')
  })
})

test.describe('Chat API Edge Cases', () => {
  test('handles unicode characters in message', async ({ request }) => {
    const response = await request.post('/api/chat', {
      data: {
        messages: [
          { role: 'user', content: 'Hello 你好 🚀 مرحبا' }
        ]
      }
    })

    expect(response.status()).toBe(200)
  })

  test('handles special characters in message', async ({ request }) => {
    const response = await request.post('/api/chat', {
      data: {
        messages: [
          { role: 'user', content: '<script>alert("test")</script>' }
        ]
      }
    })

    // Should not cause server error
    expect(response.status()).toBe(200)
  })

  test('rejects non-string content', async ({ request }) => {
    const response = await request.post('/api/chat', {
      data: {
        messages: [
          { role: 'user', content: 12345 }
        ]
      }
    })

    expect(response.status()).toBe(400)
  })
})
