import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#000',
          backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.15), transparent 50%), radial-gradient(circle at 75% 75%, rgba(168, 85, 247, 0.15), transparent 50%)',
        }}
      >
        {/* Title */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 'bold',
            color: '#fff',
            marginBottom: 20,
            textAlign: 'center',
          }}
        >
          Elizabeth Stein
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 36,
            color: '#94a3b8',
            marginBottom: 40,
            textAlign: 'center',
          }}
        >
          Full-Stack Engineer & AI Builder
        </div>

        {/* Tags */}
        <div
          style={{
            display: 'flex',
            gap: 12,
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginBottom: 40,
          }}
        >
          {['React', 'TypeScript', 'AI', 'Next.js'].map((tag) => (
            <div
              key={tag}
              style={{
                padding: '8px 20px',
                background: 'rgba(139, 92, 246, 0.2)',
                border: '2px solid #8B5CF6',
                borderRadius: 999,
                color: '#8B5CF6',
                fontSize: 24,
              }}
            >
              {tag}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            color: '#64748b',
            fontSize: 24,
          }}
        >
          <span>elizabethannstein.com</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
