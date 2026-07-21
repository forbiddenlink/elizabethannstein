// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { GET } from '@/app/api/og/[slug]/route'
import { allProjects } from '@/lib/galaxyData'

// Satori throws on any div with more than one child and no explicit `display`,
// and ImageResponse streams, so a render failure used to surface as 200 with an
// empty body rather than an error. Status codes cannot detect that; only the
// bytes can. Assert on the actual PNG.
const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47])

async function renderOg(slug: string) {
  const res = await GET(new Request(`https://elizabethannstein.com/api/og/${slug}`), {
    params: Promise.resolve({ slug }),
  })
  const body = Buffer.from(await res.arrayBuffer())
  return { status: res.status, body }
}

describe('api/og/[slug]', () => {
  it('returns 404 for an unknown slug', async () => {
    const { status } = await renderOg('definitely-not-a-project')
    expect(status).toBe(404)
  })

  it.each(allProjects.map((p) => p.id))('renders a real PNG for %s', async (slug) => {
    const { status, body } = await renderOg(slug)

    expect(status).toBe(200)
    // The regression this guards: a 200 carrying zero bytes.
    expect(body.length).toBeGreaterThan(1024)
    expect(body.subarray(0, 4)).toEqual(PNG_MAGIC)
  })
})
