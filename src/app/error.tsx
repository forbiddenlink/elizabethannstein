'use client'
// error boundary segment
import * as Sentry from '@sentry/nextjs'
import Link from 'next/link'
import { useEffect } from 'react'

export default function AppError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <div className="editorial">
      <main
        className="eWrap"
        style={{
          minHeight: '80dvh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <p className="eEyebrow">Error</p>
        <h1 className="eTitle" style={{ fontSize: 'clamp(2.6rem, 8vw, 5rem)' }}>
          Something went wrong<span style={{ color: 'var(--le-accent-ink)' }}>.</span>
        </h1>
        <p className="eLede" style={{ marginTop: '1.4rem' }}>
          An unexpected error occurred. You can try again or head back to the homepage.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.9rem', marginTop: '2.2rem' }}>
          <button type="button" onClick={reset} className="eBtn eBtnPrimary">
            Try again
          </button>
          <Link href="/" className="eBtn eBtnGhost">
            Back to home
          </Link>
        </div>
      </main>
    </div>
  )
}
