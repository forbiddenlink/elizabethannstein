import * as Sentry from '@sentry/nextjs'
import { galaxies } from '@/lib/galaxyData'
import { Chip, Display, Frame, renderCard, Sub } from '@/lib/og/ogKit'

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

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  // Find project
  const project = galaxies.flatMap((g) => g.projects).find((p) => p.id === slug)

  if (!project) {
    return new Response('Project not found', { status: 404 })
  }

  // Find galaxy
  const galaxy = galaxies.find((g) => g.projects.some((p) => p.id === slug))

  const image = await renderCard(
    <Frame
      label="Elizabeth Stein"
      dateline={project.dateRange}
      footerLeft={galaxy ? galaxy.name : 'Portfolio'}
      footerRight="elizabethannstein.com"
    >
      <Display size={project.title.length > 28 ? 72 : 92}>{project.title}</Display>
      <Sub>
        {project.role}
        {project.company ? ` · ${project.company}` : ''}
      </Sub>
      <div style={{ display: 'flex', marginTop: 32 }}>
        {project.tags.slice(0, 4).map((tag: string, i: number) => (
          <Chip key={tag} accent={i === 0}>
            {tag}
          </Chip>
        ))}
      </div>
    </Frame>
  )

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
