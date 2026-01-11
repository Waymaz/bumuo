import { Trash2, ExternalLink, Clock, Code, MoreVertical, Play, Globe, Lock, GitFork } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { ProjectPreview } from './ProjectPreview'
import { VisibilityBadge } from './VisibilityToggle'

export const ProjectCard = ({ project, onDelete, viewMode = 'grid', showVisibility = false }) => {
  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [deleteHover, setDeleteHover] = useState(false)
  const [openBtnHover, setOpenBtnHover] = useState(false)

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleDelete = (e) => {
    e.stopPropagation()
    setShowMenu(false)
    onDelete(project.id)
  }

  if (viewMode === 'list') {
    const listCardStyle = {
      background: 'var(--color-surface-850)',
      border: hovered ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid rgba(255, 255, 255, 0.06)',
      borderRadius: '16px',
      padding: '12px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      boxShadow: hovered ? '0 8px 24px rgba(59, 130, 246, 0.08)' : 'none',
    }

    const openBtnStyle = {
      padding: '10px 18px',
      background: openBtnHover 
        ? 'var(--color-primary-400)' 
        : 'var(--color-primary-500)',
      color: '#ffffff',
      fontSize: '14px',
      fontWeight: 500,
      borderRadius: '10px',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      boxShadow: '0 4px 14px rgba(59, 130, 246, 0.2)',
    }

    const deleteBtnStyle = {
      padding: '10px',
      color: deleteHover ? '#fb7185' : 'var(--color-surface-500)',
      background: deleteHover ? 'rgba(244, 63, 94, 0.1)' : 'transparent',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    }

    return (
      <div
        style={listCardStyle}
        onClick={() => navigate(`/editor/${project.id}`)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Mini Preview Thumbnail */}
        <div 
          style={{
            width: '80px',
            height: '50px',
            borderRadius: '8px',
            overflow: 'hidden',
            flexShrink: 0,
            background: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            position: 'relative',
          }}
        >
          {(project.html?.trim() || project.css?.trim() || project.js?.trim()) ? (
            <div
              style={{
                width: '400%',
                height: '400%',
                transform: 'scale(0.25)',
                transformOrigin: 'top left',
                position: 'absolute',
                top: 0,
                left: 0,
              }}
            >
              <iframe
                title="list-preview"
                srcDoc={`
                  <!DOCTYPE html>
                  <html>
                    <head>
                      <style>
                        * { box-sizing: border-box; pointer-events: none !important; }
                        body { margin: 0; padding: 8px; font-family: system-ui, sans-serif; background: #fff; overflow: hidden; }
                        ${project.css || ''}
                      </style>
                    </head>
                    <body>${project.html || ''}</body>
                  </html>
                `}
                sandbox=""
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  display: 'block',
                }}
              />
            </div>
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--color-surface-800)',
              }}
            >
              <Code style={{ width: '16px', height: '16px', color: 'var(--color-surface-600)' }} />
            </div>
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <h3 
              style={{
                fontWeight: 600,
                color: hovered ? 'var(--color-primary-400)' : '#ffffff',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                transition: 'color 0.2s ease',
                fontSize: '16px',
              }}
            >
              {project.title}
            </h3>
            {showVisibility && (
              <VisibilityBadge isPublic={project.is_public} size="small" />
            )}
            {project.forked_from && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '2px 8px',
                background: 'rgba(168, 85, 247, 0.1)',
                border: '1px solid rgba(168, 85, 247, 0.2)',
                borderRadius: '6px',
                fontSize: '11px',
                color: '#a855f7',
                fontWeight: 500,
              }}>
                <GitFork style={{ width: '10px', height: '10px' }} />
                Forked
              </div>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: 'var(--color-surface-400)' }}>
            <Clock style={{ width: '14px', height: '14px' }} />
            <span>{formatDate(project.updated_at)}</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={(e) => {
              e.stopPropagation()
              navigate(`/editor/${project.id}`)
            }}
            style={openBtnStyle}
            onMouseEnter={() => setOpenBtnHover(true)}
            onMouseLeave={() => setOpenBtnHover(false)}
          >
            Open
          </button>
          <button
            onClick={handleDelete}
            style={deleteBtnStyle}
            onMouseEnter={() => setDeleteHover(true)}
            onMouseLeave={() => setDeleteHover(false)}
          >
            <Trash2 style={{ width: '16px', height: '16px' }} />
          </button>
        </div>
      </div>
    )
  }

  // Grid View
  const gridCardStyle = {
    position: 'relative',
    background: 'var(--color-surface-850)',
    border: hovered ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '20px',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: hovered ? '0 20px 40px rgba(59, 130, 246, 0.12)' : '0 4px 12px rgba(0, 0, 0, 0.1)',
    transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
  }

  const menuBtnStyle = {
    padding: '8px',
    color: 'var(--color-surface-500)',
    background: 'transparent',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    opacity: hovered ? 1 : 0,
    transition: 'all 0.2s ease',
  }

  const dropdownStyle = {
    position: 'absolute',
    right: 0,
    top: '100%',
    marginTop: '4px',
    background: 'var(--color-surface-800)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '14px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
    padding: '8px',
    zIndex: 10,
    minWidth: '150px',
    animation: 'scale-in 0.2s ease',
  }

  const mainBtnStyle = {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px 16px',
    background: openBtnHover 
      ? 'linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-primary-400) 100%)'
      : 'linear-gradient(135deg, var(--color-primary-600) 0%, var(--color-primary-500) 100%)',
    color: '#ffffff',
    borderRadius: '12px',
    fontWeight: 500,
    fontSize: '14px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 14px rgba(59, 130, 246, 0.2)',
  }

  return (
    <div
      style={gridCardStyle}
      onClick={() => navigate(`/editor/${project.id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setShowMenu(false) }}
    >
      {/* Preview Section */}
      <div style={{ padding: '12px 12px 0 12px' }}>
        <ProjectPreview 
          html={project.html} 
          css={project.css} 
          js={project.js}
          isHovered={hovered}
        />
      </div>

      {/* Content Section */}
      <div style={{ padding: '16px 20px 20px 20px' }}>
        {/* Header with title and menu */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ flex: 1, minWidth: 0, paddingRight: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
              <h3 
                style={{
                  fontWeight: 600,
                  color: hovered ? 'var(--color-primary-400)' : '#ffffff',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  transition: 'color 0.2s ease',
                  fontSize: '17px',
                  lineHeight: 1.3,
                }}
              >
                {project.title}
              </h3>
              {showVisibility && (
                <VisibilityBadge isPublic={project.is_public} size="small" />
              )}
            </div>
            {project.forked_from && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                marginBottom: '6px',
                padding: '3px 8px',
                background: 'rgba(168, 85, 247, 0.1)',
                border: '1px solid rgba(168, 85, 247, 0.2)',
                borderRadius: '6px',
                fontSize: '11px',
                color: '#a855f7',
                fontWeight: 500,
                width: 'fit-content',
              }}>
                <GitFork style={{ width: '10px', height: '10px' }} />
                Forked project
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--color-surface-400)' }}>
              <Clock style={{ width: '13px', height: '13px' }} />
              <span>{formatDate(project.updated_at)}</span>
            </div>
          </div>
          
          {/* Menu Button */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowMenu(!showMenu)
              }}
              style={{
                ...menuBtnStyle,
                opacity: hovered ? 1 : 0,
              }}
              onMouseEnter={(e) => {
                e.target.style.color = '#ffffff'
                e.target.style.background = 'var(--color-surface-700)'
              }}
              onMouseLeave={(e) => {
                e.target.style.color = 'var(--color-surface-500)'
                e.target.style.background = 'transparent'
              }}
            >
              <MoreVertical style={{ width: '16px', height: '16px' }} />
            </button>
            {showMenu && (
              <div style={dropdownStyle} onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={handleDelete}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    textAlign: 'left',
                    fontSize: '14px',
                    color: '#fb7185',
                    background: 'transparent',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    transition: 'background 0.2s ease',
                  }}
                  onMouseEnter={(e) => e.target.style.background = 'rgba(244, 63, 94, 0.1)'}
                  onMouseLeave={(e) => e.target.style.background = 'transparent'}
                >
                  <Trash2 style={{ width: '16px', height: '16px' }} />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Code language indicators */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px',
              padding: '4px 10px',
              background: project.html?.trim() ? 'rgba(251, 146, 60, 0.15)' : 'rgba(255, 255, 255, 0.03)',
              borderRadius: '6px',
              border: project.html?.trim() ? '1px solid rgba(251, 146, 60, 0.2)' : '1px solid rgba(255, 255, 255, 0.04)',
            }}
          >
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: project.html?.trim() ? '#fb923c' : 'var(--color-surface-600)' }} />
            <span style={{ fontSize: '11px', fontWeight: 500, color: project.html?.trim() ? '#fb923c' : 'var(--color-surface-500)' }}>HTML</span>
          </div>
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px',
              padding: '4px 10px',
              background: project.css?.trim() ? 'rgba(34, 211, 238, 0.15)' : 'rgba(255, 255, 255, 0.03)',
              borderRadius: '6px',
              border: project.css?.trim() ? '1px solid rgba(34, 211, 238, 0.2)' : '1px solid rgba(255, 255, 255, 0.04)',
            }}
          >
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: project.css?.trim() ? '#22d3ee' : 'var(--color-surface-600)' }} />
            <span style={{ fontSize: '11px', fontWeight: 500, color: project.css?.trim() ? '#22d3ee' : 'var(--color-surface-500)' }}>CSS</span>
          </div>
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px',
              padding: '4px 10px',
              background: project.js?.trim() ? 'rgba(250, 204, 21, 0.15)' : 'rgba(255, 255, 255, 0.03)',
              borderRadius: '6px',
              border: project.js?.trim() ? '1px solid rgba(250, 204, 21, 0.2)' : '1px solid rgba(255, 255, 255, 0.04)',
            }}
          >
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: project.js?.trim() ? '#facc15' : 'var(--color-surface-600)' }} />
            <span style={{ fontSize: '11px', fontWeight: 500, color: project.js?.trim() ? '#facc15' : 'var(--color-surface-500)' }}>JS</span>
          </div>
        </div>
        
        {/* Open button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            navigate(`/editor/${project.id}`)
          }}
          style={mainBtnStyle}
          onMouseEnter={() => setOpenBtnHover(true)}
          onMouseLeave={() => setOpenBtnHover(false)}
        >
          <Play style={{ width: '15px', height: '15px' }} />
          Open Editor
        </button>
      </div>
    </div>
  )
}
