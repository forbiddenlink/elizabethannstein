import type { Metadata } from 'next'

// `/city` is an in-progress visualization, linked from nowhere on the site. It
// was still indexable, so a half-finished page could land in search results
// under this name. Keep it reachable by direct URL, keep it out of the index.
export const metadata: Metadata = {
  title: 'City',
  robots: { index: false, follow: false },
}

export default function CityLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children
}
