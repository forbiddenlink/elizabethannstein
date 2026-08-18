export default function Loading() {
  return (
    <div
      className="editorial"
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
      }}
    >
      <div style={{ width: '12rem', maxWidth: '80%' }}>
        <div
          style={{
            height: '2px',
            overflow: 'hidden',
            background: 'var(--le-rule)',
          }}
        >
          <div
            style={{
              height: '100%',
              width: '33%',
              background: 'var(--le-accent)',
              animation: 'shimmer-slide 1.5s ease-in-out infinite',
            }}
          />
        </div>
      </div>
    </div>
  )
}
