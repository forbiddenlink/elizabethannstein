import { renderOgCard } from '@/lib/ogCard'

export async function GET() {
  const image = await renderOgCard({
    eyebrow: 'Full-stack engineer and designer',
    title: 'Elizabeth Stein',
    subtitle: 'Production systems, contest wins, and the tools I build along the way.',
  })
  // Drain the stream here so a render failure becomes a 500 instead of an empty 200.
  return new Response(await image.arrayBuffer(), { headers: image.headers })
}
