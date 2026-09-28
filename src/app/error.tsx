'use client'
// error boundary segment
import * as Sentry from '@sentry/nextjs'
import Link from 'next/link'
import { useEffect } from 'react'
import { SiteFooter } from '@/components/ui/SiteFooter'
import { SiteHeader } from '@/components/ui/SiteHeader'

export default function AppError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <div className="editorial">
      <SiteHeader />
      <main id="main-content" className="eWrap">
        <header className="ePageHead">
          <p className="eLabel">Error</p>
          <h1>Something went wrong.</h1>
          <p>An unexpected error occurred. You can try again or head back to the homepage.</p>
        </header>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <button type="button" onClick={reset} className="eBtn eBtnPrimary">
            Try again
          </button>
          <Link href="/" className="eBtn eBtnGhost">
            Back to home
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
