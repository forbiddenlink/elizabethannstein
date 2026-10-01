import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Elizabeth Stein Portfolio',
    short_name: 'E. Stein',
    description:
      'Full-stack developer and designer. Sole developer on a Dynamics 365 platform live in production, Algolia Agent Studio winner, npm publisher.',
    start_url: '/',
    display: 'standalone',
    // editorial.css --le-paper / --le-ink (light theme)
    background_color: '#efeadf',
    theme_color: '#191510',
    icons: [
      { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      {
        src: '/icons/icon-512-maskable.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
