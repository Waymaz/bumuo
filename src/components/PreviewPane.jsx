import { useEffect, useRef, useState, useMemo } from 'react'

export const PreviewPane = ({ html, css, js }) => {
  const [error, setError] = useState(null)

  // Generate the srcDoc content - more reliable than document.write()
  const srcDoc = useMemo(() => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            * {
              box-sizing: border-box;
            }
            body {
              margin: 0;
              padding: 16px;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            }
            ${css || ''}
          </style>
        </head>
        <body>
          ${html || ''}
          <script>
            window.onerror = function(message, source, lineno, colno, error) {
              window.parent.postMessage({ type: 'preview-error', message: message }, '*');
              return true;
            };
            try {
              ${js || ''}
            } catch (error) {
              window.parent.postMessage({ type: 'preview-error', message: error.message }, '*');
              console.error('JavaScript Error:', error);
            }
          </script>
        </body>
      </html>
    `
  }, [html, css, js])

  // Listen for errors from iframe
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === 'preview-error') {
        setError(event.data.message)
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  // Clear errors when code changes
  useEffect(() => {
    setError(null)
  }, [html, css, js])

  return (
    <div className="relative w-full h-full bg-white">
      {error && (
        <div className="absolute top-0 left-0 right-0 z-10 px-4 py-2 bg-red-50 border-b border-red-200 text-red-600 text-sm font-mono flex items-center gap-2">
          <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></span>
          <span className="truncate">Error: {error}</span>
        </div>
      )}
      <iframe
        title="preview"
        srcDoc={srcDoc}
        sandbox="allow-scripts allow-modals"
        className="absolute inset-0 w-full h-full bg-white border-0"
      />
    </div>
  )
}
