import { useState, useEffect, useCallback } from 'react'
import { User, Check, X, Loader2, Sparkles, AtSign } from 'lucide-react'
import { profileService } from '../services/profileService'
import { useAuth } from '../context/AuthContext'

export const UsernameSetup = ({ onComplete }) => {
  const { user } = useAuth()
  const userId = user?.id
  const userEmail = user?.email
  const [username, setUsername] = useState('')
  const [isChecking, setIsChecking] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [availabilityStatus, setAvailabilityStatus] = useState(null) // null, 'available', 'taken', 'invalid'
  const [validationError, setValidationError] = useState(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [inputFocused, setInputFocused] = useState(false)

  // Debounced username availability check
  useEffect(() => {
    const checkAvailability = async () => {
      if (!username.trim()) {
        setAvailabilityStatus(null)
        setValidationError(null)
        return
      }

      // First validate format
      const validation = profileService.validateUsername(username)
      if (!validation.valid) {
        setAvailabilityStatus('invalid')
        setValidationError(validation.error)
        return
      }

      setValidationError(null)
      setIsChecking(true)
      setAvailabilityStatus(null)

      try {
        const { available } = await profileService.checkUsernameAvailable(username)
        setAvailabilityStatus(available ? 'available' : 'taken')
      } catch (error) {
        setAvailabilityStatus('invalid')
        setValidationError('Unable to check availability')
      } finally {
        setIsChecking(false)
      }
    }

    const debounceTimer = setTimeout(checkAvailability, 400)
    return () => clearTimeout(debounceTimer)
  }, [username])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate we have a user
    if (!userId) {
      setValidationError('Not authenticated. Please refresh and try again.')
      return
    }
    
    if (availabilityStatus !== 'available' || isSubmitting) return

    setIsSubmitting(true)
    setValidationError(null)

    try {
      const avatarUrl = profileService.generateAvatarUrl(username)
      console.log('Creating profile for user:', userId, 'with username:', username, 'email:', userEmail)
      
      const { data, error } = await profileService.createProfile(userId, username, avatarUrl, userEmail)

      if (error) {
        console.error('Profile creation error:', error)
        setValidationError(error.message || 'Failed to create profile. Please try again.')
        setIsSubmitting(false)
        return
      }

      console.log('Profile created successfully:', data)
      
      // Show success animation
      setShowSuccess(true)
      
      // Wait for animation then complete
      setTimeout(() => {
        onComplete(data)
      }, 1500)
    } catch (error) {
      console.error('Unexpected error:', error)
      setValidationError('An unexpected error occurred. Please try again.')
      setIsSubmitting(false)
    }
  }

  const getStatusIcon = () => {
    if (isChecking) {
      return <Loader2 className="status-icon checking" style={{ width: '20px', height: '20px', color: 'var(--color-primary-400)', animation: 'spin 1s linear infinite' }} />
    }
    if (availabilityStatus === 'available') {
      return <Check className="status-icon available" style={{ width: '20px', height: '20px', color: '#10b981' }} />
    }
    if (availabilityStatus === 'taken' || availabilityStatus === 'invalid') {
      return <X className="status-icon taken" style={{ width: '20px', height: '20px', color: '#f43f5e' }} />
    }
    return null
  }

  const getStatusText = () => {
    if (isChecking) return 'Checking availability...'
    if (availabilityStatus === 'available') return 'Username is available!'
    if (availabilityStatus === 'taken') return 'Username is already taken'
    if (availabilityStatus === 'invalid') return validationError
    return null
  }

  const getStatusColor = () => {
    if (isChecking) return 'var(--color-primary-400)'
    if (availabilityStatus === 'available') return '#10b981'
    if (availabilityStatus === 'taken' || availabilityStatus === 'invalid') return '#f43f5e'
    return 'var(--color-surface-400)'
  }

  const getInputBorderColor = () => {
    if (inputFocused) {
      if (availabilityStatus === 'available') return 'rgba(16, 185, 129, 0.5)'
      if (availabilityStatus === 'taken' || availabilityStatus === 'invalid') return 'rgba(244, 63, 94, 0.5)'
      return 'rgba(59, 130, 246, 0.5)'
    }
    return 'rgba(255, 255, 255, 0.1)'
  }

  const getInputBoxShadow = () => {
    if (inputFocused) {
      if (availabilityStatus === 'available') return '0 0 0 4px rgba(16, 185, 129, 0.15)'
      if (availabilityStatus === 'taken' || availabilityStatus === 'invalid') return '0 0 0 4px rgba(244, 63, 94, 0.15)'
      return '0 0 0 4px rgba(59, 130, 246, 0.15)'
    }
    return 'none'
  }

  if (showSuccess) {
    return (
      <div style={overlayStyle}>
        <div style={{ ...modalStyle, animation: 'scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}>
          <div style={successContainerStyle}>
            <div style={successIconContainerStyle}>
              <div style={successCheckCircleStyle}>
                <Check style={{ width: '40px', height: '40px', color: '#ffffff' }} />
              </div>
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>
              Welcome, @{username}!
            </h2>
            <p style={{ color: 'var(--color-surface-400)', fontSize: '15px' }}>
              Your profile is ready. Let's start building!
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={overlayStyle}>
      <div style={{ ...modalStyle, animation: 'scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}>
        {/* Header */}
        <div style={headerStyle}>
          <div style={iconContainerStyle}>
            <User style={{ width: '28px', height: '28px', color: '#ffffff' }} />
          </div>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>
              Choose your username
            </h2>
            <p style={{ color: 'var(--color-surface-400)', fontSize: '14px', margin: 0 }}>
              This is how others will find and recognize you
            </p>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.06)', margin: '0 -32px' }} />

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ marginTop: '28px' }}>
          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>
              Username
            </label>
            <div style={{ position: 'relative' }}>
              <div style={inputPrefixStyle}>
                <AtSign style={{ width: '18px', height: '18px', color: 'var(--color-surface-500)' }} />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                placeholder="yourname"
                autoFocus
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                maxLength={20}
                style={{
                  ...inputStyle,
                  borderColor: getInputBorderColor(),
                  boxShadow: getInputBoxShadow(),
                }}
              />
              <div style={statusIconContainerStyle}>
                {getStatusIcon()}
              </div>
            </div>
            
            {/* Status Message */}
            <div style={{ 
              minHeight: '24px', 
              marginTop: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              {getStatusText() && (
                <span style={{ 
                  fontSize: '13px', 
                  color: getStatusColor(),
                  fontWeight: 500,
                  animation: 'fade-in 0.2s ease',
                }}>
                  {getStatusText()}
                </span>
              )}
            </div>

            {/* Character Counter */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginTop: '4px',
            }}>
              <span style={{ fontSize: '12px', color: 'var(--color-surface-500)' }}>
                3-20 characters • Letters, numbers, underscores only
              </span>
              <span style={{ 
                fontSize: '12px', 
                color: username.length > 17 ? '#f59e0b' : 'var(--color-surface-500)',
                fontWeight: username.length > 17 ? 600 : 400,
              }}>
                {username.length}/20
              </span>
            </div>
          </div>

          {/* Preview Card */}
          {username.length >= 3 && availabilityStatus === 'available' && (
            <div style={previewCardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img 
                  src={profileService.generateAvatarUrl(username)}
                  alt="Avatar preview"
                  style={avatarPreviewStyle}
                />
                <div>
                  <div style={{ fontWeight: 600, color: '#ffffff', fontSize: '15px' }}>
                    @{username}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--color-surface-400)' }}>
                    Your profile preview
                  </div>
                </div>
              </div>
              <Sparkles style={{ width: '20px', height: '20px', color: 'var(--color-primary-400)' }} />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={availabilityStatus !== 'available' || isSubmitting}
            style={{
              ...submitButtonStyle,
              opacity: availabilityStatus === 'available' && !isSubmitting ? 1 : 0.5,
              cursor: availabilityStatus === 'available' && !isSubmitting ? 'pointer' : 'not-allowed',
            }}
          >
            {isSubmitting ? (
              <>
                <Loader2 style={{ width: '20px', height: '20px', animation: 'spin 1s linear infinite' }} />
                Creating profile...
              </>
            ) : (
              <>
                <Sparkles style={{ width: '20px', height: '20px' }} />
                Claim username
              </>
            )}
          </button>
        </form>

        {/* Footer Note */}
        <p style={footerNoteStyle}>
          You can change your username later in settings
        </p>
      </div>
    </div>
  )
}

// Styles
const overlayStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0, 0, 0, 0.8)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '16px',
  zIndex: 100,
  animation: 'fade-in 0.3s ease',
}

const modalStyle = {
  background: 'linear-gradient(180deg, rgba(22, 22, 34, 0.98) 0%, rgba(15, 15, 23, 0.98) 100%)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '24px',
  padding: '32px',
  maxWidth: '440px',
  width: '100%',
  boxShadow: '0 25px 80px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05) inset',
}

const headerStyle = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '16px',
  marginBottom: '24px',
}

const iconContainerStyle = {
  padding: '14px',
  background: 'linear-gradient(135deg, var(--color-primary-600) 0%, var(--color-primary-500) 100%)',
  borderRadius: '16px',
  boxShadow: '0 8px 24px rgba(59, 130, 246, 0.3)',
}

const labelStyle = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 600,
  color: 'var(--color-surface-300)',
  marginBottom: '10px',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
}

const inputPrefixStyle = {
  position: 'absolute',
  left: '16px',
  top: '50%',
  transform: 'translateY(-50%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  pointerEvents: 'none',
}

const inputStyle = {
  width: '100%',
  padding: '16px 48px',
  background: 'var(--color-surface-850)',
  border: '2px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '14px',
  color: '#ffffff',
  fontSize: '17px',
  fontWeight: 500,
  letterSpacing: '0.01em',
  outline: 'none',
  transition: 'all 0.2s ease',
}

const statusIconContainerStyle = {
  position: 'absolute',
  right: '16px',
  top: '50%',
  transform: 'translateY(-50%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const previewCardStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '16px',
  background: 'rgba(59, 130, 246, 0.1)',
  border: '1px solid rgba(59, 130, 246, 0.2)',
  borderRadius: '14px',
  marginBottom: '24px',
  animation: 'fade-up 0.3s ease',
}

const avatarPreviewStyle = {
  width: '44px',
  height: '44px',
  borderRadius: '12px',
  background: 'var(--color-primary-500)',
}

const submitButtonStyle = {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  padding: '16px 24px',
  background: 'linear-gradient(135deg, var(--color-primary-600) 0%, var(--color-primary-500) 100%)',
  color: '#ffffff',
  borderRadius: '14px',
  fontWeight: 600,
  fontSize: '16px',
  border: 'none',
  transition: 'all 0.3s ease',
  boxShadow: '0 8px 24px rgba(59, 130, 246, 0.3)',
}

const footerNoteStyle = {
  textAlign: 'center',
  fontSize: '13px',
  color: 'var(--color-surface-500)',
  marginTop: '20px',
  marginBottom: 0,
}

const successContainerStyle = {
  textAlign: 'center',
  padding: '20px 0',
}

const successIconContainerStyle = {
  marginBottom: '24px',
}

const successCheckCircleStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '80px',
  height: '80px',
  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  borderRadius: '50%',
  boxShadow: '0 12px 32px rgba(16, 185, 129, 0.4)',
  animation: 'scale-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
}
