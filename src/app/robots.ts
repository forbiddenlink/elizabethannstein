import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://elizabethannstein.com'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/chat', '/api/contact', '/health'],
      },
      {
        // Explicitly welcome core AI crawlers so the site is discoverable to
        // LLM search + training surfaces (AX readiness).
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'OAI-SearchBot',
          'ClaudeBot',
          'Claude-SearchBot',
          'anthropic-ai',
          'PerplexityBot',
          'Google-Extended',
          'CCBot',
        ],
        allow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
