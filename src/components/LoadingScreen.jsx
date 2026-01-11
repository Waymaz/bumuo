import { useState, useEffect } from 'react'

export const LoadingScreen = ({ message = 'Initializing workspace...' }) => {
  const [currentLine, setCurrentLine] = useState(0)
  const [currentChar, setCurrentChar] = useState(0)
  const [completedLines, setCompletedLines] = useState([])
  
  // Code lines that will be "typed" during loading
  const codeLines = [
    { text: 'const', type: 'keyword' },
    { text: ' bumuo', type: 'variable' },
    { text: ' = ', type: 'operator' },
    { text: 'await', type: 'keyword' },
    { text: ' init', type: 'function' },
    { text: '();', type: 'punctuation' },
  ]

  const fullLine = codeLines.map(c => c.text).join('')

  useEffect(() => {
    if (currentChar < fullLine.length) {
      const timer = setTimeout(() => {
        setCurrentChar(prev => prev + 1)
      }, 50 + Math.random() * 30) // Simulate human typing speed
      return () => clearTimeout(timer)
    } else {
      // Line complete, add to completed lines and start new line
      const timer = setTimeout(() => {
        setCompletedLines(prev => [...prev, currentLine])
        if (currentLine < 2) {
          setCurrentLine(prev => prev + 1)
          setCurrentChar(0)
        }
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [currentChar, currentLine, fullLine.length])

  // Render typed text with syntax highlighting
  const renderTypedText = () => {
    const typedText = fullLine.substring(0, currentChar)
    let charIndex = 0
    
    return codeLines.map((segment, idx) => {
      const segmentStart = charIndex
      const segmentEnd = charIndex + segment.text.length
      charIndex = segmentEnd
      
      // Calculate how much of this segment to show
      const visibleLength = Math.min(
        Math.max(0, currentChar - segmentStart),
        segment.text.length
      )
      
      if (visibleLength <= 0) return null
      
      const visibleText = segment.text.substring(0, visibleLength)
      
      return (
        <span key={idx} style={getTokenStyle(segment.type)}>
          {visibleText}
        </span>
      )
    })
  }

  const getTokenStyle = (type) => {
    const styles = {
      keyword: { color: '#c678dd' },      // Purple for keywords
      variable: { color: '#e5c07b' },     // Yellow for variables
      operator: { color: '#abb2bf' },     // Gray for operators
      function: { color: '#61afef' },     // Blue for functions
      punctuation: { color: '#abb2bf' },  // Gray for punctuation
      string: { color: '#98c379' },       // Green for strings
      comment: { color: '#5c6370', fontStyle: 'italic' },
    }
    return styles[type] || {}
  }

  return (
    <div style={containerStyle}>
      {/* Animated background grid */}
      <div style={gridOverlayStyle} />
      
      {/* Floating code particles */}
      <div style={particlesContainerStyle}>
        {[...Array(6)].map((_, i) => (
          <div 
            key={i} 
            style={{
              ...particleStyle,
              left: `${15 + i * 15}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + i * 0.5}s`,
            }}
          >
            {['</', '/>', '{}', '()', '[]', '=>'][i]}
          </div>
        ))}
      </div>
      
      {/* Main content */}
      <div style={contentStyle}>
        {/* Terminal window */}
        <div style={terminalStyle}>
          {/* Terminal header */}
          <div style={terminalHeaderStyle}>
            <div style={terminalDotsStyle}>
              <span style={{ ...dotStyle, background: '#ff5f56' }} />
              <span style={{ ...dotStyle, background: '#ffbd2e' }} />
              <span style={{ ...dotStyle, background: '#27ca3f' }} />
            </div>
            <span style={terminalTitleStyle}>bumuo — initializing</span>
          </div>
          
          {/* Terminal body */}
          <div style={terminalBodyStyle}>
            {/* Previous completed lines */}
            {completedLines.includes(0) && (
              <div style={lineStyle}>
                <span style={lineNumberStyle}>1</span>
                <span style={getTokenStyle('comment')}>// Setting up your workspace</span>
              </div>
            )}
            {completedLines.includes(1) && (
              <div style={lineStyle}>
                <span style={lineNumberStyle}>2</span>
                <span style={getTokenStyle('keyword')}>import</span>
                <span style={getTokenStyle('operator')}> {'{'} </span>
                <span style={getTokenStyle('variable')}>creativity</span>
                <span style={getTokenStyle('operator')}> {'}'} </span>
                <span style={getTokenStyle('keyword')}>from</span>
                <span style={getTokenStyle('string')}> 'you'</span>
                <span style={getTokenStyle('punctuation')}>;</span>
              </div>
            )}
            
            {/* Current typing line */}
            <div style={lineStyle}>
              <span style={lineNumberStyle}>{completedLines.length + 1}</span>
              {currentLine === 0 && !completedLines.includes(0) && (
                <>
                  <span style={getTokenStyle('comment')}>
                    {'// Setting up your workspace'.substring(0, currentChar)}
                  </span>
                </>
              )}
              {currentLine === 1 && !completedLines.includes(1) && (
                <>
                  {renderImportLine()}
                </>
              )}
              {currentLine === 2 && (
                <>
                  {renderTypedText()}
                </>
              )}
              <span style={cursorStyle}>|</span>
            </div>
          </div>
        </div>
        
        {/* Loading indicator */}
        <div style={loadingBarContainerStyle}>
          <div style={loadingBarStyle}>
            <div style={loadingBarFillStyle} />
          </div>
          <p style={messageStyle}>{message}</p>
        </div>
      </div>
    </div>
  )
  
  function renderImportLine() {
    const importParts = [
      { text: 'import', type: 'keyword' },
      { text: ' { ', type: 'operator' },
      { text: 'creativity', type: 'variable' },
      { text: ' } ', type: 'operator' },
      { text: 'from', type: 'keyword' },
      { text: " 'you'", type: 'string' },
      { text: ';', type: 'punctuation' },
    ]
    
    const fullImport = importParts.map(c => c.text).join('')
    let charIdx = 0
    
    return importParts.map((segment, idx) => {
      const segmentStart = charIdx
      charIdx += segment.text.length
      
      const visibleLength = Math.min(
        Math.max(0, currentChar - segmentStart),
        segment.text.length
      )
      
      if (visibleLength <= 0) return null
      
      return (
        <span key={idx} style={getTokenStyle(segment.type)}>
          {segment.text.substring(0, visibleLength)}
        </span>
      )
    })
  }
}

// Styles
const containerStyle = {
  minHeight: '100vh',
  backgroundColor: '#0a0a0f',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  overflow: 'hidden',
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
}

const gridOverlayStyle = {
  position: 'absolute',
  inset: 0,
  backgroundImage: `
    linear-gradient(rgba(59, 130, 246, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(59, 130, 246, 0.03) 1px, transparent 1px)
  `,
  backgroundSize: '50px 50px',
  animation: 'grid-move 20s linear infinite',
}

const particlesContainerStyle = {
  position: 'absolute',
  inset: 0,
  overflow: 'hidden',
  pointerEvents: 'none',
}

const particleStyle = {
  position: 'absolute',
  fontSize: '24px',
  fontFamily: "'Fira Code', monospace",
  color: 'rgba(59, 130, 246, 0.15)',
  animation: 'float-up 4s ease-in-out infinite',
  bottom: '-50px',
}

const contentStyle = {
  position: 'relative',
  zIndex: 10,
  width: '100%',
  maxWidth: '540px',
  padding: '24px',
  animation: 'fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
}

const terminalStyle = {
  background: '#1e1e2e',
  borderRadius: '16px',
  overflow: 'hidden',
  boxShadow: '0 25px 80px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)',
}

const terminalHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '14px 16px',
  background: '#161622',
  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
}

const terminalDotsStyle = {
  display: 'flex',
  gap: '8px',
}

const dotStyle = {
  width: '12px',
  height: '12px',
  borderRadius: '50%',
}

const terminalTitleStyle = {
  flex: 1,
  textAlign: 'center',
  fontSize: '13px',
  color: 'rgba(255, 255, 255, 0.4)',
  fontWeight: 500,
  marginRight: '60px',
}

const terminalBodyStyle = {
  padding: '20px',
  fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
  fontSize: '14px',
  lineHeight: 1.8,
  minHeight: '120px',
}

const lineStyle = {
  display: 'flex',
  alignItems: 'center',
}

const lineNumberStyle = {
  width: '30px',
  color: 'rgba(255, 255, 255, 0.2)',
  fontSize: '12px',
  userSelect: 'none',
  textAlign: 'right',
  paddingRight: '16px',
}

const cursorStyle = {
  display: 'inline-block',
  color: '#61afef',
  animation: 'blink 1s step-end infinite',
  fontWeight: 300,
  marginLeft: '1px',
}

const loadingBarContainerStyle = {
  marginTop: '32px',
  textAlign: 'center',
}

const loadingBarStyle = {
  height: '3px',
  background: 'rgba(255, 255, 255, 0.1)',
  borderRadius: '100px',
  overflow: 'hidden',
  marginBottom: '16px',
}

const loadingBarFillStyle = {
  height: '100%',
  width: '30%',
  background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #3b82f6)',
  backgroundSize: '200% 100%',
  animation: 'loading-bar 1.5s ease-in-out infinite',
  borderRadius: '100px',
}

const messageStyle = {
  color: 'rgba(255, 255, 255, 0.4)',
  fontSize: '14px',
  fontWeight: 500,
}

// Add keyframes via style tag injection (for animations)
if (typeof document !== 'undefined') {
  const styleId = 'bumuo-loading-animations'
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style')
    style.id = styleId
    style.textContent = `
      @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
      }
      @keyframes loading-bar {
        0% { transform: translateX(-100%); }
        50% { transform: translateX(200%); }
        100% { transform: translateX(-100%); }
      }
      @keyframes float-up {
        0%, 100% { 
          transform: translateY(0) rotate(0deg);
          opacity: 0;
        }
        10% { opacity: 0.15; }
        90% { opacity: 0.15; }
        100% { 
          transform: translateY(-100vh) rotate(360deg);
          opacity: 0;
        }
      }
      @keyframes grid-move {
        0% { transform: translate(0, 0); }
        100% { transform: translate(50px, 50px); }
      }
    `
    document.head.appendChild(style)
  }
}
