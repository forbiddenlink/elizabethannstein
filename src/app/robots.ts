import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://elizabethannstein.com'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/chat', '/api/contact', '/api/health'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
