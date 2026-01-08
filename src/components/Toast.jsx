import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react'
import { useEffect, useState } from 'react'

export const Toast = ({ type = 'success', message, onClose, duration = 3000 }) => {
  const [closeHover, setCloseHover] = useState(false)

  useEffect(() => {
    if (duration) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  const config = {
    success: {
      icon: CheckCircle,
      borderColor: 'rgba(52, 211, 153, 0.3)',
      iconColor: '#34d399',
      textColor: '#6ee7b7',
    },
    error: {
      icon: XCircle,
      borderColor: 'rgba(244, 63, 94, 0.3)',
      iconColor: '#fb7185',
      textColor: '#fda4af',
    },
    info: {
      icon: Info,
      borderColor: 'rgba(59, 130, 246, 0.3)',
      iconColor: 'var(--color-primary-400)',
      textColor: '#93c5fd',
    },
    warning: {
      icon: AlertTriangle,
      borderColor: 'rgba(251, 191, 36, 0.3)',
      iconColor: '#fbbf24',
      textColor: '#fcd34d',
    }
  }

  const { icon: Icon, borderColor, iconColor, textColor } = config[type]

  const containerStyle = {
    position: 'fixed',
    top: '24px',
    right: '24px',
    zIndex: 50,
    animation: 'fade-up 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
  }

  const toastStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '16px 20px',
    background: 'rgba(24, 24, 36, 0.95)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: `1px solid ${borderColor}`,
    borderRadius: '16px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
    minWidth: '320px',
  }

  const closeBtnStyle = {
    color: closeHover ? '#ffffff' : 'var(--color-surface-400)',
    background: closeHover ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
    border: 'none',
    padding: '6px',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }

  return (
    <div style={containerStyle}>
      <div style={toastStyle}>
        <Icon style={{ width: '20px', height: '20px', color: iconColor, flexShrink: 0 }} />
        <p style={{ flex: 1, fontSize: '14px', fontWeight: 500, color: textColor, margin: 0 }}>{message}</p>
        <button
          onClick={onClose}
          style={closeBtnStyle}
          onMouseEnter={() => setCloseHover(true)}
          onMouseLeave={() => setCloseHover(false)}
        >
          <X style={{ width: '16px', height: '16px' }} />
        </button>
      </div>
    </div>
  )
}
