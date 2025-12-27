import { Code2, Sparkles } from 'lucide-react'

export const LoadingScreen = ({ message = 'Loading...' }) => {
  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)] animate-pulse"></div>
      
      <div className="relative z-10 text-center animate-fade-in">
        {/* Logo with glow effect */}
        <div className="relative inline-block mb-8">
          <div className="absolute inset-0 bg-blue-500/30 blur-3xl rounded-full animate-pulse"></div>
          <Code2 className="relative w-20 h-20 text-blue-500 mx-auto animate-pulse" />
          <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-purple-400 animate-bounce" />
        </div>
        
        {/* Spinner */}
        <div className="relative inline-block mb-6">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border border-blue-500 opacity-20"></div>
        </div>
        
        {/* Message */}
        <p className="text-gray-400 text-lg animate-pulse">{message}</p>
      </div>
    </div>
  )
}
