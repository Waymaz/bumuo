import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Mail, Lock, ArrowRight, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react'
import bumuoLogo from '../assets/bumuo-logo.png'

// Google Icon Component
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
)

export const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const { signIn, signInWithGoogle, user, authError, clearError } = useAuth()
  const navigate = useNavigate()

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard')
    }
  }, [user, navigate])

  // Sync auth errors
  useEffect(() => {
    if (authError) {
      setError(authError)
    }
  }, [authError])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    clearError()
    setLoading(true)

    const { error: signInError } = await signIn(email, password)
    
    if (signInError) {
      // Map Supabase errors to user-friendly messages
      const errorMap = {
        'Invalid login credentials': 'Invalid email or password. Please try again.',
        'Email not confirmed': 'Please verify your email before signing in.',
        'Too many requests': 'Too many login attempts. Please wait a moment.',
      }
      setError(errorMap[signInError.message] || signInError.message)
      setLoading(false)
    } else {
      navigate('/dashboard')
    }
  }

  const handleGoogleSignIn = async () => {
    setError('')
    clearError()
    setGoogleLoading(true)
    
    const { error: googleError } = await signInWithGoogle()
    
    if (googleError) {
      setError(googleError.message || 'Failed to sign in with Google')
      setGoogleLoading(false)
    }
    // Note: On success, user will be redirected by OAuth flow
  }

  return (
    <div 
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-surface-950)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
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
        <div 
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '800px',
            height: '800px',
            background: 'rgba(59, 130, 246, 0.03)',
            borderRadius: '50%',
            filter: 'blur(100px)',
          }}
        />
      </div>
      
      <div 
        style={{
          width: '100%',
          maxWidth: '420px',
          position: 'relative',
          zIndex: 10,
          animation: 'fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Logo Section */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '14px',
              marginBottom: '16px',
            }}
          >
            <img 
              src={bumuoLogo} 
              alt="BumuO" 
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                boxShadow: '0 4px 14px rgba(59, 130, 246, 0.2)',
              }}
            />
            <h1 
              style={{
                fontSize: '32px',
                fontWeight: 700,
                color: '#ffffff',
                letterSpacing: '-0.025em',
                margin: 0,
              }}
            >
              BumuO
            </h1>
          </div>
          <p 
            style={{
              color: 'var(--color-surface-400)',
              fontSize: '15px',
              margin: 0,
              fontWeight: 400,
            }}
          >
            Sign in to continue coding
          </p>
        </div>

        {/* Form Card */}
        <div 
          style={{
            background: 'rgba(18, 18, 28, 0.85)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '20px',
            padding: '32px',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5), 0 12px 24px rgba(0, 0, 0, 0.4)',
          }}
        >
          <form onSubmit={handleSubmit}>
            {/* Error Alert */}
            {error && (
              <div 
                style={{
                  background: 'rgba(244, 63, 94, 0.1)',
                  border: '1px solid rgba(244, 63, 94, 0.25)',
                  color: '#fda4af',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  marginBottom: '24px',
                  animation: 'fade-in 0.3s ease',
                }}
              >
                <div 
                  style={{
                    width: '6px',
                    height: '6px',
                    background: '#fb7185',
                    borderRadius: '50%',
                    marginTop: '6px',
                    flexShrink: 0,
                  }}
                />
                {error}
              </div>
            )}

            {/* Email Field */}
            <div style={{ marginBottom: '20px' }}>
              <label 
                style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: 'var(--color-surface-300)',
                  marginBottom: '8px',
                  letterSpacing: '0.01em',
                }}
              >
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail 
                  style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '18px',
                    height: '18px',
                    color: 'var(--color-surface-500)',
                  }}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  style={{
                    width: '100%',
                    paddingLeft: '44px',
                    paddingRight: '16px',
                    paddingTop: '13px',
                    paddingBottom: '13px',
                    background: 'var(--color-surface-800)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    color: '#ffffff',
                    fontSize: '15px',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(59, 130, 246, 0.5)'
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.15)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)'
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div style={{ marginBottom: '28px' }}>
              <label 
                style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: 'var(--color-surface-300)',
                  marginBottom: '8px',
                  letterSpacing: '0.01em',
                }}
              >
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock 
                  style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '18px',
                    height: '18px',
                    color: 'var(--color-surface-500)',
                  }}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{
                    width: '100%',
                    paddingLeft: '44px',
                    paddingRight: '48px',
                    paddingTop: '13px',
                    paddingBottom: '13px',
                    background: 'var(--color-surface-800)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    color: '#ffffff',
                    fontSize: '15px',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(59, 130, 246, 0.5)'
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.15)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)'
                    e.target.style.boxShadow = 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={{
                    position: 'absolute',
                    right: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    padding: '4px',
                    cursor: 'pointer',
                    color: 'var(--color-surface-500)',
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={(e) => e.target.closest('button').style.color = '#ffffff'}
                  onMouseLeave={(e) => e.target.closest('button').style.color = 'var(--color-surface-500)'}
                >
                  {showPassword ? (
                    <EyeOff style={{ width: '18px', height: '18px' }} />
                  ) : (
                    <Eye style={{ width: '18px', height: '18px' }} />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || googleLoading}
              style={{
                width: '100%',
                padding: '14px 24px',
                background: loading 
                  ? 'var(--color-surface-700)' 
                  : 'linear-gradient(135deg, var(--color-primary-600) 0%, var(--color-primary-500) 100%)',
                border: 'none',
                borderRadius: '12px',
                color: '#ffffff',
                fontSize: '15px',
                fontWeight: 600,
                cursor: loading || googleLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.3s ease',
                boxShadow: loading ? 'none' : '0 4px 14px rgba(59, 130, 246, 0.25)',
                opacity: googleLoading ? 0.7 : 1,
              }}
              onMouseEnter={(e) => {
                if (!loading && !googleLoading) {
                  e.target.style.background = 'linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-primary-400) 100%)'
                  e.target.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.35)'
                  e.target.style.transform = 'translateY(-1px)'
                }
              }}
              onMouseLeave={(e) => {
                if (!loading && !googleLoading) {
                  e.target.style.background = 'linear-gradient(135deg, var(--color-primary-600) 0%, var(--color-primary-500) 100%)'
                  e.target.style.boxShadow = '0 4px 14px rgba(59, 130, 246, 0.25)'
                  e.target.style.transform = 'translateY(0)'
                }
              }}
            >
              {loading ? (
                <Loader2 style={{ width: '20px', height: '20px', animation: 'spin 1s linear infinite' }} />
              ) : (
                <>
                  Sign In
                  <ArrowRight style={{ width: '16px', height: '16px' }} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '16px', 
            margin: '24px 0',
          }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.08)' }} />
            <span style={{ color: 'var(--color-surface-500)', fontSize: '13px', fontWeight: 500 }}>
              or continue with
            </span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.08)' }} />
          </div>

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading || googleLoading}
            style={{
              width: '100%',
              padding: '14px 24px',
              background: 'var(--color-surface-800)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              color: '#ffffff',
              fontSize: '15px',
              fontWeight: 500,
              cursor: loading || googleLoading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              transition: 'all 0.2s ease',
              opacity: loading ? 0.7 : 1,
            }}
            onMouseEnter={(e) => {
              if (!loading && !googleLoading) {
                e.currentTarget.style.background = 'var(--color-surface-700)'
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)'
              }
            }}
            onMouseLeave={(e) => {
              if (!loading && !googleLoading) {
                e.currentTarget.style.background = 'var(--color-surface-800)'
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            {googleLoading ? (
              <Loader2 style={{ width: '18px', height: '18px', animation: 'spin 1s linear infinite' }} />
            ) : (
              <GoogleIcon />
            )}
            {googleLoading ? 'Connecting...' : 'Continue with Google'}
          </button>

          {/* Sign Up Link */}
          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <p 
              style={{
                color: 'var(--color-surface-400)',
                fontSize: '14px',
                margin: 0,
              }}
            >
              Don't have an account?{' '}
              <Link 
                to="/register" 
                style={{
                  color: 'var(--color-primary-400)',
                  fontWeight: 500,
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => e.target.style.color = 'var(--color-primary-300)'}
                onMouseLeave={(e) => e.target.style.color = 'var(--color-primary-400)'}
              >
                Sign up for free
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Text */}
        <p 
          style={{
            textAlign: 'center',
            marginTop: '32px',
            color: 'var(--color-surface-500)',
            fontSize: '13px',
          }}
        >
          By signing in, you agree to our Terms of Service
        </p>
      </div>
    </div>
  )
}
