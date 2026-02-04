import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom'
import { 
  Save, Share2, ArrowLeft, Play, Sparkles, Code, Palette, Zap,
  PanelLeft, PanelRight, PanelBottom, EyeOff, Eye, Maximize2, Minimize2,
  RefreshCw, Settings, ChevronDown, Monitor, Tablet, Smartphone, GripVertical,
  Globe, Lock, UserPlus, LogIn, X, AlertCircle
} from 'lucide-react'
import { Navbar } from '../components/Navbar'
import { CodeEditor } from '../components/CodeEditor'
import { PreviewPane } from '../components/PreviewPane'
import { PreviewErrorBoundary } from '../components/ErrorBoundary'
import { VisibilityToggle, PublicConfirmDialog } from '../components/VisibilityToggle'
import { projectService } from '../services/projectService'
import { useAuth } from '../context/AuthContext'

// Custom hook for resizable panels
const useResizable = (initialSizes, direction = 'vertical') => {
  const [sizes, setSizes] = useState(initialSizes)
  const containerRef = useRef(null)
  const draggingIndex = useRef(null)
  const startPos = useRef(0)
  const startSizes = useRef([])

  const handleMouseDown = useCallback((index, e) => {
    e.preventDefault()
    draggingIndex.current = index
    startPos.current = direction === 'vertical' ? e.clientY : e.clientX
    startSizes.current = [...sizes]
    document.body.style.cursor = direction === 'vertical' ? 'row-resize' : 'col-resize'
    document.body.style.userSelect = 'none'
  }, [sizes, direction])

  const handleMouseMove = useCallback((e) => {
    if (draggingIndex.current === null || !containerRef.current) return

    const container = containerRef.current
    const containerSize = direction === 'vertical' 
      ? container.offsetHeight 
      : container.offsetWidth
    const currentPos = direction === 'vertical' ? e.clientY : e.clientX
    const delta = currentPos - startPos.current
    const deltaPercent = (delta / containerSize) * 100

    const newSizes = [...startSizes.current]
    const idx = draggingIndex.current

    // Ensure minimum size of 10%
    const minSize = 10
    let newSize1 = startSizes.current[idx] + deltaPercent
    let newSize2 = startSizes.current[idx + 1] - deltaPercent

    if (newSize1 < minSize) {
      newSize1 = minSize
      newSize2 = startSizes.current[idx] + startSizes.current[idx + 1] - minSize
    }
    if (newSize2 < minSize) {
      newSize2 = minSize
      newSize1 = startSizes.current[idx] + startSizes.current[idx + 1] - minSize
    }

    newSizes[idx] = newSize1
    newSizes[idx + 1] = newSize2
    setSizes(newSizes)
  }, [direction])

  const handleMouseUp = useCallback(() => {
    draggingIndex.current = null
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }, [])

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [handleMouseMove, handleMouseUp])

  return { sizes, setSizes, containerRef, handleMouseDown }
}

export const Editor = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const [project, setProject] = useState(null)
  const [html, setHtml] = useState('')
  const [css, setCss] = useState('')
  const [js, setJs] = useState('')
  const [title, setTitle] = useState('')
  const [saving, setSaving] = useState(false)
  const [autoRun, setAutoRun] = useState(true)
  const [previewKey, setPreviewKey] = useState(0)
  const [shareSuccess, setShareSuccess] = useState(false)
  const [isPublic, setIsPublic] = useState(false)
  const [showPublicConfirm, setShowPublicConfirm] = useState(false)
  const [togglingVisibility, setTogglingVisibility] = useState(false)
  const [showSavePrompt, setShowSavePrompt] = useState(false)
  
  // Playground mode - for non-logged in users (check pathname since route has no :id param)
  const isPlayground = location.pathname === '/editor/playground'
  const [playgroundSource, setPlaygroundSource] = useState(null)
  
  // Layout controls
  const [previewPosition, setPreviewPosition] = useState('right') // 'right', 'left', 'bottom', 'hidden'
  const [activeTab, setActiveTab] = useState('html') // For mobile: 'html', 'css', 'js', 'preview'
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [previewDevice, setPreviewDevice] = useState('desktop') // 'desktop', 'tablet', 'mobile'
  const [showLayoutMenu, setShowLayoutMenu] = useState(false)
  const [showDeviceMenu, setShowDeviceMenu] = useState(false)

  // Resizable panels - vertical (for side layout) and horizontal (for bottom layout)
  const verticalResize = useResizable([33.33, 33.33, 33.34], 'vertical')
  const horizontalResize = useResizable([33.33, 33.33, 33.34], 'horizontal')
  
  // Main panel split (editors vs preview) - Load from localStorage or default to 50%
  const [editorPanelSize, setEditorPanelSize] = useState(() => {
    const saved = localStorage.getItem('bumuo-editor-panel-size')
    return saved ? parseFloat(saved) : 50
  })
  const [isCodePanelHidden, setIsCodePanelHidden] = useState(false)
  const mainSplitRef = useRef(null)
  const mainDragging = useRef(false)
  const mainStartPos = useRef(0)
  const mainStartSize = useRef(50)

  // Main panel resize handlers
  const handleMainSplitMouseDown = useCallback((e) => {
    e.preventDefault()
    mainDragging.current = true
    mainStartPos.current = previewPosition === 'bottom' ? e.clientY : e.clientX
    mainStartSize.current = editorPanelSize
    document.body.style.cursor = previewPosition === 'bottom' ? 'row-resize' : 'col-resize'
    document.body.style.userSelect = 'none'
  }, [editorPanelSize, previewPosition])

  useEffect(() => {
    const handleMainMouseMove = (e) => {
      if (!mainDragging.current || !mainSplitRef.current) return
      
      const container = mainSplitRef.current.parentElement
      const containerSize = previewPosition === 'bottom' 
        ? container.offsetHeight 
        : container.offsetWidth
      const currentPos = previewPosition === 'bottom' ? e.clientY : e.clientX
      const containerRect = container.getBoundingClientRect()
      const startOffset = previewPosition === 'bottom' ? containerRect.top : containerRect.left
      
      // Calculate new size based on position within container
      let newSize = ((currentPos - startOffset) / containerSize) * 100
      
      // For left preview, invert the calculation
      if (previewPosition === 'left') {
        newSize = 100 - newSize
      }
      
      // Clamp between 20% and 80%
      newSize = Math.max(20, Math.min(80, newSize))
      setEditorPanelSize(newSize)
    }

    const handleMainMouseUp = () => {
      if (mainDragging.current) {
        // Save to localStorage when resize ends
        localStorage.setItem('bumuo-editor-panel-size', editorPanelSize.toString())
      }
      mainDragging.current = false
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    document.addEventListener('mousemove', handleMainMouseMove)
    document.addEventListener('mouseup', handleMainMouseUp)
    return () => {
      document.removeEventListener('mousemove', handleMainMouseMove)
      document.removeEventListener('mouseup', handleMainMouseUp)
    }
  }, [previewPosition, editorPanelSize])

  useEffect(() => {
    loadProject()
  }, [id, location.pathname])

  useEffect(() => {
    if (autoRun) {
      const timer = setTimeout(() => {
        setPreviewKey(prev => prev + 1)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [html, css, js, autoRun])

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowLayoutMenu(false)
      setShowDeviceMenu(false)
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        if (isPlayground && !user) {
          setShowSavePrompt(true)
        } else {
          handleSave()
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault()
        setPreviewKey(prev => prev + 1)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [title, html, css, js, isPlayground, user])

  const loadProject = async () => {
    // Handle playground mode for non-logged in users
    if (isPlayground) {
      const tempProject = sessionStorage.getItem('bumuo_temp_project')
      if (tempProject) {
        try {
          const data = JSON.parse(tempProject)
          setPlaygroundSource(data)
          setProject({ id: 'playground', title: data.title })
          setTitle(data.title || 'Playground')
          setHtml(data.html || '')
          setCss(data.css || '')
          setJs(data.js || '')
          return
        } catch (e) {
          console.error('Failed to parse temp project:', e)
        }
      }
      // No temp project, create empty playground
      setProject({ id: 'playground', title: 'Playground' })
      setTitle('Playground')
      setHtml('<h1>Hello, World!</h1>\n<p>Start coding here...</p>')
      setCss('body {\n  font-family: system-ui, sans-serif;\n  padding: 20px;\n}')
      setJs('// Your JavaScript here')
      return
    }

    // Regular project loading for logged-in users
    if (!user) {
      navigate('/login')
      return
    }

    const { data, error } = await projectService.getProject(id)
    
    if (!error && data) {
      if (data.user_id !== user.id) {
        navigate('/dashboard')
        return
      }
      setProject(data)
      setTitle(data.title)
      setHtml(data.html || '')
      setCss(data.css || '')
      setJs(data.js || '')
      setIsPublic(data.is_public || false)
    }
  }

  const handleToggleVisibility = async (newValue) => {
    // If making public, show confirmation first
    if (newValue && !isPublic) {
      setShowPublicConfirm(true)
      return
    }
    
    setTogglingVisibility(true)
    const { error } = await projectService.toggleVisibility(id, newValue)
    if (!error) {
      setIsPublic(newValue)
    }
    setTogglingVisibility(false)
  }

  const handleConfirmPublic = async () => {
    setShowPublicConfirm(false)
    setTogglingVisibility(true)
    const { error } = await projectService.toggleVisibility(id, true)
    if (!error) {
      setIsPublic(true)
    }
    setTogglingVisibility(false)
  }

  const handleSave = async () => {
    // Show save prompt for playground mode without user
    if (isPlayground && !user) {
      setShowSavePrompt(true)
      return
    }
    
    // For playground mode with logged-in user, create a new project
    if (isPlayground && user) {
      setSaving(true)
      const { data, error } = await projectService.createProject(user.id, title, html, css, js)
      if (!error && data) {
        // Navigate to the new project
        navigate(`/editor/${data.id}`, { replace: true })
      }
      setSaving(false)
      return
    }
    
    setSaving(true)
    
    await projectService.updateProject(id, {
      title,
      html,
      css,
      js
    })
    
    setTimeout(() => setSaving(false), 1500)
  }

  const handleShare = async () => {
    const { data } = await projectService.generatePublicLink(id)
    
    if (data?.public_link) {
      const shareUrl = `${window.location.origin}/share/${data.public_link}`
      navigator.clipboard.writeText(shareUrl)
      setShareSuccess(true)
      setTimeout(() => setShareSuccess(false), 3000)
    }
  }

  const getDeviceWidth = () => {
    switch (previewDevice) {
      case 'mobile': return '375px'
      case 'tablet': return '768px'
      default: return '100%'
    }
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
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <div 
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                border: '4px solid var(--color-surface-700)',
                borderTopColor: 'var(--color-primary-500)',
                animation: 'spin 1s linear infinite',
              }}
            />
          </div>
          <p style={{ marginTop: '24px', color: 'var(--color-surface-400)', fontWeight: 500 }}>
            Loading your project...
          </p>
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
        ...(isFullscreen ? { position: 'fixed', inset: 0, zIndex: 50 } : {}),
      }}
    >
      {!isFullscreen && <Navbar />}
      
      {/* Enhanced Toolbar */}
      <div 
        style={{
          background: 'rgba(15, 15, 23, 0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => {
              if (isPlayground) {
                // Go back to community or landing page
                navigate('/community')
              } else {
                navigate('/dashboard')
              }
            }}
            style={{
              padding: '10px',
              color: 'var(--color-surface-400)',
              background: 'transparent',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#ffffff'
              e.currentTarget.style.background = 'var(--color-surface-700)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--color-surface-400)'
              e.currentTarget.style.background = 'transparent'
            }}
            title={isPlayground ? "Back to Community" : "Back to Dashboard"}
          >
            <ArrowLeft style={{ width: '20px', height: '20px' }} />
          </button>
          
          <div style={{ height: '24px', width: '1px', background: 'rgba(255, 255, 255, 0.06)' }} className="hidden-mobile" />
          
          <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: '100%',
                background: 'var(--color-surface-800)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '10px 40px 10px 16px',
                color: '#ffffff',
                fontWeight: 500,
                fontSize: '15px',
                outline: 'none',
                transition: 'all 0.2s ease',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(59, 130, 246, 0.5)'
                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)'
                e.target.style.boxShadow = 'none'
              }}
              placeholder="Project name..."
            />
            <Sparkles style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'rgba(59, 130, 246, 0.5)' }} />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Layout Controls - Desktop */}
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px',
              background: 'var(--color-surface-800)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}
            className="hidden-mobile"
          >
            {[
              { pos: 'left', icon: PanelLeft, title: 'Preview Left' },
              { pos: 'right', icon: PanelRight, title: 'Preview Right' },
              { pos: 'bottom', icon: PanelBottom, title: 'Preview Bottom' },
            ].map(({ pos, icon: Icon, title }) => (
              <button
                key={pos}
                onClick={() => setPreviewPosition(pos)}
                style={{
                  padding: '8px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: previewPosition === pos ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                  color: previewPosition === pos ? 'var(--color-primary-400)' : 'var(--color-surface-400)',
                }}
                title={title}
              >
                <Icon style={{ width: '16px', height: '16px' }} />
              </button>
            ))}
            <button
              onClick={() => setPreviewPosition(previewPosition === 'hidden' ? 'right' : 'hidden')}
              style={{
                padding: '8px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                background: previewPosition === 'hidden' ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                color: previewPosition === 'hidden' ? 'var(--color-primary-400)' : 'var(--color-surface-400)',
              }}
              title={previewPosition === 'hidden' ? 'Show Preview' : 'Hide Preview'}
            >
              {previewPosition === 'hidden' ? <Eye style={{ width: '16px', height: '16px' }} /> : <EyeOff style={{ width: '16px', height: '16px' }} />}
            </button>
            <div style={{ width: '1px', height: '16px', background: 'rgba(255, 255, 255, 0.1)' }} />
            <button
              onClick={() => setIsCodePanelHidden(!isCodePanelHidden)}
              style={{
                padding: '8px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                background: isCodePanelHidden ? 'rgba(251, 191, 36, 0.2)' : 'transparent',
                color: isCodePanelHidden ? '#fbbf24' : 'var(--color-surface-400)',
              }}
              title={isCodePanelHidden ? 'Show Code Editors' : 'Hide Code Editors'}
            >
              <Code style={{ width: '16px', height: '16px' }} />
            </button>
          </div>

          {/* Layout Menu - Mobile/Tablet */}
          <div style={{ position: 'relative' }} className="visible-mobile">
            <button
              onClick={(e) => { e.stopPropagation(); setShowLayoutMenu(!showLayoutMenu) }}
              style={{
                padding: '10px',
                color: 'var(--color-surface-400)',
                background: 'transparent',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
              }}
              title="Layout Options"
            >
              <Settings style={{ width: '20px', height: '20px' }} />
            </button>
            {showLayoutMenu && (
              <div 
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '100%',
                  marginTop: '8px',
                  background: 'var(--color-surface-800)',
                  borderRadius: '14px',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  padding: '8px 0',
                  zIndex: 50,
                  minWidth: '180px',
                  animation: 'scale-in 0.2s ease',
                }}
              >
                {[
                  { pos: 'left', icon: PanelLeft, label: 'Preview Left' },
                  { pos: 'right', icon: PanelRight, label: 'Preview Right' },
                  { pos: 'bottom', icon: PanelBottom, label: 'Preview Bottom' },
                ].map(({ pos, icon: Icon, label }) => (
                  <button
                    key={pos}
                    onClick={() => { setPreviewPosition(pos); setShowLayoutMenu(false) }}
                    style={{
                      width: '100%',
                      padding: '10px 16px',
                      textAlign: 'left',
                      fontSize: '14px',
                      color: 'var(--color-surface-300)',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    <Icon style={{ width: '16px', height: '16px' }} /> {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            style={{
              padding: '10px',
              color: 'var(--color-surface-400)',
              background: 'transparent',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            className="hidden-mobile"
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#ffffff'
              e.currentTarget.style.background = 'var(--color-surface-700)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--color-surface-400)'
              e.currentTarget.style.background = 'transparent'
            }}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 style={{ width: '20px', height: '20px' }} /> : <Maximize2 style={{ width: '20px', height: '20px' }} />}
          </button>

          <div style={{ height: '24px', width: '1px', background: 'rgba(255, 255, 255, 0.06)' }} className="hidden-mobile" />

          {/* Auto-run toggle */}
          <label 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 12px',
              background: 'var(--color-surface-800)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            className="hidden-mobile"
          >
            <div style={{ position: 'relative' }}>
              <input
                type="checkbox"
                checked={autoRun}
                onChange={(e) => setAutoRun(e.target.checked)}
                style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
              />
              <div 
                style={{
                  width: '36px',
                  height: '20px',
                  background: autoRun ? 'var(--color-primary-500)' : 'var(--color-surface-600)',
                  borderRadius: '100px',
                  transition: 'background 0.2s ease',
                }}
              />
              <div 
                style={{
                  position: 'absolute',
                  left: autoRun ? '18px' : '2px',
                  top: '2px',
                  width: '16px',
                  height: '16px',
                  background: '#ffffff',
                  borderRadius: '50%',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  transition: 'left 0.2s ease',
                }}
              />
            </div>
            <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-surface-400)', whiteSpace: 'nowrap' }}>
              Auto-run
            </span>
          </label>
          
          {/* Manual run button */}
          {!autoRun && (
            <button
              onClick={() => setPreviewKey(prev => prev + 1)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 500,
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.25)',
              }}
              className="hidden-mobile"
              title="Run Code (Ctrl+Enter)"
            >
              <Play style={{ width: '16px', height: '16px' }} />
              <span className="hidden-tablet">Run</span>
            </button>
          )}
          
          {/* Share button - hidden in playground mode without user */}
          {(!isPlayground || user) && (
            <button
              onClick={handleShare}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                background: 'var(--color-surface-700)',
                color: 'var(--color-surface-300)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '12px',
                fontWeight: 500,
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--color-surface-600)'
                e.currentTarget.style.color = '#ffffff'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--color-surface-700)'
                e.currentTarget.style.color = 'var(--color-surface-300)'
              }}
              title="Share Project"
            >
              <Share2 style={{ width: '16px', height: '16px' }} />
              <span className="hidden-mobile">{shareSuccess ? 'Copied!' : 'Share'}</span>
              {shareSuccess && (
                <div 
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    width: '10px',
                    height: '10px',
                    background: '#34d399',
                    borderRadius: '50%',
                    animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
                  }}
                />
              )}
            </button>
          )}
          
          {/* Visibility Toggle - hidden in playground mode */}
          {!isPlayground && (
            <VisibilityToggle 
              isPublic={isPublic}
              onToggle={handleToggleVisibility}
              disabled={togglingVisibility}
              variant="compact"
            />
          )}
          
          {/* Playground Mode Banner */}
          {isPlayground && !user && (
            <div style={playgroundBannerStyle}>
              <AlertCircle style={{ width: '16px', height: '16px', color: '#fbbf24' }} />
              <span>Playground Mode</span>
            </div>
          )}
          
          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              background: saving 
                ? 'linear-gradient(135deg, #059669 0%, #10b981 100%)'
                : isPlayground && !user
                  ? 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)'
                  : 'linear-gradient(135deg, var(--color-primary-600) 0%, var(--color-primary-500) 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              fontWeight: 600,
              fontSize: '14px',
              cursor: saving ? 'default' : 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: isPlayground && !user 
                ? '0 4px 14px rgba(139, 92, 246, 0.25)'
                : '0 4px 14px rgba(59, 130, 246, 0.25)',
            }}
            title={isPlayground && !user ? "Sign up to save" : "Save Project (Ctrl+S)"}
          >
            {isPlayground && !user ? (
              <>
                <UserPlus style={{ width: '16px', height: '16px' }} />
                <span className="hidden-mobile">Sign Up to Save</span>
              </>
            ) : (
              <>
                <Save style={{ width: '16px', height: '16px', ...(saving ? { animation: 'pulse 1s ease-in-out infinite' } : {}) }} />
                <span className="hidden-mobile">{saving ? 'Saved!' : 'Save'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Tab Bar */}
      <div 
        style={{
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          background: 'rgba(15, 15, 23, 0.95)',
          minHeight: '48px',
          flexShrink: 0,
        }}
        className="mobile-tab-bar"
      >
        {['html', 'css', 'js', 'preview'].map((tab) => {
          const isActive = activeTab === tab
          const tabColors = {
            html: { icon: Code, color: '#fb923c', label: 'HTML' },
            css: { icon: Palette, color: '#22d3ee', label: 'CSS' },
            js: { icon: Zap, color: '#facc15', label: 'JS' },
            preview: { icon: Eye, color: '#34d399', label: 'Preview' },
          }
          const TabIcon = tabColors[tab].icon
          
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: '1 1 0',
                minWidth: 0,
                padding: '12px 8px',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.02em',
                transition: 'all 0.2s ease',
                borderBottom: isActive ? '2px solid var(--color-primary-500)' : '2px solid transparent',
                background: isActive ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                color: isActive ? 'var(--color-primary-400)' : 'var(--color-surface-500)',
                border: 'none',
                borderBottomWidth: '2px',
                borderBottomStyle: 'solid',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              <TabIcon style={{ width: '18px', height: '18px', color: tabColors[tab].color, flexShrink: 0 }} />
              <span style={{ lineHeight: 1 }}>{tabColors[tab].label}</span>
            </button>
          )
        })}
      </div>

      {/* Editor Layout */}
      <div 
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: previewPosition === 'bottom' ? 'column' : 'row',
          overflow: 'hidden',
        }}
      >
        {/* Code Editors - Order changes based on preview position */}
        {previewPosition === 'left' && !isCodePanelHidden && (
          <div 
            style={{ height: '100%', width: `${100 - editorPanelSize}%` }}
            className="hidden-mobile"
          >
            <PreviewSection 
              previewKey={previewKey} 
              html={html} 
              css={css} 
              js={js}
              previewDevice={previewDevice}
              setPreviewDevice={setPreviewDevice}
              showDeviceMenu={showDeviceMenu}
              setShowDeviceMenu={setShowDeviceMenu}
              getDeviceWidth={getDeviceWidth}
              setPreviewKey={setPreviewKey}
            />
          </div>
        )}

        {/* Main Resize Handle - Between code editors and preview (for left position) */}
        {previewPosition === 'left' && !isCodePanelHidden && (
          <div
            ref={mainSplitRef}
            style={{
              display: 'none',
              width: '8px',
              height: '100%',
              cursor: 'col-resize',
              background: 'var(--color-surface-700)',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.15s ease',
              flexShrink: 0,
            }}
            className="main-resize-handle"
            onMouseDown={handleMainSplitMouseDown}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-primary-500)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'var(--color-surface-700)'}
          >
            <GripVertical style={{ width: '12px', height: '12px', color: 'var(--color-surface-500)' }} />
          </div>
        )}

        {/* Code Editors Section - Resizable panels */}
        {!isCodePanelHidden && (
        <div 
          ref={previewPosition === 'bottom' ? horizontalResize.containerRef : verticalResize.containerRef}
          style={{
            display: previewPosition === 'hidden' ? 'flex' : 'none',
            flexDirection: previewPosition === 'bottom' ? 'row' : 'column',
            background: '#ffffff',
            width: previewPosition === 'hidden' ? '100%' : previewPosition === 'bottom' ? '100%' : `${editorPanelSize}%`,
            height: previewPosition === 'bottom' ? `${editorPanelSize}%` : '100%',
          }}
          className="code-editors-desktop"
        >
          {/* HTML Editor */}
          <div 
            style={{ 
              position: 'relative',
              overflow: 'hidden',
              [previewPosition === 'bottom' ? 'width' : 'height']: `${(previewPosition === 'bottom' ? horizontalResize : verticalResize).sizes[0]}%`,
              minHeight: previewPosition === 'bottom' ? 'auto' : '50px',
              minWidth: previewPosition === 'bottom' ? '50px' : 'auto',
            }}
          >
            <div 
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                background: '#fff7ed',
                border: '1px solid #fed7aa',
                borderRadius: '8px',
                opacity: 0,
                transition: 'opacity 0.2s ease',
              }}
              className="editor-label"
            >
              <Code style={{ width: '14px', height: '14px', color: '#f97316' }} />
              <span style={{ fontSize: '12px', fontWeight: 500, color: '#ea580c' }}>HTML</span>
            </div>
            <CodeEditor language="html" value={html} onChange={setHtml} theme="light" />
          </div>

          {/* Resize Handle 1 */}
          <ResizeHandle 
            direction={previewPosition === 'bottom' ? 'horizontal' : 'vertical'}
            onMouseDown={(e) => (previewPosition === 'bottom' ? horizontalResize : verticalResize).handleMouseDown(0, e)}
          />

          {/* CSS Editor */}
          <div 
            style={{ 
              position: 'relative',
              overflow: 'hidden',
              [previewPosition === 'bottom' ? 'width' : 'height']: `${(previewPosition === 'bottom' ? horizontalResize : verticalResize).sizes[1]}%`,
              minHeight: previewPosition === 'bottom' ? 'auto' : '50px',
              minWidth: previewPosition === 'bottom' ? '50px' : 'auto',
            }}
          >
            <div 
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                background: '#ecfeff',
                border: '1px solid #a5f3fc',
                borderRadius: '8px',
                opacity: 0,
                transition: 'opacity 0.2s ease',
              }}
              className="editor-label"
            >
              <Palette style={{ width: '14px', height: '14px', color: '#06b6d4' }} />
              <span style={{ fontSize: '12px', fontWeight: 500, color: '#0891b2' }}>CSS</span>
            </div>
            <CodeEditor language="css" value={css} onChange={setCss} theme="light" />
          </div>

          {/* Resize Handle 2 */}
          <ResizeHandle 
            direction={previewPosition === 'bottom' ? 'horizontal' : 'vertical'}
            onMouseDown={(e) => (previewPosition === 'bottom' ? horizontalResize : verticalResize).handleMouseDown(1, e)}
          />

          {/* JavaScript Editor */}
          <div 
            style={{ 
              position: 'relative',
              overflow: 'hidden',
              [previewPosition === 'bottom' ? 'width' : 'height']: `${(previewPosition === 'bottom' ? horizontalResize : verticalResize).sizes[2]}%`,
              minHeight: previewPosition === 'bottom' ? 'auto' : '50px',
              minWidth: previewPosition === 'bottom' ? '50px' : 'auto',
            }}
          >
            <div 
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                background: '#fffbeb',
                border: '1px solid #fde68a',
                borderRadius: '8px',
                opacity: 0,
                transition: 'opacity 0.2s ease',
              }}
              className="editor-label"
            >
              <Zap style={{ width: '14px', height: '14px', color: '#f59e0b' }} />
              <span style={{ fontSize: '12px', fontWeight: 500, color: '#d97706' }}>JavaScript</span>
            </div>
            <CodeEditor language="javascript" value={js} onChange={setJs} theme="light" />
          </div>
        </div>
        )}

        {/* Main Resize Handle - Between code editors and preview (for right/bottom position) */}
        {previewPosition !== 'left' && previewPosition !== 'hidden' && !isCodePanelHidden && (
          <div
            ref={mainSplitRef}
            style={{
              display: 'none',
              width: previewPosition === 'bottom' ? '100%' : '8px',
              height: previewPosition === 'bottom' ? '8px' : '100%',
              cursor: previewPosition === 'bottom' ? 'row-resize' : 'col-resize',
              background: 'var(--color-surface-700)',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.15s ease',
              flexShrink: 0,
            }}
            className="main-resize-handle"
            onMouseDown={handleMainSplitMouseDown}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-primary-500)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'var(--color-surface-700)'}
          >
            <GripVertical 
              style={{ 
                width: '12px', 
                height: '12px', 
                color: 'var(--color-surface-500)',
                transform: previewPosition === 'bottom' ? 'rotate(90deg)' : 'none',
              }} 
            />
          </div>
        )}

        {/* Mobile: Show active tab only - WHITE BACKGROUND for editor tabs */}
        <div 
          style={{
            flex: 1,
            background: '#ffffff',
            minHeight: 0,
            position: 'relative',
          }}
          className="mobile-content-area"
        >
          {activeTab === 'html' && (
            <div style={{ position: 'absolute', inset: 0 }}>
              <CodeEditor language="html" value={html} onChange={setHtml} theme="light" />
            </div>
          )}
          {activeTab === 'css' && (
            <div style={{ position: 'absolute', inset: 0 }}>
              <CodeEditor language="css" value={css} onChange={setCss} theme="light" />
            </div>
          )}
          {activeTab === 'js' && (
            <div style={{ position: 'absolute', inset: 0 }}>
              <CodeEditor language="javascript" value={js} onChange={setJs} theme="light" />
            </div>
          )}
          {activeTab === 'preview' && (
            <div style={{ position: 'absolute', inset: 0 }}>
              <PreviewSection 
                previewKey={previewKey} 
                html={html} 
                css={css} 
                js={js}
                previewDevice={previewDevice}
                setPreviewDevice={setPreviewDevice}
                showDeviceMenu={showDeviceMenu}
                setShowDeviceMenu={setShowDeviceMenu}
                getDeviceWidth={getDeviceWidth}
                setPreviewKey={setPreviewKey}
                isMobile={true}
              />
            </div>
          )}
        </div>

        {/* Preview Pane - Right or Bottom */}
        {previewPosition !== 'left' && previewPosition !== 'hidden' && (
          <div 
            style={{
              display: 'none',
              width: previewPosition === 'bottom' ? '100%' : isCodePanelHidden ? '100%' : `${100 - editorPanelSize}%`,
              height: previewPosition === 'bottom' ? (isCodePanelHidden ? '100%' : `${100 - editorPanelSize}%`) : '100%',
            }}
            className="preview-pane-desktop"
          >
            <PreviewSection 
              previewKey={previewKey} 
              html={html} 
              css={css} 
              js={js}
              previewDevice={previewDevice}
              setPreviewDevice={setPreviewDevice}
              showDeviceMenu={showDeviceMenu}
              setShowDeviceMenu={setShowDeviceMenu}
              getDeviceWidth={getDeviceWidth}
              setPreviewKey={setPreviewKey}
            />
          </div>
        )}
      </div>

      {/* Keyboard Shortcuts Hint */}
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '24px',
          padding: '10px',
          background: 'rgba(15, 15, 23, 0.95)',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          fontSize: '12px',
          color: 'var(--color-surface-500)',
        }}
        className="hidden-mobile"
      >
        <span>
          <kbd style={{ padding: '2px 6px', background: 'var(--color-surface-800)', borderRadius: '4px', marginRight: '4px' }}>Ctrl</kbd> 
          + <kbd style={{ padding: '2px 6px', background: 'var(--color-surface-800)', borderRadius: '4px', margin: '0 4px' }}>S</kbd> Save
        </span>
        <span>
          <kbd style={{ padding: '2px 6px', background: 'var(--color-surface-800)', borderRadius: '4px', marginRight: '4px' }}>Ctrl</kbd> 
          + <kbd style={{ padding: '2px 6px', background: 'var(--color-surface-800)', borderRadius: '4px', margin: '0 4px' }}>Enter</kbd> Run
        </span>
      </div>

      {/* Public Confirm Dialog */}
      {showPublicConfirm && (
        <PublicConfirmDialog 
          onConfirm={handleConfirmPublic}
          onCancel={() => setShowPublicConfirm(false)}
        />
      )}

      {/* Save Prompt for Playground Mode */}
      {showSavePrompt && (
        <SavePromptModal
          onClose={() => setShowSavePrompt(false)}
          onLogin={() => {
            sessionStorage.setItem('bumuo_return_to', '/editor/playground')
            sessionStorage.setItem('bumuo_temp_project', JSON.stringify({
              title,
              html,
              css,
              js,
            }))
            navigate('/login')
          }}
          onSignUp={() => {
            sessionStorage.setItem('bumuo_return_to', '/editor/playground')
            sessionStorage.setItem('bumuo_temp_project', JSON.stringify({
              title,
              html,
              css,
              js,
            }))
            navigate('/register')
          }}
        />
      )}

      {/* Responsive CSS */}
      <style>{`
        @media (min-width: 1024px) {
          .hidden-mobile { display: flex !important; }
          .visible-mobile { display: none !important; }
          .mobile-tab-bar { display: none !important; }
          .mobile-content-area { display: none !important; }
          .code-editors-desktop { display: flex !important; }
          .preview-pane-desktop { display: flex !important; }
          .main-resize-handle { display: flex !important; }
        }
        @media (max-width: 1023px) {
          .hidden-mobile { display: none !important; }
          .visible-mobile { display: flex !important; }
          .mobile-tab-bar { display: flex !important; }
          .mobile-content-area { display: block !important; }
          .code-editors-desktop { display: none !important; }
          .preview-pane-desktop { display: none !important; }
          .main-resize-handle { display: none !important; }
        }
        @media (max-width: 768px) {
          .hidden-tablet { display: none !important; }
        }
        .code-editors-desktop > div:hover .editor-label {
          opacity: 1 !important;
        }
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}

// Preview Section Component - Dark themed panel surrounding white preview
const PreviewSection = ({ 
  previewKey, html, css, js, 
  previewDevice, setPreviewDevice, 
  showDeviceMenu, setShowDeviceMenu,
  getDeviceWidth, setPreviewKey,
  isMobile = false
}) => {
  return (
    <div 
      style={{
        background: 'var(--color-surface-900)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        minHeight: 0,
      }}
    >
      {/* Preview Header */}
      <div 
        style={{
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          background: 'var(--color-surface-850)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div 
            style={{
              width: '8px',
              height: '8px',
              background: '#34d399',
              borderRadius: '50%',
              boxShadow: '0 0 8px rgba(52, 211, 153, 0.5)',
              animation: 'pulse-subtle 2s ease-in-out infinite',
            }}
          />
          <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-surface-300)' }}>
            Live Preview
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Device Selector */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={(e) => { e.stopPropagation(); setShowDeviceMenu(!showDeviceMenu) }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                fontSize: '14px',
                color: 'var(--color-surface-400)',
                background: 'transparent',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {previewDevice === 'desktop' && <Monitor style={{ width: '16px', height: '16px' }} />}
              {previewDevice === 'tablet' && <Tablet style={{ width: '16px', height: '16px' }} />}
              {previewDevice === 'mobile' && <Smartphone style={{ width: '16px', height: '16px' }} />}
              <ChevronDown style={{ width: '12px', height: '12px' }} />
            </button>
            {showDeviceMenu && (
              <div 
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '100%',
                  marginTop: '4px',
                  background: 'var(--color-surface-800)',
                  borderRadius: '14px',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  padding: '6px',
                  zIndex: 50,
                  animation: 'scale-in 0.2s ease',
                }}
              >
                {[
                  { device: 'desktop', icon: Monitor, label: 'Desktop' },
                  { device: 'tablet', icon: Tablet, label: 'Tablet' },
                  { device: 'mobile', icon: Smartphone, label: 'Mobile' },
                ].map(({ device, icon: Icon, label }) => (
                  <button
                    key={device}
                    onClick={() => { setPreviewDevice(device); setShowDeviceMenu(false) }}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      textAlign: 'left',
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      background: previewDevice === device ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                      color: previewDevice === device ? 'var(--color-primary-400)' : 'var(--color-surface-300)',
                      border: 'none',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <Icon style={{ width: '16px', height: '16px' }} /> {label}
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* Refresh Button */}
          <button
            onClick={() => setPreviewKey(prev => prev + 1)}
            style={{
              padding: '6px',
              color: 'var(--color-surface-500)',
              background: 'transparent',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#ffffff'
              e.currentTarget.style.background = 'var(--color-surface-700)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--color-surface-500)'
              e.currentTarget.style.background = 'transparent'
            }}
            title="Refresh Preview"
          >
            <RefreshCw style={{ width: '16px', height: '16px' }} />
          </button>
        </div>
      </div>
      {/* Preview Content - Full stretch for desktop, device frame for mobile/tablet */}
      <div 
        style={{
          flex: 1,
          minHeight: 0,
          ...(previewDevice === 'desktop' 
            ? {} 
            : { 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                padding: '16px',
                background: 'rgba(10, 10, 15, 0.5)',
              }
          ),
        }}
      >
        {previewDevice === 'desktop' ? (
          // Desktop: Full stretch preview - absolute fill
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <div style={{ position: 'absolute', inset: 0, background: '#ffffff' }}>
              <PreviewErrorBoundary key={previewKey}>
                <PreviewPane html={html} css={css} js={js} />
              </PreviewErrorBoundary>
            </div>
          </div>
        ) : (
          // Mobile/Tablet: Device frame preview
          <div 
            style={{ 
              background: '#ffffff',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
              overflow: 'hidden',
              height: '100%',
              transition: 'all 0.3s ease',
              width: getDeviceWidth(),
              maxWidth: '100%',
              border: '8px solid #1e1e2e',
              borderRadius: '24px',
            }}
          >
            <PreviewErrorBoundary key={previewKey}>
              <PreviewPane html={html} css={css} js={js} />
            </PreviewErrorBoundary>
          </div>
        )}
      </div>
    </div>
  )
}

// Resize Handle Component - draggable divider between panes
const ResizeHandle = ({ direction, onMouseDown }) => {
  const isVertical = direction === 'vertical'
  const [hovered, setHovered] = useState(false)
  
  return (
    <div
      style={{
        width: isVertical ? '100%' : '6px',
        height: isVertical ? '6px' : '100%',
        cursor: isVertical ? 'row-resize' : 'col-resize',
        background: hovered ? 'var(--color-primary-400)' : '#e5e7eb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background 0.15s ease',
        flexShrink: 0,
      }}
      onMouseDown={onMouseDown}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div 
        style={{
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.15s ease',
        }}
      >
        <GripVertical 
          style={{ 
            width: '12px', 
            height: '12px', 
            color: hovered ? '#ffffff' : '#9ca3af',
            transform: isVertical ? 'rotate(90deg)' : 'none',
          }} 
        />
      </div>
    </div>
  )
}

// Playground Banner Style
const playgroundBannerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px 14px',
  background: 'rgba(251, 191, 36, 0.1)',
  border: '1px solid rgba(251, 191, 36, 0.2)',
  borderRadius: '10px',
  fontSize: '13px',
  fontWeight: 500,
  color: '#fbbf24',
}

// Save Prompt Modal Component
const SavePromptModal = ({ onClose, onLogin, onSignUp }) => (
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
      zIndex: 200,
      animation: 'fade-in 0.2s ease',
    }}
    onClick={(e) => e.target === e.currentTarget && onClose()}
  >
    <div 
      style={{
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
      }}
    >
      {/* Icon */}
      <div 
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '64px',
          height: '64px',
          background: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)',
          borderRadius: '20px',
          marginBottom: '20px',
          boxShadow: '0 8px 24px rgba(139, 92, 246, 0.3)',
        }}
      >
        <Save style={{ width: '28px', height: '28px', color: '#ffffff' }} />
      </div>
      
      {/* Content */}
      <h3 
        style={{
          fontSize: '24px',
          fontWeight: 700,
          color: '#ffffff',
          marginBottom: '12px',
          letterSpacing: '-0.02em',
        }}
      >
        Save Your Work
      </h3>
      <p 
        style={{
          fontSize: '15px',
          color: 'var(--color-surface-400)',
          lineHeight: 1.6,
          marginBottom: '24px',
        }}
      >
        Create a free account to save your project, access it from anywhere, and share with the community.
      </p>
      
      {/* Features */}
      <div 
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          marginBottom: '28px',
          padding: '20px',
          background: 'rgba(139, 92, 246, 0.05)',
          borderRadius: '16px',
          border: '1px solid rgba(139, 92, 246, 0.1)',
        }}
      >
        {[
          'Your code is preserved when you sign up',
          'Access your projects from any device',
          'Share your creations with others',
        ].map((text, i) => (
          <div 
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '14px',
              color: 'var(--color-surface-300)',
              textAlign: 'left',
            }}
          >
            <div 
              style={{
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
              }}
            >
              ✓
            </div>
            <span>{text}</span>
          </div>
        ))}
      </div>
      
      {/* Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <button 
          onClick={onSignUp}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            width: '100%',
            padding: '14px 24px',
            background: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)',
            border: 'none',
            borderRadius: '14px',
            color: '#ffffff',
            fontWeight: 600,
            fontSize: '15px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 14px rgba(139, 92, 246, 0.3)',
          }}
        >
          <UserPlus style={{ width: '18px', height: '18px' }} />
          Create Free Account
        </button>
        <button 
          onClick={onLogin}
          style={{
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
          }}
        >
          <LogIn style={{ width: '18px', height: '18px' }} />
          Sign In
        </button>
      </div>
      
      {/* Close button */}
      <button 
        onClick={onClose}
        style={{
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
        }}
      >
        <X style={{ width: '18px', height: '18px' }} />
      </button>
    </div>
  </div>
)
