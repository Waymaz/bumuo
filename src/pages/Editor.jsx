import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  Save, Share2, ArrowLeft, Play, Sparkles, Code, Palette, Zap,
  PanelLeft, PanelRight, PanelBottom, EyeOff, Eye, Maximize2, Minimize2,
  RefreshCw, Settings, ChevronDown, Monitor, Tablet, Smartphone
} from 'lucide-react'
import { Navbar } from '../components/Navbar'
import { CodeEditor } from '../components/CodeEditor'
import { PreviewPane } from '../components/PreviewPane'
import { projectService } from '../services/projectService'
import { useAuth } from '../context/AuthContext'

export const Editor = () => {
  const { id } = useParams()
  const navigate = useNavigate()
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
  
  // Layout controls
  const [previewPosition, setPreviewPosition] = useState('right') // 'right', 'left', 'bottom', 'hidden'
  const [activeTab, setActiveTab] = useState('html') // For mobile: 'html', 'css', 'js', 'preview'
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [previewDevice, setPreviewDevice] = useState('desktop') // 'desktop', 'tablet', 'mobile'
  const [showLayoutMenu, setShowLayoutMenu] = useState(false)
  const [showDeviceMenu, setShowDeviceMenu] = useState(false)

  useEffect(() => {
    loadProject()
  }, [id])

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
        handleSave()
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault()
        setPreviewKey(prev => prev + 1)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [title, html, css, js])

  const loadProject = async () => {
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
    }
  }

  const handleSave = async () => {
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

  const getLayoutClasses = () => {
    if (previewPosition === 'hidden') {
      return 'grid-cols-1'
    }
    if (previewPosition === 'bottom') {
      return 'grid-cols-1 grid-rows-2'
    }
    return 'grid-cols-1 lg:grid-cols-2'
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
      <div className="min-h-screen bg-surface-950 flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-surface-700 border-t-primary-500"></div>
          </div>
          <p className="mt-6 text-surface-400 font-medium">Loading your project...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`h-screen flex flex-col bg-surface-950 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {!isFullscreen && <Navbar />}
      
      {/* Enhanced Toolbar */}
      <div className="bg-surface-900 border-b border-white/[0.06] px-4 md:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 text-surface-400 hover:text-white hover:bg-surface-700 rounded-xl transition-all duration-200 group"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
          </button>
          
          <div className="hidden sm:block h-6 w-px bg-white/[0.06]"></div>
          
          <div className="relative flex-1 max-w-xs md:max-w-md">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-surface-800 border border-white/[0.08] rounded-xl px-4 py-2 text-white font-medium focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all text-sm md:text-base placeholder-surface-500"
              placeholder="Project name..."
            />
            <Sparkles className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400/50" />
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          {/* Layout Controls - Desktop */}
          <div className="hidden lg:flex items-center gap-1 p-1 bg-surface-800 rounded-xl border border-white/[0.06]">
            <button
              onClick={() => setPreviewPosition('left')}
              className={`p-2 rounded-lg transition-all duration-200 ${previewPosition === 'left' ? 'bg-primary-500/20 text-primary-400' : 'text-surface-400 hover:text-white hover:bg-surface-700'}`}
              title="Preview Left"
            >
              <PanelLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPreviewPosition('right')}
              className={`p-2 rounded-lg transition-all duration-200 ${previewPosition === 'right' ? 'bg-primary-500/20 text-primary-400' : 'text-surface-400 hover:text-white hover:bg-surface-700'}`}
              title="Preview Right"
            >
              <PanelRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPreviewPosition('bottom')}
              className={`p-2 rounded-lg transition-all duration-200 ${previewPosition === 'bottom' ? 'bg-primary-500/20 text-primary-400' : 'text-surface-400 hover:text-white hover:bg-surface-700'}`}
              title="Preview Bottom"
            >
              <PanelBottom className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPreviewPosition(previewPosition === 'hidden' ? 'right' : 'hidden')}
              className={`p-2 rounded-lg transition-all duration-200 ${previewPosition === 'hidden' ? 'bg-primary-500/20 text-primary-400' : 'text-surface-400 hover:text-white hover:bg-surface-700'}`}
              title={previewPosition === 'hidden' ? 'Show Preview' : 'Hide Preview'}
            >
              {previewPosition === 'hidden' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          </div>

          {/* Layout Menu - Mobile/Tablet */}
          <div className="relative lg:hidden">
            <button
              onClick={(e) => { e.stopPropagation(); setShowLayoutMenu(!showLayoutMenu) }}
              className="p-2 text-surface-400 hover:text-white hover:bg-surface-700 rounded-xl transition-all duration-200"
              title="Layout Options"
            >
              <Settings className="w-5 h-5" />
            </button>
            {showLayoutMenu && (
              <div className="absolute right-0 top-full mt-2 bg-surface-800 rounded-xl shadow-xl border border-white/[0.08] py-2 z-50 min-w-[180px] animate-scale-in">
                <button onClick={() => { setPreviewPosition('left'); setShowLayoutMenu(false) }} className="w-full px-4 py-2.5 text-left text-sm text-surface-300 hover:text-white hover:bg-surface-700 flex items-center gap-3 transition-colors">
                  <PanelLeft className="w-4 h-4" /> Preview Left
                </button>
                <button onClick={() => { setPreviewPosition('right'); setShowLayoutMenu(false) }} className="w-full px-4 py-2.5 text-left text-sm text-surface-300 hover:text-white hover:bg-surface-700 flex items-center gap-3 transition-colors">
                  <PanelRight className="w-4 h-4" /> Preview Right
                </button>
                <button onClick={() => { setPreviewPosition('bottom'); setShowLayoutMenu(false) }} className="w-full px-4 py-2.5 text-left text-sm text-surface-300 hover:text-white hover:bg-surface-700 flex items-center gap-3 transition-colors">
                  <PanelBottom className="w-4 h-4" /> Preview Bottom
                </button>
                <button onClick={() => { setPreviewPosition(previewPosition === 'hidden' ? 'right' : 'hidden'); setShowLayoutMenu(false) }} className="w-full px-4 py-2.5 text-left text-sm text-surface-300 hover:text-white hover:bg-surface-700 flex items-center gap-3 transition-colors">
                  {previewPosition === 'hidden' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  {previewPosition === 'hidden' ? 'Show Preview' : 'Hide Preview'}
                </button>
              </div>
            )}
          </div>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="hidden md:flex p-2 text-surface-400 hover:text-white hover:bg-surface-700 rounded-xl transition-all duration-200"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>

          <div className="hidden md:block h-6 w-px bg-white/[0.06]"></div>

          {/* Auto-run toggle */}
          <label className="hidden md:flex items-center gap-2.5 px-3 py-2 bg-surface-800 rounded-xl border border-white/[0.06] cursor-pointer hover:border-white/[0.1] transition-all duration-200 group">
            <div className="relative">
              <input
                type="checkbox"
                checked={autoRun}
                onChange={(e) => setAutoRun(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-surface-600 rounded-full peer-checked:bg-primary-500 transition-colors"></div>
              <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4"></div>
            </div>
            <span className="text-sm font-medium text-surface-400 group-hover:text-white transition-colors whitespace-nowrap">
              Auto-run
            </span>
          </label>
          
          {/* Manual run button */}
          {!autoRun && (
            <button
              onClick={() => setPreviewKey(prev => prev + 1)}
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white rounded-xl transition-all duration-200 font-medium shadow-lg shadow-emerald-500/20 active:scale-95"
              title="Run Code (Ctrl+Enter)"
            >
              <Play className="w-4 h-4" />
              <span className="hidden lg:inline">Run</span>
            </button>
          )}
          
          {/* Share button */}
          <button
            onClick={handleShare}
            className="relative flex items-center gap-2 px-3 md:px-4 py-2 bg-surface-700 hover:bg-surface-600 text-surface-300 hover:text-white rounded-xl transition-all duration-200 border border-white/[0.06] hover:border-white/[0.1] font-medium group"
            title="Share Project"
          >
            <Share2 className="w-4 h-4 transition-transform group-hover:scale-110" />
            <span className="hidden sm:inline">{shareSuccess ? 'Copied!' : 'Share'}</span>
            {shareSuccess && (
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping"></div>
            )}
          </button>
          
          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 md:px-5 py-2 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 disabled:from-emerald-600 disabled:to-emerald-500 text-white rounded-xl transition-all duration-200 font-semibold shadow-lg shadow-primary-500/20 active:scale-95 disabled:scale-100"
            title="Save Project (Ctrl+S)"
          >
            <Save className={`w-4 h-4 ${saving ? 'animate-pulse' : ''}`} />
            <span className="hidden sm:inline">{saving ? 'Saved!' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Tab Bar */}
      <div className="lg:hidden flex border-b border-white/[0.06] bg-surface-900">
        {['html', 'css', 'js', 'preview'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-all duration-200 border-b-2 ${
              activeTab === tab 
                ? 'text-primary-400 border-primary-500 bg-primary-500/10' 
                : 'text-surface-500 border-transparent hover:text-white hover:bg-surface-800'
            }`}
          >
            {tab === 'html' && <Code className="w-4 h-4 inline mr-1.5 text-orange-400" />}
            {tab === 'css' && <Palette className="w-4 h-4 inline mr-1.5 text-cyan-400" />}
            {tab === 'js' && <Zap className="w-4 h-4 inline mr-1.5 text-yellow-400" />}
            {tab === 'preview' && <Eye className="w-4 h-4 inline mr-1.5 text-emerald-400" />}
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Editor Layout */}
      <div className={`flex-1 grid ${getLayoutClasses()} overflow-hidden`}>
        {/* Code Editors - Order changes based on preview position */}
        {previewPosition === 'left' && previewPosition !== 'hidden' && (
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
        )}

        {/* Code Editors Section - WHITE BACKGROUND for clean code feel */}
        <div className={`${previewPosition === 'hidden' ? '' : 'hidden lg:grid'} ${previewPosition === 'bottom' ? 'grid-cols-3' : 'grid-rows-3'} ${previewPosition !== 'left' ? 'lg:border-r' : 'lg:border-l'} border-white/[0.06] bg-white`}>
          <div className={`${previewPosition === 'bottom' ? 'border-r' : 'border-b'} border-gray-200 relative group`}>
            <div className="absolute top-3 right-3 z-10 flex items-center gap-2 px-3 py-1.5 bg-orange-50 border border-orange-200 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Code className="w-3.5 h-3.5 text-orange-500" />
              <span className="text-xs font-medium text-orange-600">HTML</span>
            </div>
            <CodeEditor language="html" value={html} onChange={setHtml} theme="light" />
          </div>
          <div className={`${previewPosition === 'bottom' ? 'border-r' : 'border-b'} border-gray-200 relative group`}>
            <div className="absolute top-3 right-3 z-10 flex items-center gap-2 px-3 py-1.5 bg-cyan-50 border border-cyan-200 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Palette className="w-3.5 h-3.5 text-cyan-500" />
              <span className="text-xs font-medium text-cyan-600">CSS</span>
            </div>
            <CodeEditor language="css" value={css} onChange={setCss} theme="light" />
          </div>
          <div className="relative group">
            <div className="absolute top-3 right-3 z-10 flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-xs font-medium text-amber-600">JavaScript</span>
            </div>
            <CodeEditor language="javascript" value={js} onChange={setJs} theme="light" />
          </div>
        </div>

        {/* Mobile: Show active tab only - WHITE BACKGROUND for editor tabs */}
        <div className="lg:hidden flex-1 bg-white">
          {activeTab === 'html' && <CodeEditor language="html" value={html} onChange={setHtml} theme="light" />}
          {activeTab === 'css' && <CodeEditor language="css" value={css} onChange={setCss} theme="light" />}
          {activeTab === 'js' && <CodeEditor language="javascript" value={js} onChange={setJs} theme="light" />}
          {activeTab === 'preview' && (
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
          )}
        </div>

        {/* Preview Pane - Right or Bottom */}
        {previewPosition !== 'left' && previewPosition !== 'hidden' && (
          <div className="hidden lg:block">
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
      <div className="hidden md:flex items-center justify-center gap-6 py-2.5 bg-surface-900 border-t border-white/[0.06] text-xs text-surface-500">
        <span><kbd>Ctrl</kbd> + <kbd>S</kbd> Save</span>
        <span><kbd>Ctrl</kbd> + <kbd>Enter</kbd> Run</span>
      </div>
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
    <div className={`bg-surface-900 relative flex flex-col ${isMobile ? 'h-full' : 'h-full'}`}>
      {/* Preview Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-surface-850 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse-subtle shadow-lg shadow-emerald-400/50"></div>
          <span className="text-sm font-medium text-surface-300">Live Preview</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Device Selector */}
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setShowDeviceMenu(!showDeviceMenu) }}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-surface-400 hover:text-white hover:bg-surface-700 rounded-lg transition-all duration-200"
            >
              {previewDevice === 'desktop' && <Monitor className="w-4 h-4" />}
              {previewDevice === 'tablet' && <Tablet className="w-4 h-4" />}
              {previewDevice === 'mobile' && <Smartphone className="w-4 h-4" />}
              <ChevronDown className="w-3 h-3" />
            </button>
            {showDeviceMenu && (
              <div className="absolute right-0 top-full mt-1 bg-surface-800 rounded-xl shadow-xl border border-white/[0.08] py-1.5 z-50 animate-scale-in">
                <button onClick={() => { setPreviewDevice('desktop'); setShowDeviceMenu(false) }} className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-2.5 transition-colors ${previewDevice === 'desktop' ? 'text-primary-400 bg-primary-500/10' : 'text-surface-300 hover:text-white hover:bg-surface-700'}`}>
                  <Monitor className="w-4 h-4" /> Desktop
                </button>
                <button onClick={() => { setPreviewDevice('tablet'); setShowDeviceMenu(false) }} className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-2.5 transition-colors ${previewDevice === 'tablet' ? 'text-primary-400 bg-primary-500/10' : 'text-surface-300 hover:text-white hover:bg-surface-700'}`}>
                  <Tablet className="w-4 h-4" /> Tablet
                </button>
                <button onClick={() => { setPreviewDevice('mobile'); setShowDeviceMenu(false) }} className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-2.5 transition-colors ${previewDevice === 'mobile' ? 'text-primary-400 bg-primary-500/10' : 'text-surface-300 hover:text-white hover:bg-surface-700'}`}>
                  <Smartphone className="w-4 h-4" /> Mobile
                </button>
              </div>
            )}
          </div>
          {/* Refresh Button */}
          <button
            onClick={() => setPreviewKey(prev => prev + 1)}
            className="p-1.5 text-surface-500 hover:text-white hover:bg-surface-700 rounded-lg transition-all duration-200"
            title="Refresh Preview"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
      {/* Preview Content - White background preview area */}
      <div className="flex-1 flex items-center justify-center p-4 overflow-auto bg-surface-950/50">
        <div 
          className="bg-white shadow-2xl rounded-xl overflow-hidden h-full transition-all duration-300"
          style={{ 
            width: getDeviceWidth(),
            maxWidth: '100%',
            border: previewDevice !== 'desktop' ? '8px solid #1e1e2e' : '1px solid rgba(255,255,255,0.1)',
            borderRadius: previewDevice !== 'desktop' ? '24px' : '12px'
          }}
        >
          <PreviewPane key={previewKey} html={html} css={css} js={js} />
        </div>
      </div>
    </div>
  )
}
