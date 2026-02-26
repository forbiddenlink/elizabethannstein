import { galaxies } from '@/lib/galaxyData'
import type { Metadata } from 'next'
import Link from 'next/link'
import { StarryBackground } from '@/components/ui/StarryBackground'
import { WorkPageClient } from '@/components/work/WorkPageClient'

export const metadata: Metadata = {
  title: 'Projects & Work - Elizabeth Stein Portfolio',
  description: 'Full-stack development, AI integration, and design systems work across 40+ projects with 1,200+ automated tests.',
  alternates: {
    canonical: '/work',
  },
  openGraph: {
    title: 'Projects & Work - Elizabeth Stein Portfolio',
    description: 'Full-stack development, AI integration, and design systems work across 40+ projects with 1,200+ automated tests.',
    url: '/work',
    images: [{ url: '/api/og/default', width: 1200, height: 630 }],
  },
}

export default function WorkPage() {
  return (
    <>
      <main className="min-h-screen overflow-auto px-6 py-28 relative flex justify-center">
        {/* Skip Link for Accessibility */}
        <a href="#work-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded-lg focus:font-medium">
          Skip to projects
        </a>
        <StarryBackground />
        <WorkPageClient galaxies={galaxies} />
      </main>
      <footer className="border-t border-white/10 py-6 relative z-10 bg-black/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-center gap-4 text-white/50 text-sm">
          <p>&copy; {new Date().getFullYear()} Elizabeth Stein</p>
          <span>•</span>
          <Link href="/privacy" className="hover:text-white transition-colors">
            Privacy Policy
          </Link>
        </div>
      </footer>
    </>
  )
}
