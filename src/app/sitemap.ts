import type { MetadataRoute } from 'next'
import { allProjects } from '@/lib/galaxyData'

// `lastModified` is deliberately omitted. It used to be `new Date()` on every
// entry, so all 93 URLs claimed they changed on the day of the last deploy.
// Google discards a lastmod it cannot corroborate, and a sitemap where every
// URL is always "today" trains it to discard the signal wholesale. No lastmod
// is a better signal than a false one.
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://elizabethannstein.com'

  // Static routes. `/city` is intentionally absent: it is an in-progress
  // visualization linked from nowhere, and it carries `noindex` to match.
  const routes: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: 'monthly', priority: 1 },
    { url: `${baseUrl}/work`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/about`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/explore`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/contact`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/privacy`, changeFrequency: 'yearly', priority: 0.3 },
  ]

  const projectRoutes: MetadataRoute.Sitemap = allProjects.map((project) => ({
    url: `${baseUrl}/work/${project.id}`,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  return [...routes, ...projectRoutes]
}
