import type { Metadata } from 'next'
import { LiveSystemsIndex } from '@/components/home/LiveSystemsIndex'

// Prototype of the next home page fold, kept out of search and the sitemap until it ships.
export const metadata: Metadata = {
  title: 'Lab',
  robots: { index: false, follow: false },
}

export default function LabPage() {
  return <LiveSystemsIndex variant="lab" />
}
