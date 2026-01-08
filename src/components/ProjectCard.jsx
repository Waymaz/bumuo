import { Trash2, ExternalLink, Clock, Code, MoreVertical } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export const ProjectCard = ({ project, onDelete, viewMode = 'grid' }) => {
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
      padding: '16px',
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
        <div 
          style={{
            padding: '12px',
            background: hovered 
              ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(139, 92, 246, 0.3) 100%)'
              : 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
            borderRadius: '14px',
            border: '1px solid rgba(59, 130, 246, 0.1)',
            transition: 'all 0.3s ease',
          }}
        >
          <Code style={{ width: '20px', height: '20px', color: 'var(--color-primary-400)' }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 
            style={{
              fontWeight: 600,
              color: hovered ? 'var(--color-primary-400)' : '#ffffff',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              transition: 'color 0.2s ease',
              fontSize: '16px',
              marginBottom: '4px',
            }}
          >
            {project.title}
          </h3>
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
    padding: '24px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: hovered ? '0 20px 40px rgba(59, 130, 246, 0.1)' : 'none',
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
      {/* Menu Button */}
      <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
        <button
          onClick={(e) => {
            e.stopPropagation()
            setShowMenu(!showMenu)
          }}
          style={menuBtnStyle}
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

      <div style={{ marginBottom: '20px' }}>
        <div 
          style={{
            padding: '14px',
            background: hovered 
              ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(139, 92, 246, 0.3) 100%)'
              : 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
            borderRadius: '16px',
            display: 'inline-block',
            marginBottom: '14px',
            border: '1px solid rgba(59, 130, 246, 0.1)',
            transition: 'all 0.3s ease',
          }}
        >
          <Code style={{ width: '24px', height: '24px', color: 'var(--color-primary-400)' }} />
        </div>
        <h3 
          style={{
            fontWeight: 600,
            color: hovered ? 'var(--color-primary-400)' : '#ffffff',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            transition: 'color 0.2s ease',
            fontSize: '18px',
            marginBottom: '6px',
          }}
        >
          {project.title}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: 'var(--color-surface-400)' }}>
          <Clock style={{ width: '14px', height: '14px' }} />
          <span>{formatDate(project.updated_at)}</span>
        </div>
      </div>
      
      {/* Code preview indicator */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <div style={{ height: '4px', flex: 1, background: 'rgba(251, 146, 60, 0.2)', borderRadius: '100px', overflow: 'hidden' }}>
          <div style={{ height: '100%', background: '#fb923c', borderRadius: '100px', width: '75%' }} />
        </div>
        <div style={{ height: '4px', flex: 1, background: 'rgba(34, 211, 238, 0.2)', borderRadius: '100px', overflow: 'hidden' }}>
          <div style={{ height: '100%', background: '#22d3ee', borderRadius: '100px', width: '50%' }} />
        </div>
        <div style={{ height: '4px', flex: 1, background: 'rgba(250, 204, 21, 0.2)', borderRadius: '100px', overflow: 'hidden' }}>
          <div style={{ height: '100%', background: '#facc15', borderRadius: '100px', width: '66%' }} />
        </div>
      </div>
      
      <button
        onClick={(e) => {
          e.stopPropagation()
          navigate(`/editor/${project.id}`)
        }}
        style={mainBtnStyle}
        onMouseEnter={() => setOpenBtnHover(true)}
        onMouseLeave={() => setOpenBtnHover(false)}
      >
        <ExternalLink style={{ width: '16px', height: '16px' }} />
        Open Project
      </button>
    </div>
  )
}
