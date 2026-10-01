import * as Sentry from '@sentry/nextjs'
import { galaxies } from '@/lib/galaxyData'
import { renderOgCard } from '@/lib/ogCard'

// Pre-render every project's OG image at build time instead of on first request.
// RV scan 2026-09-22 timed out fetching /api/og/flo-labs; without generateStaticParams
// every slug's image was a cold Satori render on first hit (and the Cache-Control
// header set in next.config.mjs wasn't actually landing — x-vercel-cache: MISS on
// every request). Next 16 doesn't allow generateStaticParams together with
// `runtime = 'edge'` (build error), so this dropped edge — Next's own build output
// already flags the Edge Runtime as deprecated in favor of nodejs. Pre-rendering
// removes the render-on-request path entirely for known slugs.
export async function generateStaticParams() {
  return galaxies.flatMap((g) => g.projects).map((p) => ({ slug: p.id }))
}

/** First sentence of the description, cut to fit two lines on the card. */
function firstSentence(text: string): string {
  // Satori has no emoji font, so a leading trophy or rocket renders as a box.
  const clean = text.replace(/\p{Extended_Pictographic}\uFE0F?/gu, '').trim()
  const sentence = clean.split(/(?<=[.!?])\s/)[0] ?? clean
  return sentence.length > 140 ? `${sentence.slice(0, 137).trimEnd()}...` : sentence
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  // Find project
  const project = galaxies.flatMap((g) => g.projects).find((p) => p.id === slug)

  if (!project) {
    return new Response('Project not found', { status: 404 })
  }

  // Find galaxy
  const galaxy = galaxies.find((g) => g.projects.some((p) => p.id === slug))

  const year = project.dateRange?.split('-').pop()?.trim()
  const image = await renderOgCard({
    eyebrow: galaxy?.name,
    title: project.title,
    subtitle: firstSentence(project.description),
    facts: [...project.tags.slice(0, 3), ...(year ? [year] : [])],
  })

  // ImageResponse streams: Satori renders as the runtime drains the body, which is
  // after the 200 has shipped and after onRequestError can still observe a throw.
  // A render failure therefore surfaces as 200 with an empty body and reaches no
  // error handler. Draining it here keeps the render on this stack, so failures
  // become a real 500 and a Sentry event instead of a silent empty image.
  try {
    const png = await image.arrayBuffer()
    return new Response(png, { headers: image.headers })
  } catch (error) {
    Sentry.captureException(error, {
      tags: { route: 'api/og/[slug]', slug },
    })
    // Edge functions terminate on return, which kills the in-flight send, so the
    // event has to be flushed before responding or it never reaches Sentry.
    await Sentry.flush(2000)
    return new Response('Failed to render OG image', { status: 500 })
  }
}
