import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Plus, Search, Grid3X3, List, Folder, ChevronRight, ChevronDown,
  Sparkles, TrendingUp, GitFork, Clock, Users, X, ArrowUpDown, ArrowRight, Globe, Trash2, Play
} from 'lucide-react'
import { Navbar } from '../components/Navbar'
import { ProjectCard } from '../components/ProjectCard'
import { useAuth } from '../context/AuthContext'
import { projectService } from '../services/projectService'

// Tab definitions
const TABS = {
  MY_PROJECTS: 'my-projects',
  FORKED: 'forked',
}

export const Dashboard = () => {
  const { user, profile, needsUsername } = useAuth()
  const navigate = useNavigate()
  
  // Main state
  const [activeTab, setActiveTab] = useState(TABS.MY_PROJECTS)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState('grid')
  const [sortBy, setSortBy] = useState('recent')
  
  // Projects state
  const [myProjects, setMyProjects] = useState([])
  const [forkedProjects, setForkedProjects] = useState([])
  const [recentProjects, setRecentProjects] = useState([])
  
  // UI state
  const [showModal, setShowModal] = useState(false)
  const [newProjectTitle, setNewProjectTitle] = useState('')
  const [recentCollapsed, setRecentCollapsed] = useState(() => {
    return localStorage.getItem('bumuo-recent-collapsed') === 'true'
  })
  const [showSortDropdown, setShowSortDropdown] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, projectId: null, projectTitle: '' })
  const [deleting, setDeleting] = useState(false)
  
  // Tab indicator animation
  const tabRefs = useRef({})
  const [tabIndicatorStyle, setTabIndicatorStyle] = useState({})

  // Load projects on mount and user change
  useEffect(() => {
    if (user && !needsUsername) {
      loadAllData()
    }
  }, [user, needsUsername])

  // Update tab indicator position
  useEffect(() => {
    const activeTabRef = tabRefs.current[activeTab]
    if (activeTabRef) {
      setTabIndicatorStyle({
        left: activeTabRef.offsetLeft,
        width: activeTabRef.offsetWidth,
      })
    }
  }, [activeTab])

  // Save collapsed state
  useEffect(() => {
    localStorage.setItem('bumuo-recent-collapsed', recentCollapsed)
  }, [recentCollapsed])

  // Close sort dropdown when clicking outside
  useEffect(() => {
    const handleClick = () => setShowSortDropdown(false)
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  const loadAllData = async () => {
    setLoading(true)
    try {
      await Promise.all([
        loadMyProjects(),
        loadForkedProjects(),
        loadRecentProjects(),
      ])
    } finally {
      setLoading(false)
    }
  }

  const loadMyProjects = async () => {
    const { data, error } = await projectService.getOriginalProjects(user.id)
    if (!error && data) {
      setMyProjects(data)
    }
  }

  const loadForkedProjects = async () => {
    const { data, error } = await projectService.getForkedProjects(user.id)
    if (!error && data) {
      setForkedProjects(data)
    }
  }

  const loadRecentProjects = async () => {
    const { data, error } = await projectService.getRecentProjects(user.id, 8)
    if (!error && data) {
      setRecentProjects(data)
    }
  }

  const handleCreateProject = async (e) => {
    e.preventDefault()
    if (!newProjectTitle.trim()) return

    const { data, error } = await projectService.createProject(user.id, newProjectTitle)
    
    if (!error && data) {
      setMyProjects([data, ...myProjects])
      setRecentProjects([data, ...recentProjects.slice(0, 7)])
      setNewProjectTitle('')
      setShowModal(false)
    }
  }

  const handleDeleteProject = (id, title) => {
    setDeleteConfirm({ show: true, projectId: id, projectTitle: title })
  }

  const confirmDelete = async () => {
    if (!deleteConfirm.projectId) return
    
    setDeleting(true)
    const { error } = await projectService.deleteProject(deleteConfirm.projectId)
    
    if (!error) {
      setMyProjects(myProjects.filter(p => p.id !== deleteConfirm.projectId))
      setForkedProjects(forkedProjects.filter(p => p.id !== deleteConfirm.projectId))
      setRecentProjects(recentProjects.filter(p => p.id !== deleteConfirm.projectId))
    }
    
    setDeleting(false)
    setDeleteConfirm({ show: false, projectId: null, projectTitle: '' })
  }

  const handleVisibilityToggle = async (id, isPublic) => {
    const { data, error } = await projectService.toggleVisibility(id, isPublic)
    
    if (!error && data) {
      // Update all project lists
      const updateProject = (projects) => 
        projects.map(p => p.id === id ? { ...p, is_public: isPublic } : p)
      
      setMyProjects(updateProject(myProjects))
      setRecentProjects(updateProject(recentProjects))
    }
    
    return { error }
  }

  // Filter projects based on search
  const getFilteredProjects = () => {
    const query = searchQuery.toLowerCase()
    switch (activeTab) {
      case TABS.MY_PROJECTS:
        return myProjects.filter(p => p.title.toLowerCase().includes(query))
      case TABS.FORKED:
        return forkedProjects.filter(p => p.title.toLowerCase().includes(query))
      default:
        return []
    }
  }

  const filteredProjects = getFilteredProjects()

  // Get tab counts
  const tabCounts = {
    [TABS.MY_PROJECTS]: myProjects.length,
    [TABS.FORKED]: forkedProjects.length,
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-surface-950)' }}>
      <Navbar />
      
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Welcome Header */}
        <div style={headerContainerStyle}>
          <div style={{ animation: 'fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }}>
            <h1 style={welcomeHeadingStyle}>
              Welcome back{profile?.username ? `, @${profile.username}` : ''}
            </h1>
            <p style={welcomeSubheadingStyle}>
              Create, explore, and share your projects with the community
            </p>
          </div>
          
          <button
            onClick={() => setShowModal(true)}
            style={createButtonStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(59, 130, 246, 0.4)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(59, 130, 246, 0.25)'
            }}
          >
            <Plus style={{ width: '20px', height: '20px' }} />
            New Project
          </button>
        </div>

        {/* Recent Activity Section */}
        {recentProjects.length > 0 && (
          <RecentActivitySection
            projects={recentProjects}
            collapsed={recentCollapsed}
            onToggleCollapse={() => setRecentCollapsed(!recentCollapsed)}
            onDelete={handleDeleteProject}
            onVisibilityToggle={handleVisibilityToggle}
          />
        )}

        {/* Community Banner Notice */}
        <Link to="/community" style={communityBannerStyle}>
          <div style={communityBannerContentStyle}>
            <div style={communityBannerIconStyle}>
              <Globe style={{ width: '20px', height: '20px', color: 'var(--color-primary-400)' }} />
            </div>
            <div style={communityBannerTextStyle}>
              <span style={communityBannerTitleStyle}>Explore the Community</span>
              <span style={communityBannerDescStyle}>Discover amazing projects built by developers worldwide</span>
            </div>
          </div>
          <div style={communityBannerArrowStyle}>
            <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-primary-400)' }}>View Community</span>
            <ArrowRight style={{ width: '16px', height: '16px', color: 'var(--color-primary-400)' }} />
          </div>
        </Link>

        {/* Try for Free Banner - Opens playground editor */}
        <div 
          onClick={() => navigate('/editor/playground')} 
          style={tryFreeBannerStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.4)'
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(139, 92, 246, 0.15)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.2)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          <div style={tryFreeBannerContentStyle}>
            <div style={tryFreeBannerIconStyle}>
              <Play style={{ width: '20px', height: '20px', color: '#a78bfa' }} />
            </div>
            <div style={communityBannerTextStyle}>
              <span style={tryFreeBannerTitleStyle}>Try the Playground</span>
              <span style={tryFreeBannerDescStyle}>Start coding instantly — no signup required</span>
            </div>
          </div>
          <div style={communityBannerArrowStyle}>
            <span style={{ fontSize: '14px', fontWeight: 500, color: '#a78bfa' }}>Open Editor</span>
            <ArrowRight style={{ width: '16px', height: '16px', color: '#a78bfa' }} />
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={tabContainerStyle}>
          <div style={tabBarStyle}>
            {[
              { id: TABS.MY_PROJECTS, label: 'My Projects', icon: Folder },
              { id: TABS.FORKED, label: 'Forked', icon: GitFork },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                ref={el => tabRefs.current[id] = el}
                onClick={() => setActiveTab(id)}
                style={{
                  ...tabButtonStyle,
                  color: activeTab === id ? '#ffffff' : 'var(--color-surface-400)',
                }}
              >
                <Icon style={{ width: '16px', height: '16px' }} />
                {label}
                <span style={{
                  ...tabCountStyle,
                  background: activeTab === id 
                    ? 'rgba(59, 130, 246, 0.2)' 
                    : 'rgba(255, 255, 255, 0.06)',
                  color: activeTab === id 
                    ? 'var(--color-primary-400)' 
                    : 'var(--color-surface-500)',
                }}>
                  {tabCounts[id]}
                </span>
              </button>
            ))}
            
            {/* Animated tab indicator */}
            <div style={{
              ...tabIndicatorBaseStyle,
              ...tabIndicatorStyle,
            }} />
          </div>
        </div>

        {/* Search and Controls */}
        <div style={controlsContainerStyle}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
            <Search style={searchIconStyle} />
            <input
              type="text"
              placeholder="Search your projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={searchInputStyle}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(59, 130, 246, 0.5)'
                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.15)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.06)'
                e.target.style.boxShadow = 'none'
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={clearSearchBtnStyle}
              >
                <X style={{ width: '14px', height: '14px' }} />
              </button>
            )}
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* View mode toggle */}
            <div style={viewToggleContainerStyle}>
              <button
                onClick={() => setViewMode('grid')}
                style={{
                  ...viewToggleButtonStyle,
                  background: viewMode === 'grid' ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                  color: viewMode === 'grid' ? 'var(--color-primary-400)' : 'var(--color-surface-500)',
                }}
              >
                <Grid3X3 style={{ width: '18px', height: '18px' }} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                style={{
                  ...viewToggleButtonStyle,
                  background: viewMode === 'list' ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                  color: viewMode === 'list' ? 'var(--color-primary-400)' : 'var(--color-surface-500)',
                }}
              >
                <List style={{ width: '18px', height: '18px' }} />
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div style={{ animation: 'fade-in 0.3s ease' }}>
          {loading ? (
            <LoadingState />
          ) : activeTab === TABS.MY_PROJECTS ? (
            <MyProjectsContent
              projects={filteredProjects}
              viewMode={viewMode}
              onDelete={handleDeleteProject}
              onVisibilityToggle={handleVisibilityToggle}
              onCreateNew={() => setShowModal(true)}
              searchQuery={searchQuery}
              onClearSearch={() => setSearchQuery('')}
            />
          ) : (
            <ForkedProjectsContent
              projects={filteredProjects}
              viewMode={viewMode}
              onDelete={handleDeleteProject}
              onVisibilityToggle={handleVisibilityToggle}
              searchQuery={searchQuery}
              onClearSearch={() => setSearchQuery('')}
            />
          )}
        </div>
      </div>

      {/* Create Project Modal */}
      {showModal && (
        <CreateProjectModal
          title={newProjectTitle}
          onTitleChange={setNewProjectTitle}
          onSubmit={handleCreateProject}
          onClose={() => {
            setShowModal(false)
            setNewProjectTitle('')
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <DeleteConfirmModal
          projectTitle={deleteConfirm.projectTitle}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteConfirm({ show: false, projectId: null, projectTitle: '' })}
          isDeleting={deleting}
        />
      )}
    </div>
  )
}

// ============================================
// SUB-COMPONENTS
// ============================================

const RecentActivitySection = ({ projects, collapsed, onToggleCollapse, onDelete, onVisibilityToggle }) => {
  return (
    <div style={recentSectionStyle}>
      <button 
        onClick={onToggleCollapse}
        style={recentHeaderStyle}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={recentIconStyle}>
            <Clock style={{ width: '16px', height: '16px', color: 'var(--color-primary-400)' }} />
          </div>
          <span style={{ fontWeight: 600, color: '#ffffff', fontSize: '15px' }}>Recent Activity</span>
          <span style={recentCountStyle}>{projects.length}</span>
        </div>
        {collapsed ? (
          <ChevronRight style={{ width: '20px', height: '20px', color: 'var(--color-surface-500)' }} />
        ) : (
          <ChevronDown style={{ width: '20px', height: '20px', color: 'var(--color-surface-500)' }} />
        )}
      </button>
      
      {!collapsed && (
        <div style={recentScrollContainerStyle}>
          {projects.map((project, index) => (
            <div 
              key={project.id} 
              style={{ 
                minWidth: '280px', 
                maxWidth: '280px',
                animation: `fade-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.05}s both`,
              }}
            >
              <ProjectCard
                project={project}
                onDelete={onDelete}
                onVisibilityToggle={onVisibilityToggle}
                viewMode="grid"
                compact
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const MyProjectsContent = ({ projects, viewMode, onDelete, onVisibilityToggle, onCreateNew, searchQuery, onClearSearch }) => {
  if (projects.length === 0 && !searchQuery) {
    return (
      <EmptyState
        icon={Folder}
        title="No projects yet"
        description="Create your first project and start coding with HTML, CSS, and JavaScript"
        actionLabel="Create Your First Project"
        onAction={onCreateNew}
      />
    )
  }

  if (projects.length === 0 && searchQuery) {
    return <NoResultsState searchQuery={searchQuery} onClear={onClearSearch} />
  }

  return (
    <ProjectGrid 
      projects={projects} 
      viewMode={viewMode}
      onDelete={onDelete}
      onVisibilityToggle={onVisibilityToggle}
    />
  )
}

const ForkedProjectsContent = ({ projects, viewMode, onDelete, onVisibilityToggle, searchQuery, onClearSearch }) => {
  if (projects.length === 0 && !searchQuery) {
    return (
      <EmptyState
        icon={GitFork}
        title="No forked projects"
        description="Explore the community page to discover and fork interesting projects"
        actionLabel={null}
      />
    )
  }

  if (projects.length === 0 && searchQuery) {
    return <NoResultsState searchQuery={searchQuery} onClear={onClearSearch} />
  }

  return (
    <ProjectGrid 
      projects={projects} 
      viewMode={viewMode}
      onDelete={onDelete}
      onVisibilityToggle={onVisibilityToggle}
      showForkSource
    />
  )
}

const ProjectGrid = ({ projects, viewMode, onDelete, onVisibilityToggle, showForkSource = false }) => (
  <>
    <p style={{ fontSize: '14px', color: 'var(--color-surface-500)', marginBottom: '16px' }}>
      {projects.length} project{projects.length !== 1 ? 's' : ''}
    </p>
    <div style={{
      display: 'grid',
      gridTemplateColumns: viewMode === 'grid' 
        ? 'repeat(auto-fill, minmax(300px, 1fr))' 
        : '1fr',
      gap: viewMode === 'grid' ? '24px' : '12px',
    }}>
      {projects.map((project, index) => (
        <div 
          key={project.id}
          style={{ animation: `fade-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.03}s both` }}
        >
          <ProjectCard
            project={project}
            onDelete={onDelete}
            onVisibilityToggle={onVisibilityToggle}
            viewMode={viewMode}
            showForkSource={showForkSource}
          />
        </div>
      ))}
    </div>
  </>
)

const EmptyState = ({ icon: Icon, title, description, actionLabel, onAction }) => (
  <div style={emptyStateStyle}>
    <div style={emptyIconContainerStyle}>
      <Icon style={{ width: '40px', height: '40px', color: 'var(--color-surface-500)' }} />
    </div>
    <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>
      {title}
    </h3>
    <p style={emptyDescriptionStyle}>
      {description}
    </p>
    {actionLabel && (
      <button onClick={onAction} style={emptyActionButtonStyle}>
        <Plus style={{ width: '20px', height: '20px' }} />
        {actionLabel}
      </button>
    )}
  </div>
)

const NoResultsState = ({ searchQuery, onClear }) => (
  <div style={emptyStateStyle}>
    <div style={emptyIconContainerStyle}>
      <Search style={{ width: '36px', height: '36px', color: 'var(--color-surface-500)' }} />
    </div>
    <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>
      No matches found
    </h3>
    <p style={emptyDescriptionStyle}>
      No projects match "{searchQuery}"
    </p>
    <button onClick={onClear} style={clearSearchActionStyle}>
      Clear search
    </button>
  </div>
)

const LoadingState = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <div key={i} style={skeletonCardStyle}>
        <div style={{ ...skeletonStyle, height: '160px', marginBottom: '16px' }} />
        <div style={{ ...skeletonStyle, height: '20px', width: '70%', marginBottom: '8px' }} />
        <div style={{ ...skeletonStyle, height: '16px', width: '40%' }} />
      </div>
    ))}
  </div>
)

const CreateProjectModal = ({ title, onTitleChange, onSubmit, onClose }) => (
  <div 
    style={modalOverlayStyle}
    onClick={(e) => e.target === e.currentTarget && onClose()}
  >
    <div style={modalContentStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px' }}>
        <div style={modalIconStyle}>
          <Sparkles style={{ width: '24px', height: '24px', color: 'var(--color-primary-400)' }} />
        </div>
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#ffffff', margin: 0 }}>
          Create New Project
        </h2>
      </div>
      
      <form onSubmit={onSubmit}>
        <div style={{ marginBottom: '28px' }}>
          <label style={modalLabelStyle}>
            Project Name
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="My Awesome Project"
            autoFocus
            style={modalInputStyle}
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
          <button type="button" onClick={onClose} style={modalCancelBtnStyle}>
            Cancel
          </button>
          <button
            type="submit"
            disabled={!title.trim()}
            style={{
              ...modalSubmitBtnStyle,
              opacity: title.trim() ? 1 : 0.5,
              cursor: title.trim() ? 'pointer' : 'not-allowed',
            }}
          >
            Create Project
          </button>
        </div>
      </form>
    </div>
  </div>
)

const DeleteConfirmModal = ({ projectTitle, onConfirm, onCancel, isDeleting }) => (
  <div 
    style={modalOverlayStyle}
    onClick={(e) => e.target === e.currentTarget && !isDeleting && onCancel()}
  >
    <div style={modalContentStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
        <div style={{ 
          ...modalIconStyle, 
          background: 'rgba(244, 63, 94, 0.15)', 
          border: '1px solid rgba(244, 63, 94, 0.2)' 
        }}>
          <Trash2 style={{ width: '24px', height: '24px', color: '#fb7185' }} />
        </div>
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#ffffff', margin: 0 }}>
          Delete Project
        </h2>
      </div>
      
      <p style={{ 
        color: 'var(--color-surface-400)', 
        fontSize: '15px', 
        lineHeight: 1.6,
        marginBottom: '8px' 
      }}>
        Are you sure you want to delete{' '}
        <span style={{ color: '#ffffff', fontWeight: 600 }}>"{projectTitle}"</span>?
      </p>
      <p style={{ 
        color: 'var(--color-surface-500)', 
        fontSize: '14px', 
        marginBottom: '28px' 
      }}>
        This action cannot be undone. All code and settings will be permanently removed.
      </p>
      
      <div style={{ display: 'flex', gap: '12px' }}>
        <button 
          type="button" 
          onClick={onCancel} 
          disabled={isDeleting}
          style={{
            ...modalCancelBtnStyle,
            opacity: isDeleting ? 0.5 : 1,
            cursor: isDeleting ? 'not-allowed' : 'pointer',
          }}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isDeleting}
          style={{
            flex: 1,
            padding: '14px',
            background: isDeleting 
              ? 'rgba(244, 63, 94, 0.5)' 
              : 'linear-gradient(135deg, #e11d48 0%, #f43f5e 100%)',
            border: 'none',
            borderRadius: '12px',
            color: '#ffffff',
            fontWeight: 600,
            fontSize: '15px',
            cursor: isDeleting ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: isDeleting ? 'none' : '0 4px 14px rgba(244, 63, 94, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          {isDeleting ? (
            <>
              <div style={{
                width: '16px',
                height: '16px',
                border: '2px solid rgba(255,255,255,0.3)',
                borderTopColor: '#ffffff',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }} />
              Deleting...
            </>
          ) : (
            <>
              <Trash2 style={{ width: '16px', height: '16px' }} />
              Delete Project
            </>
          )}
        </button>
      </div>
    </div>
  </div>
)

// ============================================
// STYLES
// ============================================

const headerContainerStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: '24px',
  marginBottom: '40px',
}

const welcomeHeadingStyle = {
  fontSize: '28px',
  fontWeight: 700,
  color: '#ffffff',
  marginBottom: '8px',
  letterSpacing: '-0.025em',
}

const welcomeSubheadingStyle = {
  color: 'var(--color-surface-400)',
  fontSize: '15px',
  margin: 0,
}

const createButtonStyle = {
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

// Community Banner styles
const communityBannerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '20px',
  padding: '18px 24px',
  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%)',
  border: '1px solid rgba(59, 130, 246, 0.2)',
  borderRadius: '16px',
  marginBottom: '28px',
  textDecoration: 'none',
  transition: 'all 0.3s ease',
  animation: 'fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both',
}

const communityBannerContentStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
}

const communityBannerIconStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '44px',
  height: '44px',
  background: 'rgba(59, 130, 246, 0.15)',
  borderRadius: '12px',
  border: '1px solid rgba(59, 130, 246, 0.2)',
  flexShrink: 0,
}

const communityBannerTextStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
}

const communityBannerTitleStyle = {
  fontSize: '16px',
  fontWeight: 600,
  color: '#ffffff',
}

const communityBannerDescStyle = {
  fontSize: '14px',
  color: 'var(--color-surface-400)',
}

const communityBannerArrowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  flexShrink: 0,
}

// Try for Free Banner styles
const tryFreeBannerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '20px',
  padding: '18px 24px',
  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(168, 85, 247, 0.08) 100%)',
  border: '1px solid rgba(139, 92, 246, 0.2)',
  borderRadius: '16px',
  marginBottom: '28px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  animation: 'fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both',
}

const tryFreeBannerContentStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
}

const tryFreeBannerIconStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '44px',
  height: '44px',
  background: 'rgba(139, 92, 246, 0.15)',
  borderRadius: '12px',
  border: '1px solid rgba(139, 92, 246, 0.2)',
  flexShrink: 0,
}

const tryFreeBannerTitleStyle = {
  fontSize: '16px',
  fontWeight: 600,
  color: '#ffffff',
}

const tryFreeBannerDescStyle = {
  fontSize: '14px',
  color: 'var(--color-surface-400)',
}

// Recent Activity styles
const recentSectionStyle = {
  background: 'var(--color-surface-850)',
  border: '1px solid rgba(255, 255, 255, 0.06)',
  borderRadius: '16px',
  marginBottom: '32px',
  overflow: 'hidden',
  animation: 'fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both',
}

const recentHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  padding: '16px 20px',
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  transition: 'background 0.2s ease',
}

const recentIconStyle = {
  padding: '8px',
  background: 'rgba(59, 130, 246, 0.15)',
  borderRadius: '10px',
}

const recentCountStyle = {
  padding: '2px 8px',
  background: 'rgba(255, 255, 255, 0.06)',
  borderRadius: '6px',
  fontSize: '12px',
  fontWeight: 600,
  color: 'var(--color-surface-400)',
}

const recentScrollContainerStyle = {
  display: 'flex',
  gap: '16px',
  padding: '0 20px 20px 20px',
  overflowX: 'auto',
  scrollbarWidth: 'thin',
}

// Tab styles
const tabContainerStyle = {
  marginBottom: '24px',
  animation: 'fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both',
}

const tabBarStyle = {
  display: 'flex',
  gap: '8px',
  position: 'relative',
  padding: '4px',
  background: 'var(--color-surface-850)',
  borderRadius: '14px',
  border: '1px solid rgba(255, 255, 255, 0.06)',
}

const tabButtonStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '12px 20px',
  background: 'transparent',
  border: 'none',
  borderRadius: '10px',
  fontWeight: 500,
  fontSize: '14px',
  cursor: 'pointer',
  transition: 'color 0.2s ease',
  position: 'relative',
  zIndex: 1,
}

const tabCountStyle = {
  padding: '2px 8px',
  borderRadius: '6px',
  fontSize: '12px',
  fontWeight: 600,
  transition: 'all 0.2s ease',
}

const tabIndicatorBaseStyle = {
  position: 'absolute',
  bottom: '4px',
  height: 'calc(100% - 8px)',
  background: 'rgba(59, 130, 246, 0.15)',
  borderRadius: '10px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
}

// Controls styles
const controlsContainerStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '16px',
  marginBottom: '28px',
  alignItems: 'center',
  justifyContent: 'space-between',
  animation: 'fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both',
}

const searchIconStyle = {
  position: 'absolute',
  left: '14px',
  top: '50%',
  transform: 'translateY(-50%)',
  width: '18px',
  height: '18px',
  color: 'var(--color-surface-500)',
}

const searchInputStyle = {
  width: '100%',
  padding: '12px 40px 12px 44px',
  background: 'var(--color-surface-850)',
  border: '1px solid rgba(255, 255, 255, 0.06)',
  borderRadius: '12px',
  color: '#ffffff',
  fontSize: '15px',
  outline: 'none',
  transition: 'all 0.2s ease',
}

const clearSearchBtnStyle = {
  position: 'absolute',
  right: '12px',
  top: '50%',
  transform: 'translateY(-50%)',
  padding: '4px',
  background: 'var(--color-surface-700)',
  border: 'none',
  borderRadius: '6px',
  color: 'var(--color-surface-400)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const sortButtonStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '10px 16px',
  background: 'var(--color-surface-850)',
  border: '1px solid rgba(255, 255, 255, 0.06)',
  borderRadius: '12px',
  color: 'var(--color-surface-300)',
  fontWeight: 500,
  fontSize: '14px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
}

const sortDropdownStyle = {
  position: 'absolute',
  top: '100%',
  right: 0,
  marginTop: '8px',
  background: 'var(--color-surface-800)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '12px',
  padding: '8px',
  minWidth: '180px',
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
  zIndex: 10,
  animation: 'scale-in 0.2s ease',
}

const sortOptionStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  width: '100%',
  padding: '10px 14px',
  background: 'transparent',
  border: 'none',
  borderRadius: '8px',
  fontSize: '14px',
  cursor: 'pointer',
  textAlign: 'left',
  transition: 'all 0.2s ease',
}

const viewToggleContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  padding: '4px',
  background: 'var(--color-surface-850)',
  borderRadius: '12px',
  border: '1px solid rgba(255, 255, 255, 0.06)',
}

const viewToggleButtonStyle = {
  padding: '10px',
  borderRadius: '8px',
  border: 'none',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
}

// Empty state styles
const emptyStateStyle = {
  textAlign: 'center',
  padding: '80px 16px',
  animation: 'fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
}

const emptyIconContainerStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '80px',
  height: '80px',
  background: 'var(--color-surface-800)',
  borderRadius: '20px',
  marginBottom: '24px',
  border: '1px solid rgba(255, 255, 255, 0.06)',
}

const emptyDescriptionStyle = {
  color: 'var(--color-surface-400)',
  fontSize: '15px',
  marginBottom: '24px',
  maxWidth: '400px',
  marginLeft: 'auto',
  marginRight: 'auto',
}

const emptyActionButtonStyle = {
  display: 'inline-flex',
  alignItems: 'center',
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

const clearSearchActionStyle = {
  background: 'none',
  border: 'none',
  color: 'var(--color-primary-400)',
  fontWeight: 500,
  fontSize: '14px',
  cursor: 'pointer',
  transition: 'color 0.2s ease',
}

const loadMoreButtonStyle = {
  padding: '12px 32px',
  background: 'var(--color-surface-800)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '12px',
  color: 'var(--color-surface-300)',
  fontWeight: 500,
  fontSize: '15px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
}

// Skeleton styles
const skeletonCardStyle = {
  background: 'var(--color-surface-850)',
  borderRadius: '20px',
  padding: '20px',
  border: '1px solid rgba(255, 255, 255, 0.06)',
}

const skeletonStyle = {
  background: 'linear-gradient(90deg, var(--color-surface-700) 0%, var(--color-surface-600) 50%, var(--color-surface-700) 100%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 1.5s infinite',
  borderRadius: '8px',
}

// Modal styles
const modalOverlayStyle = {
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
  animation: 'fade-in 0.2s ease',
}

const modalContentStyle = {
  background: 'rgba(18, 18, 28, 0.95)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '20px',
  padding: '32px',
  maxWidth: '420px',
  width: '100%',
  boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
  animation: 'scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
}

const modalIconStyle = {
  padding: '12px',
  background: 'rgba(59, 130, 246, 0.15)',
  borderRadius: '14px',
  border: '1px solid rgba(59, 130, 246, 0.2)',
}

const modalLabelStyle = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 500,
  color: 'var(--color-surface-300)',
  marginBottom: '10px',
}

const modalInputStyle = {
  width: '100%',
  padding: '14px 16px',
  background: 'var(--color-surface-800)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '12px',
  color: '#ffffff',
  fontSize: '15px',
  outline: 'none',
  transition: 'all 0.2s ease',
}

const modalCancelBtnStyle = {
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
}

const modalSubmitBtnStyle = {
  flex: 1,
  padding: '14px',
  background: 'linear-gradient(135deg, var(--color-primary-600) 0%, var(--color-primary-500) 100%)',
  border: 'none',
  borderRadius: '12px',
  color: '#ffffff',
  fontWeight: 600,
  fontSize: '15px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
}
