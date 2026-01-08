import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Code2, Eye, Sparkles, ExternalLink, AlertCircle } from 'lucide-react'
import { PreviewPane } from '../components/PreviewPane'
import { projectService } from '../services/projectService'

export const Share = () => {
  const { publicLink } = useParams()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProject()
  }, [publicLink])

  const loadProject = async () => {
    const { data, error } = await projectService.getPublicProject(publicLink)
    
    if (!error && data) {
      setProject(data)
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div 
        style={{
          minHeight: '100vh',
          backgroundColor: 'var(--color-surface-950)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div 
            style={{
              width: '56px',
              height: '56px',
              border: '4px solid var(--color-surface-800)',
              borderTopColor: 'var(--color-primary-500)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto',
            }}
          />
          <p style={{ marginTop: '20px', color: 'var(--color-surface-400)', fontWeight: 500 }}>
            Loading project...
          </p>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div 
        style={{
          minHeight: '100vh',
          backgroundColor: 'var(--color-surface-950)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
        }}
      >
        <div 
          style={{
            textAlign: 'center',
            maxWidth: '420px',
            animation: 'fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <div 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '80px',
              height: '80px',
              background: 'rgba(244, 63, 94, 0.1)',
              borderRadius: '20px',
              border: '1px solid rgba(244, 63, 94, 0.2)',
              marginBottom: '24px',
            }}
          >
            <AlertCircle style={{ width: '40px', height: '40px', color: '#fb7185' }} />
          </div>
          <h2 
            style={{
              fontSize: '26px',
              fontWeight: 700,
              color: '#ffffff',
              marginBottom: '12px',
              letterSpacing: '-0.025em',
            }}
          >
            Project not found
          </h2>
          <p 
            style={{
              color: 'var(--color-surface-400)',
              fontSize: '16px',
              marginBottom: '28px',
              lineHeight: 1.6,
            }}
          >
            This project may have been deleted or the link is invalid
          </p>
          <a
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 24px',
              background: 'linear-gradient(135deg, var(--color-primary-600) 0%, var(--color-primary-500) 100%)',
              color: '#ffffff',
              borderRadius: '12px',
              fontWeight: 600,
              fontSize: '15px',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 14px rgba(59, 130, 246, 0.25)',
            }}
          >
            <Code2 style={{ width: '18px', height: '18px' }} />
            Go to BumuO
          </a>
        </div>
      </div>
    )
  }

  return (
    <div 
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--color-surface-950)',
      }}
    >
      {/* Header */}
      <div 
        style={{
          background: 'rgba(15, 15, 23, 0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        }}
      >
        <div 
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '16px 24px',
          }}
        >
          <div 
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div 
                style={{
                  padding: '12px',
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)',
                  borderRadius: '14px',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                }}
              >
                <Code2 style={{ width: '24px', height: '24px', color: 'var(--color-primary-400)' }} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h1 
                    style={{
                      fontSize: '20px',
                      fontWeight: 700,
                      color: '#ffffff',
                      margin: 0,
                      letterSpacing: '-0.025em',
                    }}
                  >
                    {project.title}
                  </h1>
                  <Sparkles style={{ width: '16px', height: '16px', color: '#a78bfa' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                  <Eye style={{ width: '14px', height: '14px', color: 'var(--color-surface-500)' }} />
                  <p style={{ fontSize: '14px', color: 'var(--color-surface-400)', margin: 0 }}>
                    Read-only preview
                  </p>
                </div>
              </div>
            </div>
            
            <a
              href="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px 20px',
                background: 'linear-gradient(135deg, var(--color-primary-600) 0%, var(--color-primary-500) 100%)',
                color: '#ffffff',
                borderRadius: '12px',
                fontWeight: 500,
                fontSize: '14px',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 14px rgba(59, 130, 246, 0.2)',
              }}
            >
              <ExternalLink style={{ width: '16px', height: '16px' }} />
              Create Your Own
            </a>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div 
        style={{
          flex: 1,
          position: 'relative',
          background: 'var(--color-surface-900)',
          padding: '16px',
        }}
      >
        <div 
          style={{
            position: 'absolute',
            top: '32px',
            left: '32px',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 16px',
            background: 'rgba(18, 18, 28, 0.95)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
          }}
        >
          <div 
            style={{
              width: '8px',
              height: '8px',
              background: '#34d399',
              borderRadius: '50%',
              animation: 'pulse-subtle 2s ease-in-out infinite',
              boxShadow: '0 0 8px rgba(52, 211, 153, 0.5)',
            }}
          />
          <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-surface-300)' }}>
            Live Preview
          </span>
        </div>
        <div 
          style={{
            height: '100%',
            background: '#ffffff',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <PreviewPane html={project.html} css={project.css} js={project.js} />
        </div>
      </div>

      {/* Footer */}
      <div 
        style={{
          background: 'rgba(15, 15, 23, 0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          padding: '14px 16px',
          textAlign: 'center',
        }}
      >
        <p style={{ fontSize: '14px', color: 'var(--color-surface-500)', margin: 0 }}>
          Built with <span style={{ fontWeight: 600, color: '#ffffff' }}>BumuO</span> — Your collaborative coding sandbox
        </p>
      </div>
    </div>
  )
}
