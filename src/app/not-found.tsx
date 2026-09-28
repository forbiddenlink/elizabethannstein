import type { Metadata } from 'next'
import Link from 'next/link'
import { SiteFooter } from '@/components/ui/SiteFooter'
import { SiteHeader } from '@/components/ui/SiteHeader'

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <div className="editorial">
      <SiteHeader />
      <main id="main-content" className="eWrap">
        <header className="ePageHead">
          <p className="eLabel">Error 404</p>
          <h1>This page does not exist.</h1>
          <p>
            The link may be old, or the page may have moved. The work, the about page, and the home
            page are all one click away.
          </p>
        </header>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <Link href="/work" className="eBtn eBtnPrimary">
            Browse the work
          </Link>
          <Link href="/" className="eBtn eBtnGhost">
            Home
          </Link>
          <Link href="/about" className="eBtn eBtnGhost">
            About
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
