import { Code2, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export const Navbar = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <nav style={{ background: 'rgba(15, 20, 25, 0.8)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(31, 41, 55, 0.5)', position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '4rem' }}>
          <div 
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
            onClick={() => navigate('/dashboard')}
          >
            <Code2 style={{ width: '2rem', height: '2rem', color: '#3b82f6' }} />
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white' }}>
              CodeVerse
            </span>
          </div>
          
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ display: 'none', '@media (min-width: 640px)': { display: 'flex' }, alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'rgba(21, 26, 33, 0.5)', borderRadius: '9999px', border: '1px solid rgba(31, 41, 55, 0.5)' }} className="hidden sm:flex">
                <div style={{ width: '0.5rem', height: '0.5rem', background: '#10b981', borderRadius: '50%' }}></div>
                <span style={{ color: '#d1d5db', fontSize: '0.875rem', fontWeight: 500 }}>{user.email}</span>
              </div>
              <button
                onClick={handleSignOut}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1.25rem', background: '#151a21', color: 'white', border: '1px solid #1f2937', borderRadius: '0.75rem', cursor: 'pointer', transition: 'all 0.3s' }}
                onMouseOver={(e) => { e.currentTarget.style.background = '#1a1f2e'; e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.5)' }}
                onMouseOut={(e) => { e.currentTarget.style.background = '#151a21'; e.currentTarget.style.borderColor = '#1f2937' }}
              >
                <LogOut style={{ width: '1rem', height: '1rem' }} />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
