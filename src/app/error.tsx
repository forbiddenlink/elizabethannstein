'use client'
// error boundary segment
import Link from 'next/link'

export default function AppError({ error: _error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black p-6 text-white">
      <div className="max-w-md text-center">
        <h2 className="mb-4 text-3xl font-bold tracking-tight">Something went wrong</h2>
        <p className="mb-8 text-white/60">
          An unexpected error occurred. You can try again or head back to the homepage.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button
            type="button"
            onClick={reset}
            className="min-h-11 rounded-xl bg-white px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-white/90"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
