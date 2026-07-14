'use client'

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html lang="en">
      <body className="m-0 bg-black font-sans text-white antialiased">
        <div className="flex min-h-screen flex-col items-center justify-center px-6">
          <h2 className="mb-3 text-center text-2xl font-semibold tracking-tight">
            Something went wrong
          </h2>
          <p className="mb-8 max-w-md text-center text-sm text-white/60">
            An unexpected error occurred. Try again, or return to the homepage.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={reset}
              className="min-h-11 rounded-xl bg-white px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-white/90"
            >
              Try again
            </button>
            <a
              href="/"
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              Back to home
            </a>
          </div>
        </div>
      </body>
    </html>
  )
}
