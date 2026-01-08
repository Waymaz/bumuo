import { useEffect, useRef, useState } from 'react'

export const PreviewPane = ({ html, css, js }) => {
  const iframeRef = useRef(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    setError(null)

    const document = iframe.contentDocument
    const documentContents = `
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
            ${css}
          </style>
        </head>
        <body>
          ${html}
          <script>
            window.onerror = function(message, source, lineno, colno, error) {
              window.parent.postMessage({ type: 'error', message: message }, '*');
              return true;
            };
            try {
              ${js}
            } catch (error) {
              window.parent.postMessage({ type: 'error', message: error.message }, '*');
              console.error('JavaScript Error:', error);
            }
          </script>
        </body>
      </html>
    `

    document.open()
    document.write(documentContents)
    document.close()
  }, [html, css, js])

  // Listen for errors from iframe
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === 'error') {
        setError(event.data.message)
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  return (
    <div className="flex flex-col h-full bg-white">
      {error && (
        <div className="px-4 py-2 bg-red-50 border-b border-red-200 text-red-600 text-sm font-mono flex items-center gap-2">
          <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></span>
          <span className="truncate">Error: {error}</span>
        </div>
      )}
      <iframe
        ref={iframeRef}
        title="preview"
        sandbox="allow-scripts allow-modals"
        className="w-full flex-1 bg-white border-0"
      />
    </div>
  )
}
