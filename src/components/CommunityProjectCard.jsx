import { useState } from 'react'
import { Eye, GitFork, Clock, Code } from 'lucide-react'
import { ProjectPreview } from './ProjectPreview'
import { profileService } from '../services/profileService'

export const CommunityProjectCard = ({ project, onClick, viewMode = 'grid' }) => {
  const [hovered, setHovered] = useState(false)

  const formatDate = (date) => {
    const now = new Date()
    const diff = now - new Date(date)
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 30) {
      return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    }
    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return 'Just now'
  }

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num?.toString() || '0'
  }

  const creator = project.creator || {}
  const avatarUrl = creator.avatar_url || profileService.generateAvatarUrl(creator.username || 'user')

  if (viewMode === 'list') {
    return (
      <div
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          ...listCardStyle,
          borderColor: hovered ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255, 255, 255, 0.06)',
          boxShadow: hovered ? '0 8px 24px rgba(59, 130, 246, 0.08)' : 'none',
        }}
      >
        {/* Mini Preview */}
        <div style={listPreviewStyle}>
          {(project.html?.trim() || project.css?.trim() || project.js?.trim()) ? (
            <div style={listPreviewIframeWrapperStyle}>
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
                style={listPreviewIframeStyle}
              />
            </div>
          ) : (
            <div style={listEmptyPreviewStyle}>
              <Code style={{ width: '16px', height: '16px', color: 'var(--color-surface-600)' }} />
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{
            ...listTitleStyle,
            color: hovered ? 'var(--color-primary-400)' : '#ffffff',
          }}>
            {project.title}
          </h3>
          <div style={listMetaStyle}>
            <img src={avatarUrl} alt="" style={listAvatarStyle} />
            <span style={{ color: 'var(--color-surface-400)' }}>@{creator.username || 'user'}</span>
            <span style={{ color: 'var(--color-surface-600)' }}>•</span>
            <span style={{ color: 'var(--color-surface-500)' }}>{formatDate(project.created_at)}</span>
          </div>
        </div>

        {/* Stats */}
        <div style={listStatsStyle}>
          <div style={statItemStyle}>
            <Eye style={{ width: '14px', height: '14px', color: 'var(--color-surface-500)' }} />
            <span style={{ fontSize: '13px', color: 'var(--color-surface-400)' }}>
              {formatNumber(project.view_count)}
            </span>
          </div>
          <div style={statItemStyle}>
            <GitFork style={{ width: '14px', height: '14px', color: 'var(--color-surface-500)' }} />
            <span style={{ fontSize: '13px', color: 'var(--color-surface-400)' }}>
              {formatNumber(project.fork_count)}
            </span>
          </div>
        </div>
      </div>
    )
  }

  // Grid view
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...gridCardStyle,
        borderColor: hovered ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255, 255, 255, 0.06)',
        boxShadow: hovered ? '0 20px 40px rgba(59, 130, 246, 0.12)' : '0 4px 12px rgba(0, 0, 0, 0.1)',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
      }}
    >
      {/* Preview */}
      <div style={{ padding: '12px 12px 0 12px' }}>
        <ProjectPreview 
          html={project.html} 
          css={project.css} 
          js={project.js}
          isHovered={hovered}
        />
      </div>

      {/* Content */}
      <div style={{ padding: '16px 20px 20px 20px' }}>
        {/* Creator info */}
        <div style={creatorInfoStyle}>
          <img src={avatarUrl} alt="" style={avatarStyle} />
          <span style={{ fontSize: '13px', color: 'var(--color-surface-400)', fontWeight: 500 }}>
            @{creator.username || 'user'}
          </span>
          <span style={{ color: 'var(--color-surface-600)', margin: '0 6px' }}>•</span>
          <Clock style={{ width: '12px', height: '12px', color: 'var(--color-surface-500)' }} />
          <span style={{ fontSize: '12px', color: 'var(--color-surface-500)', marginLeft: '4px' }}>
            {formatDate(project.created_at)}
          </span>
        </div>

        {/* Title */}
        <h3 style={{
          ...gridTitleStyle,
          color: hovered ? 'var(--color-primary-400)' : '#ffffff',
        }}>
          {project.title}
        </h3>

        {/* Stats */}
        <div style={gridStatsStyle}>
          <div style={statItemStyle}>
            <Eye style={{ width: '15px', height: '15px', color: 'var(--color-surface-500)' }} />
            <span style={{ fontSize: '14px', color: 'var(--color-surface-400)', fontWeight: 500 }}>
              {formatNumber(project.view_count)}
            </span>
          </div>
          <div style={statItemStyle}>
            <GitFork style={{ width: '15px', height: '15px', color: 'var(--color-surface-500)' }} />
            <span style={{ fontSize: '14px', color: 'var(--color-surface-400)', fontWeight: 500 }}>
              {formatNumber(project.fork_count)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Grid card styles
const gridCardStyle = {
  position: 'relative',
  background: 'var(--color-surface-850)',
  border: '1px solid rgba(255, 255, 255, 0.06)',
  borderRadius: '20px',
  overflow: 'hidden',
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
}

const creatorInfoStyle = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: '12px',
}

const avatarStyle = {
  width: '24px',
  height: '24px',
  borderRadius: '8px',
  marginRight: '8px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
}

const gridTitleStyle = {
  fontWeight: 600,
  fontSize: '17px',
  marginBottom: '16px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  transition: 'color 0.2s ease',
  lineHeight: 1.3,
}

const gridStatsStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '20px',
}

// List card styles
const listCardStyle = {
  background: 'var(--color-surface-850)',
  border: '1px solid rgba(255, 255, 255, 0.06)',
  borderRadius: '16px',
  padding: '12px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
}

const listPreviewStyle = {
  width: '80px',
  height: '50px',
  borderRadius: '8px',
  overflow: 'hidden',
  flexShrink: 0,
  background: '#ffffff',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  position: 'relative',
}

const listPreviewIframeWrapperStyle = {
  width: '400%',
  height: '400%',
  transform: 'scale(0.25)',
  transformOrigin: 'top left',
  position: 'absolute',
  top: 0,
  left: 0,
}

const listPreviewIframeStyle = {
  width: '100%',
  height: '100%',
  border: 'none',
  display: 'block',
}

const listEmptyPreviewStyle = {
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'var(--color-surface-800)',
}

const listTitleStyle = {
  fontWeight: 600,
  fontSize: '16px',
  marginBottom: '4px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  transition: 'color 0.2s ease',
}

const listMetaStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '13px',
}

const listAvatarStyle = {
  width: '18px',
  height: '18px',
  borderRadius: '6px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
}

const listStatsStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
}

const statItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
}
