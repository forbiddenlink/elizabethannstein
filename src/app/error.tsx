'use client'
// error boundary segment
import Link from 'next/link'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white p-6">
      <div className="text-center max-w-md">
        <h2 className="text-3xl font-bold mb-4">Something went wrong</h2>
        <p className="text-white/60 mb-8">
          An unexpected error occurred. You can try again or head back to the homepage.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
