import { describe, expect, it } from 'vitest'
import {
  CHAT_MAX_CONTENT_LENGTH,
  CHAT_MAX_MESSAGES,
  toChatRequestMessages,
} from '@/lib/chatHistory'

const turn = (i: number) => ({ role: i % 2 ? 'assistant' : 'user', content: `m${i}` }) as const

describe('toChatRequestMessages', () => {
  it('keeps only the most recent turns the chat route accepts', () => {
    const history = Array.from({ length: 80 }, (_, i) => turn(i))
    const sent = toChatRequestMessages(history)
    expect(sent).toHaveLength(CHAT_MAX_MESSAGES)
    expect(sent.at(-1)).toEqual(history.at(-1))
  })

  it('clips a turn longer than the route allows', () => {
    const long = { role: 'assistant' as const, content: 'x'.repeat(CHAT_MAX_CONTENT_LENGTH + 500) }
    expect(toChatRequestMessages([long])[0].content).toHaveLength(CHAT_MAX_CONTENT_LENGTH)
  })

  it('drops client-only fields such as the message id', () => {
    const sent = toChatRequestMessages([{ role: 'user', content: 'hi', id: 'msg-1' } as never])
    expect(sent).toEqual([{ role: 'user', content: 'hi' }])
  })
})
