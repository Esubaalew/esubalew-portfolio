import { ImageResponse } from 'next/og'

export async function generateOGImage({
  title,
  subtitle,
  type = 'general'
}: {
  title: string
  subtitle?: string
  type?: 'general' | 'blog' | 'projects'
}) {
  const colors = {
    general: {
      bg: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)',
      accent: '#f8fafc'
    },
    blog: {
      bg: 'linear-gradient(135deg, #059669 0%, #0d9488 50%, #0f766e 100%)',
      accent: '#f0fdf4'
    },
    projects: {
      bg: 'linear-gradient(135deg, #ea580c 0%, #dc2626 50%, #c2410c 100%)',
      accent: '#fff7ed'
    }
  }

  const theme = colors[type]

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
          background: theme.bg,
          fontSize: 32,
          fontWeight: 600,
          color: 'white',
          padding: '80px',
          position: 'relative',
        }}
      >
        {/* Background Pattern */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `radial-gradient(circle at 25px 25px, rgba(255,255,255,0.1) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(255,255,255,0.1) 2%, transparent 0%)`,
            backgroundSize: '100px 100px',
          }}
        />
        
        {/* Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '120px',
            height: '120px',
            borderRadius: '60px',
            background: 'rgba(255,255,255,0.2)',
            border: '3px solid rgba(255,255,255,0.3)',
            marginBottom: '40px',
            fontSize: '48px',
            fontWeight: 'bold',
          }}
        >
          E.C
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: subtitle ? '64px' : '72px',
            fontWeight: 'bold',
            textAlign: 'center',
            lineHeight: 1.2,
            marginBottom: subtitle ? '20px' : '40px',
            maxWidth: '800px',
          }}
        >
          {title}
        </div>

        {/* Subtitle */}
        {subtitle && (
          <div
            style={{
              fontSize: '36px',
              fontWeight: 400,
              textAlign: 'center',
              opacity: 0.9,
              marginBottom: '40px',
              maxWidth: '700px',
            }}
          >
            {subtitle}
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: '28px',
            fontWeight: 500,
            opacity: 0.8,
          }}
        >
          <span style={{ marginRight: '12px' }}>by</span>
          <span style={{ fontWeight: 'bold' }}>Esubalew Chekol</span>
          <span style={{ margin: '0 16px', opacity: 0.6 }}>•</span>
          <span>esubalew.et</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
