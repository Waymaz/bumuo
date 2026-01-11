import { useEffect, useRef, useState, useMemo } from 'react'

// Sanitize HTML to remove external resource references that would cause 404 errors
// This preserves inline content but removes src/href attributes pointing to local files
const sanitizeHtmlForPreview = (html) => {
  if (!html) return ''
  
  // Remove script tags with src attributes (external scripts)
  // But keep inline scripts (those without src or with data:/https:/http: URLs)
  let sanitized = html.replace(
    /<script\s+[^>]*src=["'](?!data:|https?:\/\/|blob:)([^"']*)["'][^>]*>\s*<\/script>/gi,
    '<!-- External script removed: $1 -->'
  )
  
  // Remove link tags with href to local stylesheets
  // But keep external CDN stylesheets (https://)
  sanitized = sanitized.replace(
    /<link\s+[^>]*href=["'](?!data:|https?:\/\/|blob:)([^"']*\.css)["'][^>]*\/?>/gi,
    '<!-- External stylesheet removed: $1 -->'
  )
  
  // Remove img src pointing to local files (but keep data:, https://, http://, blob:)
  sanitized = sanitized.replace(
    /(<img\s+[^>]*src=["'])(?!data:|https?:\/\/|blob:)([^"']+)(["'][^>]*>)/gi,
    '$1data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7$3'
  )
  
  return sanitized
}

export const PreviewPane = ({ html, css, js }) => {
  const [error, setError] = useState(null)

  // Generate the srcDoc content - more reliable than document.write()
  const srcDoc = useMemo(() => {
    // Sanitize HTML to remove external resource references that would cause 404s
    const safeHtml = sanitizeHtmlForPreview(html)
    
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
          ${safeHtml}
          <script>
            window.onerror = function(message, source, lineno, colno, error) {
              if (message && source) {
                window.parent.postMessage({ type: 'preview-error', message: message }, '*');
              }
              return true;
            };
            try {
              ${js || ''}
            } catch (error) {
              window.parent.postMessage({ type: 'preview-error', message: error.message }, '*');
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
