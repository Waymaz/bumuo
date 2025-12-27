import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react'
import { useEffect } from 'react'

export const Toast = ({ type = 'success', message, onClose, duration = 3000 }) => {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  const config = {
    success: {
      icon: CheckCircle,
      bgColor: 'from-green-500/20 to-emerald-500/20',
      borderColor: 'border-green-500/50',
      iconColor: 'text-green-400',
      textColor: 'text-green-300'
    },
    error: {
      icon: XCircle,
      bgColor: 'from-red-500/20 to-rose-500/20',
      borderColor: 'border-red-500/50',
      iconColor: 'text-red-400',
      textColor: 'text-red-300'
    },
    info: {
      icon: Info,
      bgColor: 'from-blue-500/20 to-cyan-500/20',
      borderColor: 'border-blue-500/50',
      iconColor: 'text-blue-400',
      textColor: 'text-blue-300'
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'from-yellow-500/20 to-amber-500/20',
      borderColor: 'border-yellow-500/50',
      iconColor: 'text-yellow-400',
      textColor: 'text-yellow-300'
    }
  }

  const { icon: Icon, bgColor, borderColor, iconColor, textColor } = config[type]

  return (
    <div className={`fixed top-6 right-6 z-50 animate-slide-up`}>
      <div className={`flex items-center gap-3 px-5 py-4 bg-gradient-to-r ${bgColor} backdrop-blur-xl border ${borderColor} rounded-2xl shadow-2xl min-w-[320px]`}>
        <Icon className={`w-5 h-5 ${iconColor} flex-shrink-0`} />
        <p className={`flex-1 text-sm font-medium ${textColor}`}>{message}</p>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
