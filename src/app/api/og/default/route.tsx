import { HomeCard, renderCard } from '@/lib/og/ogKit'

export async function GET() {
  return renderCard(<HomeCard host="elizabethannstein.com" />)
}
