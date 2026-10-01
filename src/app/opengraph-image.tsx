import { OG_SIZE, renderOgCard } from '@/lib/ogCard'

export const alt = 'Elizabeth Stein, full-stack engineer and designer'
export const size = OG_SIZE
export const contentType = 'image/png'

export default function Image() {
  return renderOgCard({
    eyebrow: 'Full-stack engineer and designer',
    title: 'I design and build software that ships, from the data model to the last pixel.',
    facts: ['Dynamics 365 in production', 'Algolia challenge winner', 'npm publisher'],
  })
}
