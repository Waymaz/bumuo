import { Component } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.setState({ errorInfo })
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return (
        <div className={`flex flex-col items-center justify-center h-full bg-surface-900 p-6 ${this.props.className || ''}`}>
          <div className="bg-surface-800 rounded-2xl p-8 max-w-md w-full text-center border border-white/[0.08] shadow-xl">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">
              {this.props.title || 'Something went wrong'}
            </h2>
            <p className="text-surface-400 mb-6 text-sm">
              {this.props.message || 'An error occurred while rendering this component. This has been logged for debugging.'}
            </p>
            {this.state.error && (
              <details className="mb-6 text-left">
                <summary className="text-surface-500 text-xs cursor-pointer hover:text-surface-300 transition-colors">
                  View error details
                </summary>
                <pre className="mt-2 p-3 bg-surface-950 rounded-lg text-xs text-red-400 overflow-auto max-h-32 border border-white/[0.06]">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl transition-all duration-200 font-medium shadow-lg shadow-primary-500/20"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Specialized Error Boundary for Preview Pane
export class PreviewErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Preview Error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center w-full h-full bg-surface-900 p-4">
          <div className="text-center">
            <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto mb-3" />
            <h3 className="text-white font-medium mb-1">Preview Failed</h3>
            <p className="text-surface-400 text-sm mb-4">Unable to render preview</p>
            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 px-4 py-2 bg-surface-700 hover:bg-surface-600 text-white rounded-lg text-sm transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
          </div>
        </div>
      )
    }

    // Wrap children in a full-size container to ensure height propagation
    return (
      <div className="w-full h-full">
        {this.props.children}
      </div>
    )
  }
}
