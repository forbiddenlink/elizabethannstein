'use client'
export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <html>
      <body style={{ background: '#000', color: '#fff', margin: 0 }}>
        <div className="flex min-h-screen flex-col items-center justify-center" style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h2 className="text-2xl font-bold" style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Something went wrong</h2>
          <p style={{ color: '#94a3b8', marginBottom: '1.5rem', maxWidth: '400px', textAlign: 'center' }}>
            An unexpected error occurred. Please try again.
          </p>
          <button
            onClick={reset}
            className="mt-4 rounded bg-primary px-4 py-2 text-white"
            style={{ padding: '0.75rem 1.5rem', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '1rem' }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
