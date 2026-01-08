import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Code2, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react'

export const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await signIn(email, password)
    
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      navigate('/dashboard')
    }
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
            <div 
              style={{
                padding: '14px',
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)',
                borderRadius: '16px',
                border: '1px solid rgba(59, 130, 246, 0.2)',
              }}
            >
              <Code2 style={{ width: '32px', height: '32px', color: 'var(--color-primary-400)' }} />
            </div>
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
              disabled={loading}
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
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.3s ease',
                boxShadow: loading ? 'none' : '0 4px 14px rgba(59, 130, 246, 0.25)',
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.background = 'linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-primary-400) 100%)'
                  e.target.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.35)'
                  e.target.style.transform = 'translateY(-1px)'
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.background = 'linear-gradient(135deg, var(--color-primary-600) 0%, var(--color-primary-500) 100%)'
                  e.target.style.boxShadow = '0 4px 14px rgba(59, 130, 246, 0.25)'
                  e.target.style.transform = 'translateY(0)'
                }
              }}
              onMouseDown={(e) => {
                if (!loading) {
                  e.target.style.transform = 'scale(0.98)'
                }
              }}
              onMouseUp={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(-1px)'
                }
              }}
            >
              {loading ? (
                <div 
                  style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderTopColor: '#ffffff',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                  }}
                />
              ) : (
                <>
                  Sign In
                  <ArrowRight style={{ width: '16px', height: '16px' }} />
                </>
              )}
            </button>
          </form>

          {/* Divider and Sign Up Link */}
          <div style={{ marginTop: '28px', textAlign: 'center' }}>
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
