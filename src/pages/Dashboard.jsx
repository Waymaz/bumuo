import { useState, useEffect } from 'react'
import { Plus, Code2, Sparkles } from 'lucide-react'
import { Navbar } from '../components/Navbar'
import { ProjectCard } from '../components/ProjectCard'
import { useAuth } from '../context/AuthContext'
import { projectService } from '../services/projectService'

export const Dashboard = () => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [newProjectTitle, setNewProjectTitle] = useState('')
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
    if (!confirm('Are you sure you want to delete this project?')) return

    const { error } = await projectService.deleteProject(id)
    
    if (!error) {
      setProjects(projects.filter(p => p.id !== id))
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0e14' }}>
      <Navbar />
      
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '3rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}>My Projects</h1>
            <p style={{ color: '#9ca3af', fontSize: '1rem' }}>Create and manage your coding projects</p>
          </div>
          
          <button
            onClick={() => setShowModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '0.75rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.background = '#2563eb'}
            onMouseOut={(e) => e.currentTarget.style.background = '#3b82f6'}
          >
            <Plus style={{ width: '1.25rem', height: '1.25rem' }} />
            New Project
          </button>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '8rem 0' }}>
            <div style={{ position: 'relative' }}>
              <div style={{ width: '4rem', height: '4rem', border: '3px solid transparent', borderTopColor: '#3b82f6', borderBottomColor: '#3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            </div>
            <p style={{ marginTop: '1.5rem', color: '#9ca3af' }}>Loading your projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '8rem 0' }}>
            <Code2 style={{ width: '6rem', height: '6rem', color: '#4b5563', margin: '0 auto 1.5rem' }} />
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white', marginBottom: '0.75rem' }}>No projects yet</h3>
            <p style={{ color: '#9ca3af', fontSize: '1.125rem', marginBottom: '2rem' }}>Create your first project and start coding</p>
            <button
              onClick={() => setShowModal(true)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
            >
              <Plus style={{ width: '1.25rem', height: '1.25rem' }} />
              Create Project
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onDelete={handleDeleteProject}
              />
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', zIndex: 50 }}>
          <div style={{ background: '#151a21', border: '1px solid #1f2937', borderRadius: '1rem', padding: '2rem', maxWidth: '28rem', width: '100%', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <Sparkles style={{ width: '1.5rem', height: '1.5rem', color: '#60a5fa' }} />
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>Create New Project</h2>
            </div>
            
            <form onSubmit={handleCreateProject} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#d1d5db', marginBottom: '0.5rem' }}>
                  Project Name
                </label>
                <input
                  type="text"
                  value={newProjectTitle}
                  onChange={(e) => setNewProjectTitle(e.target.value)}
                  placeholder="My Awesome Project"
                  style={{ width: '100%', padding: '0.75rem 1rem', background: '#0f1419', border: '1px solid #1f2937', borderRadius: '0.75rem', color: 'white', fontSize: '1rem' }}
                  autoFocus
                />
              </div>
              
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{ flex: 1, padding: '0.75rem', background: '#1a1f2e', color: 'white', border: '1px solid #1f2937', borderRadius: '0.75rem', fontWeight: 500, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ flex: 1, padding: '0.75rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        input::placeholder {
          color: #6b7280 !important;
        }
        input:focus {
          outline: none;
          border-color: #3b82f6 !important;
        }
      `}</style>
    </div>
  )
}
