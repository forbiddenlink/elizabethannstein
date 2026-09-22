import type { Metadata } from 'next'

// /explore has no page-level metadata (page.tsx is 'use client'), so without this
// layout it falls through to the root layout's `title.default` — the full 69-char
// SITE.fullTitle, which fails SEO's 50-60 char <title> guidance. This overrides just
// the title; it still passes through the root layout's `%s | Elizabeth Stein` template.
export const metadata: Metadata = {
  title: 'Explore the 3D Portfolio Galaxy',
  alternates: {
    canonical: '/explore',
  },
}

export default function ExploreLayout({ children }: { children: React.ReactNode }) {
  return children
}
