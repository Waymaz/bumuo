import Editor from '@monaco-editor/react'

export const CodeEditor = ({ language, value, onChange }) => {
  const getLanguageLabel = () => {
    switch(language) {
      case 'html': return 'HTML'
      case 'css': return 'CSS'
      case 'javascript': return 'JavaScript'
      default: return language
    }
  }

  const getLanguageColor = () => {
    switch(language) {
      case 'html': return 'from-orange-500 to-red-500'
      case 'css': return 'from-blue-500 to-cyan-500'
      case 'javascript': return 'from-yellow-500 to-amber-500'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  return (
    <div className="flex flex-col h-full bg-dark-surface">
      <div className="glass-effect border-b border-dark-border/50 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-1 h-6 rounded-full bg-gradient-to-b ${getLanguageColor()}`}></div>
          <span className="text-sm font-semibold text-gray-200">{getLanguageLabel()}</span>
        </div>
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/30 hover:bg-red-500 transition-colors cursor-pointer"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/30 hover:bg-yellow-500 transition-colors cursor-pointer"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/30 hover:bg-green-500 transition-colors cursor-pointer"></div>
        </div>
      </div>
      <div className="flex-1">
        <Editor
          height="100%"
          language={language}
          value={value}
          onChange={onChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
            fontFamily: 'Fira Code, Consolas, Monaco, monospace',
            fontLigatures: true,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            smoothScrolling: true,
            padding: { top: 16, bottom: 16 },
          }}
        />
      </div>
    </div>
  )
}
