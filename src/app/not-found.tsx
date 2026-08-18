import Link from 'next/link'

export default function NotFound() {
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
        <p className="eEyebrow">Error 404</p>
        <h1 className="eTitle" style={{ fontSize: 'clamp(4rem, 16vw, 9rem)' }}>
          Signal lost<span style={{ color: 'var(--le-accent-ink)' }}>.</span>
        </h1>
        <p className="eLede" style={{ marginTop: '1.4rem' }}>
          This page doesn&apos;t exist or may have moved. Here are the ways back in.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.9rem', marginTop: '2.2rem' }}>
          <Link href="/" className="eBtn eBtnPrimary">
            <span className="arrow">&larr;</span> Home
          </Link>
          <Link href="/work" className="eBtn eBtnGhost">
            View all work
          </Link>
          <Link href="/about" className="eBtn eBtnGhost">
            About
          </Link>
        </div>
      </main>
    </div>
  )
}
