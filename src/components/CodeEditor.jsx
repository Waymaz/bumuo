import Editor from '@monaco-editor/react'

export const CodeEditor = ({ language, value, onChange, theme = 'light' }) => {
  const getLanguageLabel = () => {
    switch(language) {
      case 'html': return 'HTML'
      case 'css': return 'CSS'
      case 'javascript': return 'JavaScript'
      default: return language
    }
  }

  const getLanguageStyles = () => {
    const styles = {
      html: {
        gradient: 'from-orange-500 to-red-500',
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        text: 'text-orange-600',
        barColor: 'bg-orange-400'
      },
      css: {
        gradient: 'from-cyan-500 to-blue-500',
        bg: 'bg-cyan-50',
        border: 'border-cyan-200',
        text: 'text-cyan-600',
        barColor: 'bg-cyan-400'
      },
      javascript: {
        gradient: 'from-amber-500 to-yellow-500',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        text: 'text-amber-600',
        barColor: 'bg-amber-400'
      }
    }
    return styles[language] || styles.html
  }

  const langStyles = getLanguageStyles()

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Clean header bar */}
      <div className="bg-gray-50/80 border-b border-gray-200 px-4 sm:px-5 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className={`w-1 h-5 rounded-full bg-gradient-to-b ${langStyles.gradient}`}></div>
          <span className="text-sm font-semibold text-gray-700">{getLanguageLabel()}</span>
        </div>
        {/* Window controls (decorative) */}
        <div className="hidden sm:flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-gray-300/50 hover:bg-red-400 transition-colors duration-200 cursor-pointer"></div>
          <div className="w-3 h-3 rounded-full bg-gray-300/50 hover:bg-yellow-400 transition-colors duration-200 cursor-pointer"></div>
          <div className="w-3 h-3 rounded-full bg-gray-300/50 hover:bg-green-400 transition-colors duration-200 cursor-pointer"></div>
        </div>
      </div>
      {/* Editor area - clean white background for coding */}
      <div className="flex-1 min-h-0">
        <Editor
          height="100%"
          language={language}
          value={value}
          onChange={onChange}
          theme="vs"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
            fontFamily: "'Fira Code', 'JetBrains Mono', 'Cascadia Code', Consolas, Monaco, monospace",
            fontLigatures: true,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            smoothScrolling: true,
            padding: { top: 16, bottom: 16 },
            renderLineHighlight: 'all',
            lineHighlightBackground: '#f8fafc',
            bracketPairColorization: { enabled: true },
            guides: {
              indentation: true,
              bracketPairs: true
            },
            scrollbar: {
              verticalScrollbarSize: 10,
              horizontalScrollbarSize: 10,
              useShadows: false,
              verticalSliderSize: 10,
              horizontalSliderSize: 10
            }
          }}
          loading={
            <div className="flex items-center justify-center h-full bg-white">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-primary-500"></div>
            </div>
          }
        />
      </div>
    </div>
  )
}
