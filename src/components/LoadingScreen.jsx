import { Code2, Sparkles } from 'lucide-react'

export const LoadingScreen = ({ message = 'Loading...' }) => {
  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: 'var(--color-surface-950)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  }

  const bgGradient1 = {
    position: 'absolute',
    top: '25%',
    left: '25%',
    width: '384px',
    height: '384px',
    background: 'rgba(59, 130, 246, 0.1)',
    borderRadius: '50%',
    filter: 'blur(80px)',
    pointerEvents: 'none',
  }

  const bgGradient2 = {
    position: 'absolute',
    bottom: '25%',
    right: '25%',
    width: '384px',
    height: '384px',
    background: 'rgba(139, 92, 246, 0.1)',
    borderRadius: '50%',
    filter: 'blur(80px)',
    pointerEvents: 'none',
  }

  const contentStyle = {
    position: 'relative',
    zIndex: 10,
    textAlign: 'center',
    animation: 'fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
  }

  const logoContainerStyle = {
    position: 'relative',
    display: 'inline-block',
    marginBottom: '32px',
  }

  const logoBoxStyle = {
    padding: '20px',
    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
    borderRadius: '20px',
    border: '1px solid rgba(59, 130, 246, 0.2)',
  }

  const sparklesStyle = {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    width: '24px',
    height: '24px',
    color: '#a78bfa',
    animation: 'bounce-subtle 2s ease-in-out infinite',
  }

  const spinnerContainerStyle = {
    position: 'relative',
    display: 'inline-block',
    marginBottom: '24px',
  }

  const spinnerStyle = {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    border: '4px solid var(--color-surface-700)',
    borderTopColor: 'var(--color-primary-500)',
    animation: 'spin 1s linear infinite',
  }

  const messageStyle = {
    color: 'var(--color-surface-400)',
    fontSize: '16px',
    fontWeight: 500,
  }

  return (
    <div style={containerStyle}>
      {/* Background gradient decoration */}
      <div style={bgGradient1} />
      <div style={bgGradient2} />
      
      <div style={contentStyle}>
        {/* Logo */}
        <div style={logoContainerStyle}>
          <div style={logoBoxStyle}>
            <Code2 style={{ width: '48px', height: '48px', color: 'var(--color-primary-400)' }} />
          </div>
          <Sparkles style={sparklesStyle} />
        </div>
        
        {/* Spinner */}
        <div style={spinnerContainerStyle}>
          <div style={spinnerStyle} />
        </div>
        
        {/* Message */}
        <p style={messageStyle}>{message}</p>
      </div>
    </div>
  )
}
