import { Trash2, ExternalLink, Clock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export const ProjectCard = ({ project, onDelete }) => {
  const navigate = useNavigate()
  const [isHovered, setIsHovered] = useState(false)

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div 
      style={{ position: 'relative', background: '#151a21', border: '1px solid #1f2937', borderRadius: '1rem', padding: '1.5rem', cursor: 'pointer', transition: 'all 0.3s', ...(isHovered && { borderColor: 'rgba(59, 130, 246, 0.5)', transform: 'translateY(-4px)', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)' }) }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/editor/${project.id}`)}
    >
      <div style={{ position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: isHovered ? '#60a5fa' : 'white', marginBottom: '0.5rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', transition: 'color 0.3s' }}>
              {project.title}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#9ca3af' }}>
              <Clock style={{ width: '0.875rem', height: '0.875rem' }} />
              <span>{formatDate(project.updated_at)}</span>
            </div>
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete(project.id)
            }}
            style={{ color: '#6b7280', padding: '0.5rem', borderRadius: '0.5rem', border: 'none', background: 'transparent', cursor: 'pointer', opacity: isHovered ? 1 : 0, transition: 'all 0.3s' }}
            onMouseOver={(e) => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)' }}
            onMouseOut={(e) => { e.currentTarget.style.color = '#6b7280'; e.currentTarget.style.background = 'transparent' }}
          >
            <Trash2 style={{ width: '1.25rem', height: '1.25rem' }} />
          </button>
        </div>
        
        {/* Code preview indicator */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <div style={{ height: '0.25rem', flex: 1, background: 'rgba(249, 115, 22, 0.3)', borderRadius: '9999px', overflow: 'hidden' }}>
            <div style={{ height: '100%', background: '#f97316', width: '75%', borderRadius: '9999px' }}></div>
          </div>
          <div style={{ height: '0.25rem', flex: 1, background: 'rgba(59, 130, 246, 0.3)', borderRadius: '9999px', overflow: 'hidden' }}>
            <div style={{ height: '100%', background: '#3b82f6', width: '50%', borderRadius: '9999px' }}></div>
          </div>
          <div style={{ height: '0.25rem', flex: 1, background: 'rgba(234, 179, 8, 0.3)', borderRadius: '9999px', overflow: 'hidden' }}>
            <div style={{ height: '100%', background: '#eab308', width: '66%', borderRadius: '9999px' }}></div>
          </div>
        </div>
        
        <button
          onClick={(e) => {
            e.stopPropagation()
            navigate(`/editor/${project.id}`)
          }}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem 1rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '0.75rem', fontWeight: 500, cursor: 'pointer', transition: 'all 0.3s', boxShadow: '0 4px 6px rgba(59, 130, 246, 0.2)' }}
          onMouseOver={(e) => e.currentTarget.style.background = '#2563eb'}
          onMouseOut={(e) => e.currentTarget.style.background = '#3b82f6'}
        >
          <ExternalLink style={{ width: '1rem', height: '1rem' }} />
          Open Project
        </button>
      </div>
    </div>
  )
}
