import { useState, useEffect } from 'react'
import { Plus, Code2, Sparkles, Search, Grid3X3, List, Folder, X } from 'lucide-react'
import { Navbar } from '../components/Navbar'
import { ProjectCard } from '../components/ProjectCard'
import { useAuth } from '../context/AuthContext'
import { projectService } from '../services/projectService'

export const Dashboard = () => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [newProjectTitle, setNewProjectTitle] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState('grid')
  const { user } = useAuth()

  useEffect(() => {
    loadProjects()
  }, [user])

  const loadProjects = async () => {
    if (!user) return
    
    const { data, error } = await projectService.getProjects(user.id)
    if (!error && data) {
      setProjects(data)
    }
    setLoading(false)
  }

  const handleCreateProject = async (e) => {
    e.preventDefault()
    if (!newProjectTitle.trim()) return

    const { data, error } = await projectService.createProject(user.id, newProjectTitle)
    
    if (!error && data) {
      setProjects([data, ...projects])
      setNewProjectTitle('')
      setShowModal(false)
    }
  }

  const handleDeleteProject = async (id) => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) return

    const { error } = await projectService.deleteProject(id)
    
    if (!error) {
      setProjects(projects.filter(p => p.id !== id))
    }
  }

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Shared styles
  const buttonPrimaryStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px 20px',
    background: 'linear-gradient(135deg, var(--color-primary-600) 0%, var(--color-primary-500) 100%)',
    color: '#ffffff',
    borderRadius: '12px',
    fontWeight: 600,
    fontSize: '15px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 14px rgba(59, 130, 246, 0.25)',
  }

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    paddingLeft: '44px',
    background: 'var(--color-surface-850)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '12px',
    color: '#ffffff',
    fontSize: '15px',
    outline: 'none',
    transition: 'all 0.2s ease',
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-surface-950)' }}>
      <Navbar />
      
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Header */}
        <div 
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '24px',
            marginBottom: '40px',
          }}
        >
          <div style={{ animation: 'fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }}>
            <h1 
              style={{
                fontSize: '28px',
                fontWeight: 700,
                color: '#ffffff',
                marginBottom: '8px',
                letterSpacing: '-0.025em',
              }}
            >
              My Projects
            </h1>
            <p style={{ color: 'var(--color-surface-400)', fontSize: '15px', margin: 0 }}>
              Create and manage your coding projects
            </p>
          </div>
          
          <button
            onClick={() => setShowModal(true)}
            style={buttonPrimaryStyle}
            onMouseEnter={(e) => {
              e.target.style.background = 'linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-primary-400) 100%)'
              e.target.style.transform = 'translateY(-2px)'
              e.target.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.35)'
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'linear-gradient(135deg, var(--color-primary-600) 0%, var(--color-primary-500) 100%)'
              e.target.style.transform = 'translateY(0)'
              e.target.style.boxShadow = '0 4px 14px rgba(59, 130, 246, 0.25)'
            }}
          >
            <Plus style={{ width: '20px', height: '20px' }} />
            New Project
          </button>
        </div>

        {/* Search and View Controls */}
        {projects.length > 0 && (
          <div 
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '16px',
              marginBottom: '28px',
              animation: 'fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both',
            }}
          >
            <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
              <Search 
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
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(59, 130, 246, 0.5)'
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.15)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.06)'
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px',
                background: 'var(--color-surface-850)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.06)',
              }}
            >
              <button
                onClick={() => setViewMode('grid')}
                style={{
                  padding: '10px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: viewMode === 'grid' ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                  color: viewMode === 'grid' ? 'var(--color-primary-400)' : 'var(--color-surface-500)',
                }}
                title="Grid view"
              >
                <Grid3X3 style={{ width: '18px', height: '18px' }} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                style={{
                  padding: '10px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: viewMode === 'list' ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                  color: viewMode === 'list' ? 'var(--color-primary-400)' : 'var(--color-surface-500)',
                }}
                title="List view"
              >
                <List style={{ width: '18px', height: '18px' }} />
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div 
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '80px 0',
            }}
          >
            <div 
              style={{
                width: '56px',
                height: '56px',
                border: '4px solid var(--color-surface-700)',
                borderTopColor: 'var(--color-primary-500)',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }}
            />
            <p style={{ marginTop: '24px', color: 'var(--color-surface-400)', fontWeight: 500 }}>
              Loading your projects...
            </p>
          </div>
        ) : projects.length === 0 ? (
          <div 
            style={{
              textAlign: 'center',
              padding: '80px 16px',
              animation: 'fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <div 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '88px',
                height: '88px',
                background: 'var(--color-surface-800)',
                borderRadius: '20px',
                marginBottom: '24px',
                border: '1px solid rgba(255, 255, 255, 0.06)',
              }}
            >
              <Folder style={{ width: '40px', height: '40px', color: 'var(--color-surface-500)' }} />
            </div>
            <h3 
              style={{
                fontSize: '22px',
                fontWeight: 700,
                color: '#ffffff',
                marginBottom: '12px',
              }}
            >
              No projects yet
            </h3>
            <p 
              style={{
                color: 'var(--color-surface-400)',
                fontSize: '16px',
                marginBottom: '32px',
                maxWidth: '400px',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              Create your first project and start coding with HTML, CSS, and JavaScript
            </p>
            <button
              onClick={() => setShowModal(true)}
              style={buttonPrimaryStyle}
              onMouseEnter={(e) => {
                e.target.style.background = 'linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-primary-400) 100%)'
                e.target.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'linear-gradient(135deg, var(--color-primary-600) 0%, var(--color-primary-500) 100%)'
                e.target.style.transform = 'translateY(0)'
              }}
            >
              <Plus style={{ width: '20px', height: '20px' }} />
              Create Your First Project
            </button>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div 
            style={{
              textAlign: 'center',
              padding: '80px 16px',
              animation: 'fade-in 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <div 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '80px',
                height: '80px',
                background: 'var(--color-surface-800)',
                borderRadius: '20px',
                marginBottom: '24px',
                border: '1px solid rgba(255, 255, 255, 0.06)',
              }}
            >
              <Search style={{ width: '36px', height: '36px', color: 'var(--color-surface-500)' }} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>
              No matches found
            </h3>
            <p style={{ color: 'var(--color-surface-400)', marginBottom: '16px' }}>
              Try adjusting your search terms
            </p>
            <button
              onClick={() => setSearchQuery('')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-primary-400)',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => e.target.style.color = 'var(--color-primary-300)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--color-primary-400)'}
            >
              Clear search
            </button>
          </div>
        ) : (
          <>
            <p style={{ fontSize: '14px', color: 'var(--color-surface-500)', marginBottom: '16px' }}>
              {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
            </p>
            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: viewMode === 'grid' 
                  ? 'repeat(auto-fill, minmax(300px, 1fr))' 
                  : '1fr',
                gap: viewMode === 'grid' ? '24px' : '12px',
              }}
            >
              {filteredProjects.map((project, index) => (
                <div 
                  key={project.id} 
                  style={{ 
                    animation: `fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.05}s both` 
                  }}
                >
                  <ProjectCard
                    project={project}
                    onDelete={handleDeleteProject}
                    viewMode={viewMode}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Create Project Modal */}
      {showModal && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            zIndex: 50,
          }}
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <div 
            style={{
              background: 'rgba(18, 18, 28, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '32px',
              maxWidth: '420px',
              width: '100%',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
              animation: 'scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px' }}>
              <div 
                style={{
                  padding: '12px',
                  background: 'rgba(59, 130, 246, 0.15)',
                  borderRadius: '14px',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                }}
              >
                <Sparkles style={{ width: '24px', height: '24px', color: 'var(--color-primary-400)' }} />
              </div>
              <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#ffffff', margin: 0 }}>
                Create New Project
              </h2>
            </div>
            
            <form onSubmit={handleCreateProject}>
              <div style={{ marginBottom: '28px' }}>
                <label 
                  style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: 500,
                    color: 'var(--color-surface-300)',
                    marginBottom: '10px',
                  }}
                >
                  Project Name
                </label>
                <input
                  type="text"
                  value={newProjectTitle}
                  onChange={(e) => setNewProjectTitle(e.target.value)}
                  placeholder="My Awesome Project"
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '14px 16px',
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
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    flex: 1,
                    padding: '14px',
                    background: 'var(--color-surface-700)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '12px',
                    color: 'var(--color-surface-300)',
                    fontWeight: 500,
                    fontSize: '15px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'var(--color-surface-600)'
                    e.target.style.color = '#ffffff'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'var(--color-surface-700)'
                    e.target.style.color = 'var(--color-surface-300)'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newProjectTitle.trim()}
                  style={{
                    flex: 1,
                    padding: '14px',
                    background: newProjectTitle.trim() 
                      ? 'linear-gradient(135deg, var(--color-primary-600) 0%, var(--color-primary-500) 100%)'
                      : 'var(--color-surface-700)',
                    border: 'none',
                    borderRadius: '12px',
                    color: newProjectTitle.trim() ? '#ffffff' : 'var(--color-surface-500)',
                    fontWeight: 600,
                    fontSize: '15px',
                    cursor: newProjectTitle.trim() ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s ease',
                  }}
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
