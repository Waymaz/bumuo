import { Home, Search, Code2, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-pink-500/10"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.15),transparent_50%)] animate-pulse"></div>
      
      <div className="relative z-10 text-center animate-fade-in max-w-2xl">
        {/* 404 with glow */}
        <div className="relative inline-block mb-8">
          <div className="absolute inset-0 bg-purple-500/30 blur-3xl rounded-full"></div>
          <h1 className="relative text-9xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent">
            404
          </h1>
        </div>
        
        {/* Icon */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <Code2 className="w-12 h-12 text-blue-500" />
          <Sparkles className="w-8 h-8 text-purple-400 animate-pulse" />
        </div>
        
        {/* Message */}
        <h2 className="text-3xl font-bold text-white mb-4">Page Not Found</h2>
        <p className="text-gray-400 text-lg mb-12 max-w-md mx-auto">
          Oops! The page you're looking for seems to have wandered off into the code void.
        </p>
        
        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="group flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 text-white rounded-2xl font-semibold transition-all duration-500 shadow-glow-md hover:scale-105 active:scale-95 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            <Home className="w-5 h-5 relative z-10" />
            <span className="relative z-10">Go to Dashboard</span>
          </button>
          
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-dark-card hover:bg-dark-hover text-white rounded-2xl font-semibold transition-all duration-300 border border-dark-border hover:border-purple-500/50"
          >
            <Search className="w-5 h-5" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  )
}
