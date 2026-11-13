/** Server limits for POST /api/chat; the Galaxy Guide client trims to fit them. */
export const CHAT_MAX_MESSAGES = 50
export const CHAT_MAX_CONTENT_LENGTH = 2000

interface ChatTurn {
  role: 'user' | 'assistant'
  content: string
}

/**
 * The turns the Guide sends: the most recent CHAT_MAX_MESSAGES, each clipped to
 * CHAT_MAX_CONTENT_LENGTH. Sending the whole history made every request fail with
 * 400 once a conversation outgrew the route's limits.
 */
export function toChatRequestMessages(history: readonly ChatTurn[]): ChatTurn[] {
  return history.slice(-CHAT_MAX_MESSAGES).map(({ role, content }) => ({
    role,
    content: content.slice(0, CHAT_MAX_CONTENT_LENGTH),
  }))
}
