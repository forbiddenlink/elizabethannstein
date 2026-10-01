import { OG_SIZE, renderOgCard } from '@/lib/ogCard'

export const alt = 'Elizabeth Stein, full-stack engineer and designer'
export const size = OG_SIZE
export const contentType = 'image/png'

export default function Image() {
  return renderOgCard({
    eyebrow: 'Full-stack engineer and designer',
    title: "I build software people use, and I can show you it's running.",
    facts: ['Dynamics 365 in production', 'Algolia challenge winner', 'npm publisher'],
  })
}
