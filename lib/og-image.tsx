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
          justifyContent: 'space-between',
          background: theme.bg,
          fontSize: 32,
          fontWeight: 600,
          color: 'white',
          padding: '60px',
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
        
        {/* Top Section with Logo */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100px',
              height: '100px',
              borderRadius: '50px',
              background: 'rgba(255,255,255,0.2)',
              border: '3px solid rgba(255,255,255,0.3)',
              marginBottom: '30px',
              fontSize: '40px',
              fontWeight: 'bold',
            }}
          >
            E.C
          </div>
        </div>

        {/* Main Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            width: '100%',
            textAlign: 'center',
          }}
        >
          {/* Title */}
          <div
            style={{
              fontSize: subtitle ? '52px' : '60px',
              fontWeight: 'bold',
              textAlign: 'center',
              lineHeight: 1.1,
              marginBottom: subtitle ? '24px' : '0px',
              maxWidth: '900px',
              wordWrap: 'break-word',
            }}
          >
            {title}
          </div>

          {/* Subtitle */}
          {subtitle && (
            <div
              style={{
                fontSize: '32px',
                fontWeight: 400,
                textAlign: 'center',
                opacity: 0.9,
                maxWidth: '800px',
                lineHeight: 1.3,
                wordWrap: 'break-word',
              }}
            >
              {subtitle}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            fontWeight: 500,
            opacity: 0.8,
            width: '100%',
          }}
        >
          <span style={{ marginRight: '8px' }}>by</span>
          <span style={{ fontWeight: 'bold' }}>Esubalew Chekol</span>
          <span style={{ margin: '0 12px', opacity: 0.6 }}>•</span>
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
