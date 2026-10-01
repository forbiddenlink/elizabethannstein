import { HomeCard, OG_SIZE, renderCard } from '@/lib/og/ogKit'

export const alt = 'Elizabeth Stein: Full-Stack Engineer (Power Platform · Next.js · AI)'
export const size = OG_SIZE
export const contentType = 'image/png'

export default async function Image() {
  return renderCard(<HomeCard host="elizabethannstein.com" />)
}
