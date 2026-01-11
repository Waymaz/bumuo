import { useState } from 'react'
import { Globe, Lock, Loader2 } from 'lucide-react'

export const VisibilityToggle = ({ 
  isPublic, 
  onToggle, 
  size = 'default', // 'small', 'default', 'large'
  showLabel = true,
  disabled = false,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [hovered, setHovered] = useState(false)

  const handleToggle = async () => {
    if (disabled || isLoading) return
    
    setIsLoading(true)
    try {
      await onToggle(!isPublic)
    } finally {
      setIsLoading(false)
    }
  }

  const sizes = {
    small: {
      track: { width: '36px', height: '20px' },
      thumb: { size: '16px', translate: '16px' },
      icon: '10px',
      label: '12px',
      gap: '6px',
    },
    default: {
      track: { width: '48px', height: '26px' },
      thumb: { size: '22px', translate: '22px' },
      icon: '12px',
      label: '14px',
      gap: '10px',
    },
    large: {
      track: { width: '56px', height: '30px' },
      thumb: { size: '26px', translate: '26px' },
      icon: '14px',
      label: '15px',
      gap: '12px',
    },
  }

  const s = sizes[size]

  const trackStyle = {
    position: 'relative',
    width: s.track.width,
    height: s.track.height,
    borderRadius: '999px',
    background: isPublic 
      ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
      : 'var(--color-surface-600)',
    border: isPublic 
      ? '1px solid rgba(16, 185, 129, 0.3)'
      : '1px solid rgba(255, 255, 255, 0.1)',
    cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    opacity: disabled ? 0.5 : 1,
    boxShadow: isPublic 
      ? '0 4px 12px rgba(16, 185, 129, 0.25)'
      : 'inset 0 2px 4px rgba(0, 0, 0, 0.2)',
  }

  const thumbStyle = {
    position: 'absolute',
    top: '50%',
    left: isPublic ? `calc(100% - ${s.thumb.size} - 2px)` : '2px',
    transform: 'translateY(-50%)',
    width: s.thumb.size,
    height: s.thumb.size,
    borderRadius: '50%',
    background: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
  }

  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: s.gap,
  }

  const labelStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: s.label,
    fontWeight: 500,
    color: isPublic ? '#10b981' : 'var(--color-surface-400)',
    transition: 'color 0.2s ease',
  }

  return (
    <div 
      style={containerStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        onClick={handleToggle}
        disabled={disabled || isLoading}
        style={{
          ...trackStyle,
          transform: hovered && !disabled && !isLoading ? 'scale(1.02)' : 'scale(1)',
        }}
        aria-label={isPublic ? 'Make private' : 'Make public'}
        title={isPublic ? 'Click to make private' : 'Click to make public'}
      >
        <div style={thumbStyle}>
          {isLoading ? (
            <Loader2 
              style={{ 
                width: s.icon, 
                height: s.icon, 
                color: 'var(--color-surface-500)',
                animation: 'spin 1s linear infinite',
              }} 
            />
          ) : isPublic ? (
            <Globe 
              style={{ 
                width: s.icon, 
                height: s.icon, 
                color: '#10b981',
              }} 
            />
          ) : (
            <Lock 
              style={{ 
                width: s.icon, 
                height: s.icon, 
                color: 'var(--color-surface-500)',
              }} 
            />
          )}
        </div>
      </button>
      
      {showLabel && (
        <span style={labelStyle}>
          {isPublic ? (
            <>
              <Globe style={{ width: '14px', height: '14px' }} />
              Public
            </>
          ) : (
            <>
              <Lock style={{ width: '14px', height: '14px' }} />
              Private
            </>
          )}
        </span>
      )}
    </div>
  )
}

// Simple badge version for displaying visibility status
export const VisibilityBadge = ({ isPublic, size = 'default' }) => {
  const sizes = {
    small: { padding: '3px 8px', fontSize: '11px', icon: '10px', gap: '4px' },
    default: { padding: '4px 10px', fontSize: '12px', icon: '12px', gap: '5px' },
    large: { padding: '6px 12px', fontSize: '13px', icon: '14px', gap: '6px' },
  }

  const s = sizes[size]

  const badgeStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: s.gap,
    padding: s.padding,
    borderRadius: '6px',
    fontSize: s.fontSize,
    fontWeight: 500,
    background: isPublic 
      ? 'rgba(16, 185, 129, 0.15)' 
      : 'rgba(100, 116, 139, 0.15)',
    color: isPublic ? '#10b981' : '#64748b',
    border: isPublic 
      ? '1px solid rgba(16, 185, 129, 0.2)' 
      : '1px solid rgba(100, 116, 139, 0.2)',
  }

  return (
    <span style={badgeStyle}>
      {isPublic ? (
        <>
          <Globe style={{ width: s.icon, height: s.icon }} />
          Public
        </>
      ) : (
        <>
          <Lock style={{ width: s.icon, height: s.icon }} />
          Private
        </>
      )}
    </span>
  )
}

// Confirmation dialog for making project public
export const PublicConfirmDialog = ({ onConfirm, onCancel, isLoading }) => {
  return (
    <div style={overlayStyle}>
      <div style={dialogStyle}>
        <div style={iconWrapperStyle}>
          <Globe style={{ width: '28px', height: '28px', color: '#ffffff' }} />
        </div>
        
        <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>
          Make project public?
        </h3>
        
        <p style={{ color: 'var(--color-surface-400)', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
          Your project will be visible to everyone in the community. 
          Others can view your code and fork your project.
        </p>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={onCancel}
            disabled={isLoading}
            style={cancelBtnStyle}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            style={confirmBtnStyle}
          >
            {isLoading ? (
              <>
                <Loader2 style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />
                Publishing...
              </>
            ) : (
              <>
                <Globe style={{ width: '16px', height: '16px' }} />
                Make Public
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

// Styles for dialog
const overlayStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0, 0, 0, 0.7)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '16px',
  zIndex: 100,
  animation: 'fade-in 0.2s ease',
}

const dialogStyle = {
  background: 'rgba(22, 22, 34, 0.98)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '20px',
  padding: '32px',
  maxWidth: '400px',
  width: '100%',
  textAlign: 'center',
  boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
  animation: 'scale-in 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
}

const iconWrapperStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '56px',
  height: '56px',
  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  borderRadius: '16px',
  marginBottom: '20px',
  boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)',
}

const cancelBtnStyle = {
  flex: 1,
  padding: '14px 20px',
  background: 'var(--color-surface-700)',
  border: '1px solid rgba(255, 255, 255, 0.06)',
  borderRadius: '12px',
  color: 'var(--color-surface-300)',
  fontWeight: 500,
  fontSize: '15px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
}

const confirmBtnStyle = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  padding: '14px 20px',
  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  border: 'none',
  borderRadius: '12px',
  color: '#ffffff',
  fontWeight: 600,
  fontSize: '15px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  boxShadow: '0 4px 14px rgba(16, 185, 129, 0.25)',
}
