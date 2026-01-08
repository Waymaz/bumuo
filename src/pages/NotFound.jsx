import { Home, ArrowLeft, Code2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export const NotFound = () => {
  const navigate = useNavigate()

  const buttonPrimaryStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '14px 24px',
    background: 'linear-gradient(135deg, var(--color-primary-600) 0%, var(--color-primary-500) 100%)',
    color: '#ffffff',
    borderRadius: '12px',
    fontWeight: 600,
    fontSize: '15px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 14px rgba(59, 130, 246, 0.25)',
  }

  const buttonSecondaryStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '14px 24px',
    background: 'var(--color-surface-850)',
    color: '#ffffff',
    borderRadius: '12px',
    fontWeight: 600,
    fontSize: '15px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  }

  return (
    <div 
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-surface-950)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background decoration */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div 
          style={{
            position: 'absolute',
            top: '-160px',
            right: '-160px',
            width: '500px',
            height: '500px',
            background: 'rgba(59, 130, 246, 0.08)',
            borderRadius: '50%',
            filter: 'blur(80px)',
          }}
        />
        <div 
          style={{
            position: 'absolute',
            bottom: '-160px',
            left: '-160px',
            width: '500px',
            height: '500px',
            background: 'rgba(139, 92, 246, 0.08)',
            borderRadius: '50%',
            filter: 'blur(80px)',
          }}
        />
      </div>
      
      <div 
        style={{
          textAlign: 'center',
          maxWidth: '480px',
          position: 'relative',
          zIndex: 10,
          animation: 'fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* 404 */}
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: '32px' }}>
          <h1 
            style={{
              fontSize: 'clamp(100px, 20vw, 140px)',
              fontWeight: 700,
              color: 'rgba(30, 30, 46, 0.6)',
              lineHeight: 1,
              margin: 0,
            }}
          >
            404
          </h1>
          <div 
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div 
              style={{
                padding: '18px',
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)',
                borderRadius: '20px',
                border: '1px solid rgba(59, 130, 246, 0.2)',
              }}
            >
              <Code2 style={{ width: '40px', height: '40px', color: 'var(--color-primary-400)' }} />
            </div>
          </div>
        </div>
        
        {/* Message */}
        <h2 
          style={{
            fontSize: '28px',
            fontWeight: 700,
            color: '#ffffff',
            marginBottom: '12px',
            letterSpacing: '-0.025em',
          }}
        >
          Page Not Found
        </h2>
        <p 
          style={{
            color: 'var(--color-surface-400)',
            fontSize: '16px',
            marginBottom: '36px',
            maxWidth: '380px',
            marginLeft: 'auto',
            marginRight: 'auto',
            lineHeight: 1.6,
          }}
        >
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        
        {/* Actions */}
        <div 
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            alignItems: 'center',
          }}
        >
          <button
            onClick={() => navigate('/dashboard')}
            style={buttonPrimaryStyle}
            onMouseEnter={(e) => {
              e.target.style.background = 'linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-primary-400) 100%)'
              e.target.style.transform = 'translateY(-2px)'
              e.target.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.35)'
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'linear-gradient(135deg, var(--color-primary-600) 0%, var(--color-primary-500) 100%)'
              e.target.style.transform = 'translateY(0)'
              e.target.style.boxShadow = '0 4px 14px rgba(59, 130, 246, 0.25)'
            }}
          >
            <Home style={{ width: '18px', height: '18px' }} />
            Go to Dashboard
          </button>
          
          <button
            onClick={() => navigate(-1)}
            style={buttonSecondaryStyle}
            onMouseEnter={(e) => {
              e.target.style.background = 'var(--color-surface-800)'
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)'
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'var(--color-surface-850)'
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)'
            }}
          >
            <ArrowLeft style={{ width: '18px', height: '18px' }} />
            Go Back
          </button>
        </div>
      </div>
    </div>
  )
}
