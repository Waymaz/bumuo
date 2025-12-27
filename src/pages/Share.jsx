import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Code2, Eye, Sparkles, ExternalLink } from 'lucide-react'
import { PreviewPane } from '../components/PreviewPane'
import { projectService } from '../services/projectService'

export const Share = () => {
  const { publicLink } = useParams()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProject()
  }, [publicLink])

  const loadProject = async () => {
    const { data, error } = await projectService.getPublicProject(publicLink)
    
    if (!error && data) {
      setProject(data)
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border border-blue-500 opacity-20"></div>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-purple-500/10 to-pink-500/10"></div>
        <div className="text-center relative z-10 animate-fade-in">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full"></div>
            <Code2 className="relative w-24 h-24 text-red-500 mx-auto" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">Project not found</h2>
          <p className="text-gray-400 text-lg">This project may have been deleted or the link is invalid</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-dark-bg">
      {/* Premium Header */}
      <div className="glass-effect border-b border-dark-border/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl border border-blue-500/30">
                <Code2 className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-white">{project.title}</h1>
                  <Sparkles className="w-4 h-4 text-purple-400" />
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Eye className="w-3.5 h-3.5 text-gray-500" />
                  <p className="text-sm text-gray-400">Read-only preview</p>
                </div>
              </div>
            </div>
            
            <a
              href="/"
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl transition-all duration-300 font-medium shadow-lg hover:shadow-glow-sm hover:scale-105 active:scale-95"
            >
              <ExternalLink className="w-4 h-4" />
              Create Your Own
            </a>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="flex-1 relative">
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-4 py-2 glass-effect rounded-xl border border-dark-border/50">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-gray-300">Live Preview</span>
        </div>
        <PreviewPane html={project.html} css={project.css} js={project.js} />
      </div>
    </div>
  )
}
