import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Save, Share2, ArrowLeft, Play, Pause, Sparkles, Code, Palette, Zap } from 'lucide-react'
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

  if (!project) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border border-blue-500 opacity-20"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-dark-bg">
      <Navbar />
      
      {/* Enhanced Toolbar */}
      <div className="glass-effect border-b border-dark-border/50 px-6 py-4 flex items-center justify-between backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 text-gray-400 hover:text-white hover:bg-dark-card rounded-xl transition-all duration-300 group"
          >
            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          </button>
          
          <div className="h-8 w-px bg-dark-border"></div>
          
          <div className="relative">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-dark-card border border-dark-border rounded-xl px-4 py-2 text-white font-medium focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all min-w-[300px]"
            />
            <Sparkles className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400 opacity-50" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Auto-run toggle */}
          <label className="flex items-center gap-3 px-4 py-2 bg-dark-card rounded-xl border border-dark-border cursor-pointer hover:border-blue-500/50 transition-all group">
            <div className="relative">
              <input
                type="checkbox"
                checked={autoRun}
                onChange={(e) => setAutoRun(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-dark-surface rounded-full peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-500 transition-all"></div>
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
            </div>
            <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
              Auto-run
            </span>
          </label>
          
          {/* Manual run button */}
          {!autoRun && (
            <button
              onClick={() => setPreviewKey(prev => prev + 1)}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-xl transition-all duration-300 font-medium shadow-lg hover:scale-105 active:scale-95"
            >
              <Play className="w-4 h-4" />
              Run
            </button>
          )}
          
          {/* Share button */}
          <button
            onClick={handleShare}
            className="relative flex items-center gap-2 px-5 py-2.5 bg-dark-card hover:bg-dark-hover text-white rounded-xl transition-all duration-300 border border-dark-border hover:border-purple-500/50 font-medium group"
          >
            <Share2 className="w-4 h-4 transition-transform group-hover:scale-110" />
            {shareSuccess ? 'Copied!' : 'Share'}
            {shareSuccess && (
              <div className="absolute -top-2 -right-2 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
            )}
          </button>
          
          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 disabled:from-green-600 disabled:to-green-500 text-white rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-glow-sm hover:scale-105 active:scale-95 disabled:scale-100"
          >
            <Save className={`w-4 h-4 ${saving ? 'animate-pulse' : ''}`} />
            {saving ? 'Saved!' : 'Save'}
          </button>
        </div>
      </div>

      {/* Editor Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden">
        {/* Code Editors */}
        <div className="grid grid-rows-3 border-r border-dark-border/50">
          <div className="border-b border-dark-border/50 relative group">
            <div className="absolute top-3 right-3 z-10 flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 border border-orange-500/30 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
              <Code className="w-3.5 h-3.5 text-orange-400" />
              <span className="text-xs font-medium text-orange-400">HTML</span>
            </div>
            <CodeEditor language="html" value={html} onChange={setHtml} />
          </div>
          <div className="border-b border-dark-border/50 relative group">
            <div className="absolute top-3 right-3 z-10 flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/30 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
              <Palette className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-xs font-medium text-blue-400">CSS</span>
            </div>
            <CodeEditor language="css" value={css} onChange={setCss} />
          </div>
          <div className="relative group">
            <div className="absolute top-3 right-3 z-10 flex items-center gap-2 px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/30 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
              <Zap className="w-3.5 h-3.5 text-yellow-400" />
              <span className="text-xs font-medium text-yellow-400">JavaScript</span>
            </div>
            <CodeEditor language="javascript" value={js} onChange={setJs} />
          </div>
        </div>

        {/* Preview Pane */}
        <div className="bg-dark-surface relative">
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-4 py-2 glass-effect rounded-xl border border-dark-border/50">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-300">Live Preview</span>
          </div>
          <PreviewPane key={previewKey} html={html} css={css} js={js} />
        </div>
      </div>
    </div>
  )
}
