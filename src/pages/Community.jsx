import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { projectService } from '../services/projectService'
import { CommunityProjectCard } from '../components/CommunityProjectCard'
import { CommunityProjectView } from '../components/CommunityProjectView'
import { 
  Search, Grid3X3, List, Clock, TrendingUp, GitFork, ArrowUpDown,
  X, Users, Code2, Sparkles, Globe, Filter, ChevronDown, ArrowRight,
  Eye, Zap, Flame, Star, Menu, LogIn
} from 'lucide-react'
import bumuoLogo from '../assets/bumuo-logo.png'

// Featured categories
const CATEGORIES = [
  { id: 'all', label: 'All Projects', icon: Globe },
  { id: 'trending', label: 'Trending', icon: Flame },
  { id: 'popular', label: 'Most Popular', icon: TrendingUp },
  { id: 'recent', label: 'Latest', icon: Clock },
  { id: 'most_forked', label: 'Most Forked', icon: GitFork },
]

// Sort options
const SORT_OPTIONS = [
  { value: 'recent', label: 'Most Recent', icon: Clock },
  { value: 'popular', label: 'Most Popular', icon: TrendingUp },
  { value: 'most_forked', label: 'Most Forked', icon: GitFork },
]

export const Community = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  
  // State
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [sortBy, setSortBy] = useState('recent')
  const [viewMode, setViewMode] = useState('grid')
  const [showSortDropdown, setShowSortDropdown] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  
  // Pagination
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  
  // Featured projects for hero
  const [featuredProjects, setFeaturedProjects] = useState([])
  
  // Stats
  const [stats, setStats] = useState({ totalProjects: 0, totalViews: 0, totalForks: 0 })
  
  // Refs
  const searchInputRef = useRef(null)

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClick = () => setShowSortDropdown(false)
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  // Load initial data
  useEffect(() => {
    loadFeaturedProjects()
    loadProjects(true)
  }, [])

  // Reload when filters change
  useEffect(() => {
    if (!loading) {
      loadProjects(true)
    }
  }, [debouncedSearch, sortBy, activeCategory])

  const loadFeaturedProjects = async () => {
    const { data } = await projectService.getCommunityProjects({
      limit: 6,
      offset: 0,
      sortBy: 'popular',
    })
    if (data) {
      setFeaturedProjects(data)
      // Calculate stats
      const totalViews = data.reduce((sum, p) => sum + (p.view_count || 0), 0)
      const totalForks = data.reduce((sum, p) => sum + (p.fork_count || 0), 0)
      setStats({ totalProjects: data.length * 10, totalViews, totalForks })
    }
  }

  const loadProjects = async (reset = false) => {
    if (loadingMore && !reset) return
    
    if (reset) {
      setLoading(true)
      setPage(0)
    } else {
      setLoadingMore(true)
    }
    
    const offset = reset ? 0 : page * 20
    const effectiveSortBy = activeCategory === 'all' ? sortBy 
      : activeCategory === 'trending' ? 'popular'
      : activeCategory === 'popular' ? 'popular'
      : activeCategory === 'most_forked' ? 'most_forked'
      : 'recent'
    
    try {
      const { data, error } = await projectService.getCommunityProjects({
        limit: 20,
        offset,
        sortBy: effectiveSortBy,
        searchQuery: debouncedSearch,
      })
      
      if (!error && data) {
        if (reset) {
          setProjects(data)
          setPage(1)
        } else {
          setProjects(prev => [...prev, ...data])
          setPage(prev => prev + 1)
        }
        setHasMore(data.length === 20)
      }
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const handleForkProject = async (projectId, title) => {
    if (!user) {
      navigate('/login')
      return { error: { message: 'Please log in to fork projects' } }
    }
    
    const newTitle = `${title} (Fork)`
    const { data, error } = await projectService.forkProject(projectId, user.id, newTitle)
    
    if (!error && data) {
      loadProjects(true)
      return { data, error: null }
    }
    
    return { data: null, error }
  }

  const handleProjectClick = (project) => {
    setSelectedProject(project)
  }

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId)
    if (categoryId !== 'all') {
      const sortMap = {
        trending: 'popular',
        popular: 'popular',
        recent: 'recent',
        most_forked: 'most_forked',
      }
      setSortBy(sortMap[categoryId] || 'recent')
    }
  }

  return (
    <div style={pageStyle}>
      {/* Background Effects */}
      <div style={backgroundStyle}>
        <div style={gridOverlayStyle} />
        <div style={gradientOrbStyle} />
        <div style={gradientOrb2Style} />
      </div>

      {/* Navigation */}
      <nav style={{
        ...navStyle,
        background: scrolled ? 'rgba(10, 10, 15, 0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255, 255, 255, 0.06)' : 'none',
      }}>
        <div style={navContainerStyle}>
          <div style={navInnerStyle}>
            {/* Logo */}
            <Link to="/" style={logoStyle}>
              <img 
                src={bumuoLogo} 
                alt="BumuO" 
                style={{ width: '40px', height: '40px', borderRadius: '10px' }} 
              />
              <span style={logoTextStyle}>BumuO</span>
            </Link>

            {/* Desktop Nav */}
            <div style={navLinksStyle}>
              <Link to="/" style={navLinkStyle}>Home</Link>
              <span style={{ ...navLinkStyle, color: 'var(--color-primary-400)' }}>Community</span>
            </div>

            {/* Auth Buttons */}
            <div style={authButtonsStyle}>
              {user ? (
                <Link to="/dashboard" style={dashboardButtonStyle}>
                  Dashboard
                  <ArrowRight size={16} />
                </Link>
              ) : (
                <>
                  <Link to="/login" style={loginButtonStyle}>
                    Sign In
                  </Link>
                  <Link to="/register" style={signupButtonStyle}>
                    Get Started
                    <ArrowRight size={16} />
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={mobileMenuBtnStyle}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div style={mobileMenuStyle}>
              <Link to="/" style={mobileNavLinkStyle} onClick={() => setMobileMenuOpen(false)}>Home</Link>
              <span style={{ ...mobileNavLinkStyle, color: 'var(--color-primary-400)' }}>Community</span>
              <div style={mobileDividerStyle} />
              {user ? (
                <Link to="/dashboard" style={mobileSignupBtnStyle} onClick={() => setMobileMenuOpen(false)}>
                  Dashboard <ArrowRight size={16} />
                </Link>
              ) : (
                <>
                  <Link to="/login" style={mobileNavLinkStyle} onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
                  <Link to="/register" style={mobileSignupBtnStyle} onClick={() => setMobileMenuOpen(false)}>
                    Get Started <ArrowRight size={16} />
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section style={heroSectionStyle}>
        <div style={heroContainerStyle}>
          {/* Badge */}
          <div style={heroBadgeStyle}>
            <Users style={{ width: '14px', height: '14px' }} />
            <span>Community Showcase</span>
            <span style={badgePulseStyle} />
          </div>

          {/* Title */}
          <h1 style={heroTitleStyle}>
            Discover Amazing
            <br />
            <span style={heroGradientStyle}>Projects</span>
          </h1>

          {/* Subtitle */}
          <p style={heroSubtitleStyle}>
            Explore thousands of creative projects built by developers worldwide.
            <br />
            Get inspired, learn, and fork to make them your own.
          </p>

          {/* Search Bar */}
          <div style={heroSearchContainerStyle}>
            <div style={heroSearchStyle}>
              <Search style={heroSearchIconStyle} />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search projects, creators..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={heroSearchInputStyle}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={searchClearBtnStyle}
                >
                  <X style={{ width: '16px', height: '16px' }} />
                </button>
              )}
            </div>
          </div>

          {/* Stats */}
          <div style={statsContainerStyle}>
            <div style={statItemStyle}>
              <Code2 style={{ width: '20px', height: '20px', color: 'var(--color-primary-400)' }} />
              <span style={statValueStyle}>{stats.totalProjects}+</span>
              <span style={statLabelStyle}>Projects</span>
            </div>
            <div style={statDividerStyle} />
            <div style={statItemStyle}>
              <Eye style={{ width: '20px', height: '20px', color: 'var(--color-primary-400)' }} />
              <span style={statValueStyle}>{formatNumber(stats.totalViews)}</span>
              <span style={statLabelStyle}>Views</span>
            </div>
            <div style={statDividerStyle} />
            <div style={statItemStyle}>
              <GitFork style={{ width: '20px', height: '20px', color: 'var(--color-primary-400)' }} />
              <span style={statValueStyle}>{formatNumber(stats.totalForks)}</span>
              <span style={statLabelStyle}>Forks</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main style={mainStyle}>
        <div style={contentContainerStyle}>
          {/* Category Tabs */}
          <div style={categoryContainerStyle}>
            <div style={categoryScrollStyle}>
              {CATEGORIES.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => handleCategoryChange(id)}
                  style={{
                    ...categoryButtonStyle,
                    background: activeCategory === id 
                      ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)'
                      : 'rgba(255, 255, 255, 0.03)',
                    borderColor: activeCategory === id 
                      ? 'rgba(59, 130, 246, 0.4)'
                      : 'rgba(255, 255, 255, 0.06)',
                    color: activeCategory === id ? '#ffffff' : 'var(--color-surface-400)',
                  }}
                >
                  <Icon style={{ width: '16px', height: '16px' }} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Controls Bar */}
          <div style={controlsBarStyle}>
            <div style={controlsLeftStyle}>
              <p style={resultsTextStyle}>
                {loading ? 'Loading...' : `${projects.length} project${projects.length !== 1 ? 's' : ''}`}
              </p>
            </div>

            <div style={controlsRightStyle}>
              {/* Sort Dropdown */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowSortDropdown(!showSortDropdown)
                  }}
                  style={sortButtonStyle}
                >
                  <ArrowUpDown style={{ width: '16px', height: '16px' }} />
                  {SORT_OPTIONS.find(o => o.value === sortBy)?.label}
                  <ChevronDown style={{ 
                    width: '16px', 
                    height: '16px',
                    transform: showSortDropdown ? 'rotate(180deg)' : 'rotate(0)',
                    transition: 'transform 0.2s ease',
                  }} />
                </button>
                
                {showSortDropdown && (
                  <div style={sortDropdownStyle} onClick={e => e.stopPropagation()}>
                    {SORT_OPTIONS.map(({ value, label, icon: Icon }) => (
                      <button
                        key={value}
                        onClick={() => {
                          setSortBy(value)
                          setShowSortDropdown(false)
                        }}
                        style={{
                          ...sortOptionStyle,
                          background: sortBy === value 
                            ? 'rgba(59, 130, 246, 0.15)' 
                            : 'transparent',
                          color: sortBy === value 
                            ? 'var(--color-primary-400)' 
                            : 'var(--color-surface-300)',
                        }}
                      >
                        <Icon style={{ width: '14px', height: '14px' }} />
                        {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* View Toggle */}
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

          {/* Projects Grid */}
          {loading ? (
            <LoadingState viewMode={viewMode} />
          ) : projects.length === 0 ? (
            <EmptyState searchQuery={debouncedSearch} onClear={() => setSearchQuery('')} />
          ) : (
            <>
              <div style={{
                display: 'grid',
                gridTemplateColumns: viewMode === 'grid' 
                  ? 'repeat(auto-fill, minmax(320px, 1fr))' 
                  : '1fr',
                gap: viewMode === 'grid' ? '24px' : '16px',
              }}>
                {projects.map((project, index) => (
                  <div 
                    key={project.id}
                    style={{ 
                      animation: `fade-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.03}s both`,
                    }}
                  >
                    <CommunityProjectCard
                      project={project}
                      onClick={() => handleProjectClick(project)}
                      viewMode={viewMode}
                    />
                  </div>
                ))}
              </div>

              {/* Load More */}
              {hasMore && (
                <div style={loadMoreContainerStyle}>
                  <button
                    onClick={() => loadProjects(false)}
                    disabled={loadingMore}
                    style={loadMoreButtonStyle}
                  >
                    {loadingMore ? (
                      <>
                        <div style={spinnerStyle} />
                        Loading...
                      </>
                    ) : (
                      <>
                        Load More Projects
                        <ChevronDown style={{ width: '18px', height: '18px' }} />
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer style={footerStyle}>
        <div style={footerContainerStyle}>
          <div style={footerLogoStyle}>
            <img 
              src={bumuoLogo} 
              alt="BumuO" 
              style={{ width: '32px', height: '32px', borderRadius: '8px' }} 
            />
            <span style={{ fontWeight: 700, fontSize: '18px', color: '#ffffff' }}>BumuO</span>
          </div>
          <p style={footerTextStyle}>
            © {new Date().getFullYear()} BumuO. Build, Preview, Share.
          </p>
          {!user && (
            <Link to="/register" style={footerCtaStyle}>
              <LogIn style={{ width: '16px', height: '16px' }} />
              Join the Community
            </Link>
          )}
        </div>
      </footer>

      {/* Project View Modal */}
      {selectedProject && (
        <CommunityProjectView
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onFork={handleForkProject}
          currentUserId={user?.id}
        />
      )}
    </div>
  )
}

// Helper function
const formatNumber = (num) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num?.toString() || '0'
}

// Sub-components
const LoadingState = ({ viewMode }) => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: viewMode === 'grid' 
      ? 'repeat(auto-fill, minmax(320px, 1fr))' 
      : '1fr',
    gap: viewMode === 'grid' ? '24px' : '16px',
  }}>
    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
      <div key={i} style={skeletonCardStyle}>
        <div style={{ ...skeletonStyle, height: '180px', marginBottom: '16px' }} />
        <div style={{ padding: '0 4px' }}>
          <div style={{ ...skeletonStyle, height: '16px', width: '40%', marginBottom: '12px' }} />
          <div style={{ ...skeletonStyle, height: '20px', width: '80%', marginBottom: '16px' }} />
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ ...skeletonStyle, height: '16px', width: '60px' }} />
            <div style={{ ...skeletonStyle, height: '16px', width: '60px' }} />
          </div>
        </div>
      </div>
    ))}
  </div>
)

const EmptyState = ({ searchQuery, onClear }) => (
  <div style={emptyStateStyle}>
    <div style={emptyIconStyle}>
      {searchQuery ? (
        <Search style={{ width: '48px', height: '48px', color: 'var(--color-surface-500)' }} />
      ) : (
        <Code2 style={{ width: '48px', height: '48px', color: 'var(--color-surface-500)' }} />
      )}
    </div>
    <h3 style={emptyTitleStyle}>
      {searchQuery ? 'No matches found' : 'No projects yet'}
    </h3>
    <p style={emptyDescStyle}>
      {searchQuery 
        ? `No projects match "${searchQuery}"`
        : 'Be the first to share your project with the community!'
      }
    </p>
    {searchQuery && (
      <button onClick={onClear} style={emptyClearBtnStyle}>
        Clear search
      </button>
    )}
  </div>
)

// ============================================
// STYLES
// ============================================

const pageStyle = {
  minHeight: '100vh',
  backgroundColor: 'var(--color-surface-950)',
  position: 'relative',
  overflow: 'hidden',
}

const backgroundStyle = {
  position: 'fixed',
  inset: 0,
  zIndex: 0,
  pointerEvents: 'none',
}

const gridOverlayStyle = {
  position: 'absolute',
  inset: 0,
  backgroundImage: `
    linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
  `,
  backgroundSize: '64px 64px',
  maskImage: 'radial-gradient(ellipse at center, black 0%, transparent 70%)',
  WebkitMaskImage: 'radial-gradient(ellipse at center, black 0%, transparent 70%)',
}

const gradientOrbStyle = {
  position: 'absolute',
  top: '-20%',
  left: '-10%',
  width: '60%',
  height: '60%',
  background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)',
  filter: 'blur(80px)',
  animation: 'float 20s ease-in-out infinite',
}

const gradientOrb2Style = {
  position: 'absolute',
  bottom: '-20%',
  right: '-10%',
  width: '50%',
  height: '50%',
  background: 'radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 70%)',
  filter: 'blur(80px)',
  animation: 'float 25s ease-in-out infinite reverse',
}

// Navigation styles
const navStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 100,
  transition: 'all 0.3s ease',
}

const navContainerStyle = {
  maxWidth: '1400px',
  margin: '0 auto',
  padding: '0 24px',
}

const navInnerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: '72px',
}

const logoStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  textDecoration: 'none',
}

const logoTextStyle = {
  fontWeight: 800,
  fontSize: '22px',
  color: '#ffffff',
  letterSpacing: '-0.02em',
}

const navLinksStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  '@media (max-width: 768px)': {
    display: 'none',
  },
}

const navLinkStyle = {
  padding: '10px 18px',
  color: 'var(--color-surface-300)',
  textDecoration: 'none',
  fontSize: '15px',
  fontWeight: 500,
  borderRadius: '10px',
  transition: 'all 0.2s ease',
}

const authButtonsStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
}

const loginButtonStyle = {
  padding: '10px 20px',
  color: 'var(--color-surface-300)',
  textDecoration: 'none',
  fontSize: '15px',
  fontWeight: 500,
  borderRadius: '10px',
  transition: 'all 0.2s ease',
}

const signupButtonStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '10px 20px',
  background: 'linear-gradient(135deg, var(--color-primary-600) 0%, var(--color-primary-500) 100%)',
  color: '#ffffff',
  textDecoration: 'none',
  fontSize: '15px',
  fontWeight: 600,
  borderRadius: '12px',
  boxShadow: '0 4px 14px rgba(59, 130, 246, 0.25)',
  transition: 'all 0.3s ease',
}

const dashboardButtonStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '10px 20px',
  background: 'linear-gradient(135deg, var(--color-primary-600) 0%, var(--color-primary-500) 100%)',
  color: '#ffffff',
  textDecoration: 'none',
  fontSize: '15px',
  fontWeight: 600,
  borderRadius: '12px',
  boxShadow: '0 4px 14px rgba(59, 130, 246, 0.25)',
  transition: 'all 0.3s ease',
}

const mobileMenuBtnStyle = {
  display: 'none',
  padding: '8px',
  background: 'transparent',
  border: 'none',
  color: 'var(--color-surface-300)',
  cursor: 'pointer',
  '@media (max-width: 768px)': {
    display: 'flex',
  },
}

const mobileMenuStyle = {
  display: 'none',
  flexDirection: 'column',
  gap: '8px',
  padding: '16px',
  background: 'rgba(18, 18, 28, 0.98)',
  borderRadius: '16px',
  marginTop: '8px',
  border: '1px solid rgba(255, 255, 255, 0.06)',
  '@media (max-width: 768px)': {
    display: 'flex',
  },
}

const mobileNavLinkStyle = {
  padding: '12px 16px',
  color: 'var(--color-surface-300)',
  textDecoration: 'none',
  fontSize: '15px',
  fontWeight: 500,
  borderRadius: '10px',
}

const mobileDividerStyle = {
  height: '1px',
  background: 'rgba(255, 255, 255, 0.06)',
  margin: '8px 0',
}

const mobileSignupBtnStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  padding: '12px 16px',
  background: 'linear-gradient(135deg, var(--color-primary-600) 0%, var(--color-primary-500) 100%)',
  color: '#ffffff',
  textDecoration: 'none',
  fontSize: '15px',
  fontWeight: 600,
  borderRadius: '12px',
}

// Hero styles
const heroSectionStyle = {
  position: 'relative',
  zIndex: 1,
  paddingTop: '140px',
  paddingBottom: '60px',
  textAlign: 'center',
}

const heroContainerStyle = {
  maxWidth: '800px',
  margin: '0 auto',
  padding: '0 24px',
}

const heroBadgeStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px 16px 8px 12px',
  background: 'rgba(59, 130, 246, 0.1)',
  border: '1px solid rgba(59, 130, 246, 0.2)',
  borderRadius: '100px',
  fontSize: '14px',
  fontWeight: 500,
  color: 'var(--color-primary-400)',
  marginBottom: '24px',
}

const badgePulseStyle = {
  width: '8px',
  height: '8px',
  background: '#10b981',
  borderRadius: '50%',
  animation: 'pulse 2s ease-in-out infinite',
}

const heroTitleStyle = {
  fontSize: 'clamp(36px, 6vw, 64px)',
  fontWeight: 800,
  color: '#ffffff',
  lineHeight: 1.1,
  letterSpacing: '-0.03em',
  marginBottom: '24px',
}

const heroGradientStyle = {
  background: 'linear-gradient(135deg, var(--color-primary-400) 0%, #a855f7 50%, #ec4899 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
}

const heroSubtitleStyle = {
  fontSize: '18px',
  color: 'var(--color-surface-400)',
  lineHeight: 1.6,
  marginBottom: '40px',
}

const heroSearchContainerStyle = {
  maxWidth: '560px',
  margin: '0 auto 40px',
}

const heroSearchStyle = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
}

const heroSearchIconStyle = {
  position: 'absolute',
  left: '20px',
  width: '22px',
  height: '22px',
  color: 'var(--color-surface-500)',
}

const heroSearchInputStyle = {
  width: '100%',
  padding: '18px 56px',
  background: 'rgba(255, 255, 255, 0.03)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '16px',
  color: '#ffffff',
  fontSize: '16px',
  outline: 'none',
  transition: 'all 0.3s ease',
  backdropFilter: 'blur(8px)',
}

const searchClearBtnStyle = {
  position: 'absolute',
  right: '16px',
  padding: '8px',
  background: 'var(--color-surface-700)',
  border: 'none',
  borderRadius: '8px',
  color: 'var(--color-surface-400)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const statsContainerStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '24px',
  padding: '16px 32px',
  background: 'rgba(255, 255, 255, 0.03)',
  border: '1px solid rgba(255, 255, 255, 0.06)',
  borderRadius: '16px',
}

const statItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
}

const statValueStyle = {
  fontWeight: 700,
  fontSize: '18px',
  color: '#ffffff',
}

const statLabelStyle = {
  fontSize: '14px',
  color: 'var(--color-surface-500)',
}

const statDividerStyle = {
  width: '1px',
  height: '32px',
  background: 'rgba(255, 255, 255, 0.08)',
}

// Main content styles
const mainStyle = {
  position: 'relative',
  zIndex: 1,
  paddingBottom: '80px',
}

const contentContainerStyle = {
  maxWidth: '1400px',
  margin: '0 auto',
  padding: '0 24px',
}

const categoryContainerStyle = {
  marginBottom: '32px',
  overflow: 'hidden',
}

const categoryScrollStyle = {
  display: 'flex',
  gap: '12px',
  overflowX: 'auto',
  paddingBottom: '8px',
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
}

const categoryButtonStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '12px 20px',
  background: 'rgba(255, 255, 255, 0.03)',
  border: '1px solid rgba(255, 255, 255, 0.06)',
  borderRadius: '12px',
  fontSize: '14px',
  fontWeight: 500,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  whiteSpace: 'nowrap',
}

const controlsBarStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '24px',
  flexWrap: 'wrap',
  gap: '16px',
}

const controlsLeftStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
}

const controlsRightStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
}

const resultsTextStyle = {
  fontSize: '14px',
  color: 'var(--color-surface-500)',
  margin: 0,
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
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const loadMoreContainerStyle = {
  textAlign: 'center',
  marginTop: '48px',
}

const loadMoreButtonStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  padding: '14px 32px',
  background: 'rgba(59, 130, 246, 0.1)',
  border: '1px solid rgba(59, 130, 246, 0.2)',
  borderRadius: '14px',
  color: 'var(--color-primary-400)',
  fontWeight: 600,
  fontSize: '15px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
}

const spinnerStyle = {
  width: '18px',
  height: '18px',
  border: '2px solid rgba(59, 130, 246, 0.3)',
  borderTopColor: 'var(--color-primary-400)',
  borderRadius: '50%',
  animation: 'spin 0.8s linear infinite',
}

// Skeleton styles
const skeletonCardStyle = {
  background: 'var(--color-surface-850)',
  borderRadius: '20px',
  padding: '12px 12px 20px 12px',
  border: '1px solid rgba(255, 255, 255, 0.06)',
}

const skeletonStyle = {
  background: 'linear-gradient(90deg, var(--color-surface-700) 0%, var(--color-surface-600) 50%, var(--color-surface-700) 100%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 1.5s infinite',
  borderRadius: '12px',
}

// Empty state styles
const emptyStateStyle = {
  textAlign: 'center',
  padding: '80px 24px',
}

const emptyIconStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '96px',
  height: '96px',
  background: 'var(--color-surface-850)',
  borderRadius: '24px',
  marginBottom: '24px',
  border: '1px solid rgba(255, 255, 255, 0.06)',
}

const emptyTitleStyle = {
  fontSize: '22px',
  fontWeight: 700,
  color: '#ffffff',
  marginBottom: '8px',
}

const emptyDescStyle = {
  fontSize: '15px',
  color: 'var(--color-surface-400)',
  marginBottom: '24px',
}

const emptyClearBtnStyle = {
  background: 'none',
  border: 'none',
  color: 'var(--color-primary-400)',
  fontWeight: 500,
  fontSize: '14px',
  cursor: 'pointer',
}

// Footer styles
const footerStyle = {
  position: 'relative',
  zIndex: 1,
  padding: '40px 24px',
  borderTop: '1px solid rgba(255, 255, 255, 0.06)',
  background: 'rgba(10, 10, 15, 0.8)',
}

const footerContainerStyle = {
  maxWidth: '1400px',
  margin: '0 auto',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: '24px',
}

const footerLogoStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
}

const footerTextStyle = {
  fontSize: '14px',
  color: 'var(--color-surface-500)',
  margin: 0,
}

const footerCtaStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '10px 20px',
  background: 'rgba(59, 130, 246, 0.1)',
  border: '1px solid rgba(59, 130, 246, 0.2)',
  borderRadius: '10px',
  color: 'var(--color-primary-400)',
  textDecoration: 'none',
  fontSize: '14px',
  fontWeight: 500,
  transition: 'all 0.2s ease',
}
