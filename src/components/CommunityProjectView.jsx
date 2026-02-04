import { useState, useEffect } from 'react'
import { 
  X, GitFork, Eye, Clock, ArrowLeft, Code, Loader2,
  FileCode, FileType, Braces, UserPlus, LogIn
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { projectService } from '../services/projectService'
import { profileService } from '../services/profileService'

export const CommunityProjectView = ({ project, onClose, onFork, currentUserId }) => {
  const navigate = useNavigate()
  const [activeCodeTab, setActiveCodeTab] = useState('html')
  const [forking, setForking] = useState(false)
  const [forkSuccess, setForkSuccess] = useState(false)
  const [forkedProject, setForkedProject] = useState(null)
  const [showAuthPrompt, setShowAuthPrompt] = useState(false)

  const creator = project.creator || {}
  const avatarUrl = creator.avatar_url || profileService.generateAvatarUrl(creator.username || 'user')
  const isLoggedIn = !!currentUserId

  // Record view when modal opens
  useEffect(() => {
    if (project.id && currentUserId) {
      projectService.recordView(project.id, currentUserId)
    }
  }, [project.id, currentUserId])

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num?.toString() || '0'
  }

  const handleFork = async () => {
    if (forking) return
    
    // For non-logged in users, open project in editor playground
    if (!isLoggedIn) {
      sessionStorage.setItem('bumuo_temp_project', JSON.stringify({
        title: `Fork of ${project.title}`,
        html: project.html || '',
        css: project.css || '',
        js: project.js || '',
        originalId: project.id,
        creatorName: creator.username || 'user'
      }))
      navigate('/editor/playground')
      onClose()
      return
    }
    
    setForking(true)
    const { data, error } = await onFork(project.id, project.title)
    
    if (!error && data) {
      setForkedProject(data)
      setForkSuccess(true)
    }
    setForking(false)
  }

  const handleOpenForked = () => {
    if (forkedProject) {
      navigate(`/editor/${forkedProject.id}`)
      onClose()
    }
  }

  const codeTabs = [
    { id: 'html', label: 'HTML', icon: FileCode, color: '#fb923c', content: project.html },
    { id: 'css', label: 'CSS', icon: FileType, color: '#22d3ee', content: project.css },
    { id: 'js', label: 'JavaScript', icon: Braces, color: '#facc15', content: project.js },
  ]

  const activeContent = codeTabs.find(t => t.id === activeCodeTab)?.content || ''

  // Check if user owns this project
  const isOwner = project.user_id === currentUserId

  return (
    <div style={overlayStyle} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={modalStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <button onClick={onClose} style={backButtonStyle}>
            <ArrowLeft style={{ width: '18px', height: '18px' }} />
            <span style={{ display: 'inline-block' }}>Back</span>
          </button>
          
          <div style={headerActionsStyle}>
            {/* Fork button - different states based on auth and ownership */}
            {!isOwner && !forkSuccess && (
              <button
                onClick={handleFork}
                disabled={forking}
                style={forkButtonStyle}
              >
                {forking ? (
                  <>
                    <Loader2 style={{ width: '18px', height: '18px', animation: 'spin 1s linear infinite' }} />
                    <span>Forking...</span>
                  </>
                ) : (
                  <>
                    <GitFork style={{ width: '18px', height: '18px' }} />
                    <span>{isLoggedIn ? 'Fork Project' : 'Fork to Edit'}</span>
                  </>
                )}
              </button>
            )}
            
            {forkSuccess && (
              <button onClick={handleOpenForked} style={openForkedButtonStyle}>
                <Code style={{ width: '18px', height: '18px' }} />
                <span>Open Forked Project</span>
              </button>
            )}
          </div>
        </div>

        {/* Auth Prompt Modal for non-logged in users */}
        {showAuthPrompt && (
          <AuthPromptModal 
            onClose={() => setShowAuthPrompt(false)}
            onLogin={() => {
              sessionStorage.setItem('bumuo_return_to', window.location.pathname)
              navigate('/login')
            }}
            onSignUp={() => {
              sessionStorage.setItem('bumuo_return_to', window.location.pathname)
              navigate('/register')
            }}
          />
        )}

        {/* Project Info */}
        <div style={projectInfoStyle}>
          <h1 style={titleStyle}>{project.title}</h1>
          
          <div style={metaStyle}>
            <div style={creatorStyle}>
              <img src={avatarUrl} alt="" style={avatarStyle} />
              <span style={{ color: 'var(--color-surface-300)', fontWeight: 500 }}>
                @{creator.username || 'user'}
              </span>
            </div>
            
            <span style={dotStyle}>•</span>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock style={{ width: '14px', height: '14px', color: 'var(--color-surface-500)' }} />
              <span style={{ color: 'var(--color-surface-500)', fontSize: '14px' }}>
                {formatDate(project.created_at)}
              </span>
            </div>
          </div>
          
          <div style={statsRowStyle}>
            <div style={statBadgeStyle}>
              <Eye style={{ width: '16px', height: '16px' }} />
              {formatNumber(project.view_count)} views
            </div>
            <div style={statBadgeStyle}>
              <GitFork style={{ width: '16px', height: '16px' }} />
              {formatNumber(project.fork_count)} forks
            </div>
          </div>
        </div>

        {/* Success Message */}
        {forkSuccess && (
          <div style={successMessageStyle}>
            <div style={successIconStyle}>
              <GitFork style={{ width: '20px', height: '20px', color: '#ffffff' }} />
            </div>
            <div>
              <p style={{ fontWeight: 600, color: '#10b981', margin: 0 }}>
                Project forked successfully!
              </p>
              <p style={{ fontSize: '13px', color: 'var(--color-surface-400)', margin: '4px 0 0 0' }}>
                The project has been added to your dashboard. You can now edit it freely.
              </p>
            </div>
          </div>
        )}

        {/* Live Preview */}
        <div style={previewSectionStyle}>
          <h3 style={sectionTitleStyle}>Live Preview</h3>
          <div style={previewContainerStyle}>
            <iframe
              title="project-preview"
              srcDoc={`
                <!DOCTYPE html>
                <html>
                  <head>
                    <style>
                      * { box-sizing: border-box; }
                      body { margin: 0; padding: 16px; font-family: system-ui, sans-serif; }
                      ${project.css || ''}
                    </style>
                  </head>
                  <body>
                    ${project.html || ''}
                    <script>${project.js || ''}</script>
                  </body>
                </html>
              `}
              sandbox="allow-scripts"
              style={previewIframeStyle}
            />
          </div>
        </div>

        {/* Code View */}
        <div style={codeSectionStyle}>
          <div style={codeTabsStyle}>
            {codeTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCodeTab(tab.id)}
                style={{
                  ...codeTabStyle,
                  background: activeCodeTab === tab.id 
                    ? `rgba(${tab.id === 'html' ? '251, 146, 60' : tab.id === 'css' ? '34, 211, 238' : '250, 204, 21'}, 0.15)`
                    : 'transparent',
                  color: activeCodeTab === tab.id ? tab.color : 'var(--color-surface-400)',
                  borderColor: activeCodeTab === tab.id 
                    ? `rgba(${tab.id === 'html' ? '251, 146, 60' : tab.id === 'css' ? '34, 211, 238' : '250, 204, 21'}, 0.3)`
                    : 'transparent',
                }}
              >
                <tab.icon style={{ width: '14px', height: '14px' }} />
                {tab.label}
              </button>
            ))}
          </div>
          
          <div style={codeContainerStyle}>
            {activeContent ? (
              <pre style={codePreStyle}>
                <code>{activeContent}</code>
              </pre>
            ) : (
              <div style={emptyCodeStyle}>
                <Code style={{ width: '32px', height: '32px', color: 'var(--color-surface-600)' }} />
                <p style={{ color: 'var(--color-surface-500)', margin: '12px 0 0 0' }}>
                  No {activeCodeTab.toUpperCase()} code
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Styles
const overlayStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0, 0, 0, 0.85)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'center',
  padding: '40px 24px',
  zIndex: 100,
  overflow: 'auto',
  animation: 'fade-in 0.2s ease',
}

const modalStyle = {
  position: 'relative',
  background: 'var(--color-surface-900)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '24px',
  maxWidth: '1000px',
  width: '100%',
  boxShadow: '0 25px 80px rgba(0, 0, 0, 0.6)',
  animation: 'scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
}

const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '20px 24px',
  borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
}

const backButtonStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '10px 16px',
  background: 'var(--color-surface-800)',
  border: '1px solid rgba(255, 255, 255, 0.06)',
  borderRadius: '12px',
  color: 'var(--color-surface-300)',
  fontWeight: 500,
  fontSize: '14px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
}

const forkButtonStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '10px 20px',
  background: 'linear-gradient(135deg, var(--color-primary-600) 0%, var(--color-primary-500) 100%)',
  border: 'none',
  borderRadius: '12px',
  color: '#ffffff',
  fontWeight: 600,
  fontSize: '14px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  boxShadow: '0 4px 14px rgba(59, 130, 246, 0.3)',
}

const openForkedButtonStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '10px 20px',
  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  border: 'none',
  borderRadius: '12px',
  color: '#ffffff',
  fontWeight: 600,
  fontSize: '14px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
}

const projectInfoStyle = {
  padding: '28px 24px',
  borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
}

const titleStyle = {
  fontSize: '28px',
  fontWeight: 700,
  color: '#ffffff',
  marginBottom: '16px',
  letterSpacing: '-0.025em',
}

const metaStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '20px',
  flexWrap: 'wrap',
}

const creatorStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
}

const avatarStyle = {
  width: '32px',
  height: '32px',
  borderRadius: '10px',
  border: '2px solid rgba(255, 255, 255, 0.1)',
}

const dotStyle = {
  color: 'var(--color-surface-600)',
}

const statsRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
}

const statBadgeStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px 14px',
  background: 'var(--color-surface-800)',
  borderRadius: '10px',
  fontSize: '14px',
  color: 'var(--color-surface-300)',
  fontWeight: 500,
}

const successMessageStyle = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '16px',
  margin: '0 24px',
  padding: '16px 20px',
  background: 'rgba(16, 185, 129, 0.1)',
  border: '1px solid rgba(16, 185, 129, 0.2)',
  borderRadius: '14px',
  animation: 'fade-up 0.3s ease',
}

const successIconStyle = {
  padding: '10px',
  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  borderRadius: '12px',
  flexShrink: 0,
}

const previewSectionStyle = {
  padding: '24px',
  borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
}

const sectionTitleStyle = {
  fontSize: '14px',
  fontWeight: 600,
  color: 'var(--color-surface-400)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  marginBottom: '16px',
}

const previewContainerStyle = {
  background: '#ffffff',
  borderRadius: '16px',
  overflow: 'hidden',
  border: '1px solid rgba(255, 255, 255, 0.1)',
}

const previewIframeStyle = {
  width: '100%',
  height: '400px',
  border: 'none',
  display: 'block',
}

const codeSectionStyle = {
  padding: '24px',
}

const codeTabsStyle = {
  display: 'flex',
  gap: '8px',
  marginBottom: '16px',
}

const codeTabStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  padding: '8px 16px',
  background: 'transparent',
  border: '1px solid transparent',
  borderRadius: '10px',
  fontSize: '14px',
  fontWeight: 500,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
}

const codeContainerStyle = {
  background: 'var(--color-surface-850)',
  border: '1px solid rgba(255, 255, 255, 0.06)',
  borderRadius: '16px',
  overflow: 'hidden',
}

const codePreStyle = {
  margin: 0,
  padding: '20px',
  maxHeight: '300px',
  overflow: 'auto',
  fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
  fontSize: '13px',
  lineHeight: 1.6,
  color: 'var(--color-surface-200)',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
}

const emptyCodeStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '60px 20px',
  textAlign: 'center',
}

// Header actions style
const headerActionsStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  flexWrap: 'wrap',
}

// Auth Prompt Modal Component
const AuthPromptModal = ({ onClose, onLogin, onSignUp }) => (
  <div style={authPromptOverlayStyle} onClick={(e) => e.target === e.currentTarget && onClose()}>
    <div style={authPromptModalStyle}>
      {/* Icon */}
      <div style={authPromptIconStyle}>
        <UserPlus style={{ width: '28px', height: '28px', color: '#ffffff' }} />
      </div>
      
      {/* Content */}
      <h3 style={authPromptTitleStyle}>
        Create an Account to Save
      </h3>
      <p style={authPromptDescStyle}>
        Sign up for free to fork projects, save your work, and share with the community.
      </p>
      
      {/* Benefits list */}
      <div style={authPromptBenefitsStyle}>
        <div style={authPromptBenefitItemStyle}>
          <div style={authPromptCheckStyle}>✓</div>
          <span>Save and manage unlimited projects</span>
        </div>
        <div style={authPromptBenefitItemStyle}>
          <div style={authPromptCheckStyle}>✓</div>
          <span>Fork and customize community projects</span>
        </div>
        <div style={authPromptBenefitItemStyle}>
          <div style={authPromptCheckStyle}>✓</div>
          <span>Share your creations with others</span>
        </div>
      </div>
      
      {/* Actions */}
      <div style={authPromptActionsStyle}>
        <button onClick={onSignUp} style={authPromptSignUpBtnStyle}>
          <UserPlus style={{ width: '18px', height: '18px' }} />
          Create Free Account
        </button>
        <button onClick={onLogin} style={authPromptLoginBtnStyle}>
          <LogIn style={{ width: '18px', height: '18px' }} />
          Sign In
        </button>
      </div>
      
      {/* Close button */}
      <button onClick={onClose} style={authPromptCloseBtnStyle}>
        <X style={{ width: '18px', height: '18px' }} />
      </button>
    </div>
  </div>
)

// Auth Prompt Modal Styles
const authPromptOverlayStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0, 0, 0, 0.7)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 200,
  animation: 'fade-in 0.2s ease',
}

const authPromptModalStyle = {
  position: 'relative',
  background: 'var(--color-surface-900)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '24px',
  padding: '40px',
  maxWidth: '420px',
  width: '90%',
  textAlign: 'center',
  boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5)',
  animation: 'scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
}

const authPromptIconStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '64px',
  height: '64px',
  background: 'linear-gradient(135deg, var(--color-primary-600) 0%, #8b5cf6 100%)',
  borderRadius: '20px',
  marginBottom: '20px',
  boxShadow: '0 8px 24px rgba(59, 130, 246, 0.3)',
}

const authPromptTitleStyle = {
  fontSize: '24px',
  fontWeight: 700,
  color: '#ffffff',
  marginBottom: '12px',
  letterSpacing: '-0.02em',
}

const authPromptDescStyle = {
  fontSize: '15px',
  color: 'var(--color-surface-400)',
  lineHeight: 1.6,
  marginBottom: '24px',
}

const authPromptBenefitsStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  marginBottom: '28px',
  padding: '20px',
  background: 'rgba(59, 130, 246, 0.05)',
  borderRadius: '16px',
  border: '1px solid rgba(59, 130, 246, 0.1)',
}

const authPromptBenefitItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  fontSize: '14px',
  color: 'var(--color-surface-300)',
  textAlign: 'left',
}

const authPromptCheckStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '20px',
  height: '20px',
  background: 'rgba(16, 185, 129, 0.2)',
  borderRadius: '6px',
  fontSize: '12px',
  color: '#10b981',
  fontWeight: 600,
  flexShrink: 0,
}

const authPromptActionsStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
}

const authPromptSignUpBtnStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  width: '100%',
  padding: '14px 24px',
  background: 'linear-gradient(135deg, var(--color-primary-600) 0%, var(--color-primary-500) 100%)',
  border: 'none',
  borderRadius: '14px',
  color: '#ffffff',
  fontWeight: 600,
  fontSize: '15px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  boxShadow: '0 4px 14px rgba(59, 130, 246, 0.3)',
}

const authPromptLoginBtnStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  width: '100%',
  padding: '14px 24px',
  background: 'var(--color-surface-800)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '14px',
  color: 'var(--color-surface-300)',
  fontWeight: 500,
  fontSize: '15px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
}

const authPromptCloseBtnStyle = {
  position: 'absolute',
  top: '16px',
  right: '16px',
  padding: '8px',
  background: 'var(--color-surface-800)',
  border: '1px solid rgba(255, 255, 255, 0.06)',
  borderRadius: '10px',
  color: 'var(--color-surface-400)',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}
