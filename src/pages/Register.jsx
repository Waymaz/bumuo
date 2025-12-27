import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Code2, Mail, Lock, ArrowRight } from 'lucide-react'

export const Register = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await signUp(email, password)
    
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #0f172a, #581c87, #0f172a)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem' }}>
      <div style={{ width: '100%', maxWidth: '28rem', position: 'relative', zIndex: 10 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <Code2 style={{ width: '2.5rem', height: '2.5rem', color: '#c084fc' }} />
            <h1 style={{ fontSize: '1.875rem', fontWeight: 600, color: 'white' }}>CodeVerse</h1>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Create your account</p>
        </div>

        {/* Form Card */}
        <div style={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '1rem', padding: '2rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {error && (
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.5)', color: '#fecaca', padding: '0.75rem 1rem', borderRadius: '0.75rem', fontSize: '0.875rem' }}>
                {error}
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'white', marginBottom: '0.5rem' }}>
                Email
              </label>
              <div style={{ position: 'relative' }}>
                <Mail style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '1.25rem', height: '1.25rem', color: '#94a3b8' }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  style={{ width: '100%', paddingLeft: '2.75rem', paddingRight: '1rem', paddingTop: '0.75rem', paddingBottom: '0.75rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '0.75rem', color: 'white', fontSize: '1rem' }}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'white', marginBottom: '0.5rem' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '1.25rem', height: '1.25rem', color: '#94a3b8' }} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ width: '100%', paddingLeft: '2.75rem', paddingRight: '1rem', paddingTop: '0.75rem', paddingBottom: '0.75rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '0.75rem', color: 'white', fontSize: '1rem' }}
                  required
                  minLength={6}
                />
              </div>
              <p style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#94a3b8' }}>Minimum 6 characters</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: '0.75rem', background: loading ? 'rgba(168, 85, 247, 0.5)' : '#a855f7', color: 'white', fontWeight: 500, borderRadius: '0.75rem', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', boxShadow: '0 10px 15px -3px rgba(168, 85, 247, 0.25)', transition: 'all 0.2s' }}
            >
              {loading ? (
                <div style={{ width: '1.25rem', height: '1.25rem', border: '2px solid rgba(255, 255, 255, 0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
              ) : (
                <>
                  Create Account
                  <ArrowRight style={{ width: '1rem', height: '1rem' }} />
                </>
              )}
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#c084fc', fontWeight: 500, textDecoration: 'none' }}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        input::placeholder {
          color: #64748b !important;
        }
        input:focus {
          outline: none;
          border-color: #c084fc !important;
          background: rgba(255, 255, 255, 0.1) !important;
        }
        button:hover:not(:disabled) {
          background: #9333ea !important;
        }
      `}</style>
    </div>
  )
}
