import { LogOut, Menu, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import bumuoLogo from '../assets/bumuo-logo.png'

export const Navbar = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [logoHover, setLogoHover] = useState(false)
  const [signOutHover, setSignOutHover] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const navStyle = {
    position: 'sticky',
    top: 0,
    zIndex: 50,
    background: 'rgba(15, 15, 23, 0.95)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
  }

  const containerStyle = {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 16px',
  }

  const innerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '64px',
  }

  const logoContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
  }

  const logoIconStyle = {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    transition: 'all 0.3s ease',
    boxShadow: logoHover 
      ? '0 8px 20px rgba(59, 130, 246, 0.35)'
      : '0 4px 14px rgba(59, 130, 246, 0.2)',
  }

  const userPillStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 16px',
    background: 'rgba(30, 30, 44, 0.8)',
    borderRadius: '100px',
    border: '1px solid rgba(255, 255, 255, 0.06)',
  }

  const signOutButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    background: signOutHover ? 'rgba(244, 63, 94, 0.1)' : 'var(--color-surface-800)',
    color: signOutHover ? '#fb7185' : 'var(--color-surface-300)',
    border: signOutHover ? '1px solid rgba(244, 63, 94, 0.3)' : '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '12px',
    transition: 'all 0.2s ease',
    fontWeight: 500,
    fontSize: '14px',
    cursor: 'pointer',
  }

  const mobileMenuButtonStyle = {
    padding: '10px',
    color: 'var(--color-surface-400)',
    background: 'transparent',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  }

  const mobileMenuStyle = {
    padding: '16px 0',
    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
    animation: 'fade-up 0.3s ease',
  }

  return (
    <nav style={navStyle}>
      <div style={containerStyle}>
        <div style={innerStyle}>
          {/* Logo */}
          <div 
            style={logoContainerStyle}
            onClick={() => navigate('/dashboard')}
            onMouseEnter={() => setLogoHover(true)}
            onMouseLeave={() => setLogoHover(false)}
          >
            <img 
              src={bumuoLogo} 
              alt="BumuO" 
              style={logoIconStyle}
            />
            <span 
              style={{
                fontSize: '20px',
                fontWeight: 700,
                color: '#ffffff',
                letterSpacing: '-0.025em',
              }}
            >
              BumuO
            </span>
          </div>
          
          {user && (
            <>
              {/* Desktop Menu */}
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                }}
                className="desktop-menu"
              >
                <div style={userPillStyle}>
                  <div 
                    style={{
                      width: '8px',
                      height: '8px',
                      background: '#34d399',
                      borderRadius: '50%',
                      boxShadow: '0 0 8px rgba(52, 211, 153, 0.5)',
                      animation: 'pulse-subtle 2s ease-in-out infinite',
                    }}
                  />
                  <span 
                    style={{
                      color: 'var(--color-surface-300)',
                      fontSize: '14px',
                      fontWeight: 500,
                      maxWidth: '200px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {user.email}
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  style={signOutButtonStyle}
                  onMouseEnter={() => setSignOutHover(true)}
                  onMouseLeave={() => setSignOutHover(false)}
                >
                  <LogOut style={{ width: '16px', height: '16px' }} />
                  Sign Out
                </button>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                style={mobileMenuButtonStyle}
                className="mobile-menu-btn"
                onMouseEnter={(e) => {
                  e.target.style.color = '#ffffff'
                  e.target.style.background = 'var(--color-surface-800)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = 'var(--color-surface-400)'
                  e.target.style.background = 'transparent'
                }}
              >
                {mobileMenuOpen 
                  ? <X style={{ width: '24px', height: '24px' }} /> 
                  : <Menu style={{ width: '24px', height: '24px' }} />
                }
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        {user && mobileMenuOpen && (
          <div style={mobileMenuStyle} className="mobile-menu">
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '14px 16px',
                marginBottom: '12px',
                background: 'var(--color-surface-800)',
                borderRadius: '12px',
              }}
            >
              <div 
                style={{
                  width: '8px',
                  height: '8px',
                  background: '#34d399',
                  borderRadius: '50%',
                }}
              />
              <span 
                style={{
                  color: 'var(--color-surface-300)',
                  fontSize: '14px',
                  fontWeight: 500,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {user.email}
              </span>
            </div>
            <button
              onClick={handleSignOut}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '14px 16px',
                background: 'rgba(244, 63, 94, 0.1)',
                color: '#fb7185',
                border: '1px solid rgba(244, 63, 94, 0.2)',
                borderRadius: '12px',
                fontWeight: 500,
                fontSize: '15px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <LogOut style={{ width: '16px', height: '16px' }} />
              Sign Out
            </button>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 640px) {
          .desktop-menu { display: none !important; }
        }
        @media (min-width: 641px) {
          .mobile-menu-btn { display: none !important; }
          .mobile-menu { display: none !important; }
        }
      `}</style>
    </nav>
  )
}
