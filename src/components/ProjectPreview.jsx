import { useMemo, useState } from 'react'
import { Code2, Eye, EyeOff } from 'lucide-react'

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

/**
 * ProjectPreview - Renders a live mini preview of the project code
 * Uses a scaled iframe to show actual rendered output
 */
export const ProjectPreview = ({ html, css, js, isHovered = false }) => {
  const [previewError, setPreviewError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  // Check if project has any content
  const hasContent = html?.trim() || css?.trim() || js?.trim()

  // Generate the preview document
  const srcDoc = useMemo(() => {
    if (!hasContent) return null
    
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
              background: #ffffff;
              overflow: hidden;
            }
            /* Prevent interactions in preview */
            * {
              pointer-events: none !important;
              user-select: none !important;
            }
            /* Disable animations for cleaner preview */
            *, *::before, *::after {
              animation-duration: 0s !important;
              transition-duration: 0s !important;
            }
            ${css || ''}
          </style>
        </head>
        <body>
          ${safeHtml}
          <script>
            // Suppress all errors in preview thumbnail
            window.onerror = function() { return true; };
            window.onunhandledrejection = function() { return true; };
            try {
              ${js || ''}
            } catch (e) {
              // Silent fail for preview
            }
          </script>
        </body>
      </html>
    `
  }, [html, css, js, hasContent])

  // Empty state with premium styling
  if (!hasContent) {
    return (
      <div
        style={{
          width: '100%',
          aspectRatio: '16/10',
          background: 'linear-gradient(145deg, var(--color-surface-800) 0%, var(--color-surface-900) 100%)',
          borderRadius: '12px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          border: '1px solid rgba(255, 255, 255, 0.04)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative grid pattern */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
            opacity: 0.5,
          }}
        />
        <div
          style={{
            padding: '14px',
            background: 'rgba(59, 130, 246, 0.1)',
            borderRadius: '14px',
            border: '1px solid rgba(59, 130, 246, 0.15)',
          }}
        >
          <Code2 style={{ width: '24px', height: '24px', color: 'var(--color-primary-500)', opacity: 0.7 }} />
        </div>
        <span style={{ fontSize: '13px', color: 'var(--color-surface-500)', fontWeight: 500 }}>
          No preview available
        </span>
      </div>
    )
  }

  return (
    <div
      style={{
        width: '100%',
        aspectRatio: '16/10',
        borderRadius: '12px',
        overflow: 'hidden',
        position: 'relative',
        background: '#ffffff',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: isHovered 
          ? 'inset 0 0 0 2px rgba(59, 130, 246, 0.3), 0 8px 24px rgba(0, 0, 0, 0.2)'
          : 'inset 0 0 0 1px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Iframe container with scaling */}
      <div
        style={{
          width: '400%',
          height: '400%',
          transform: 'scale(0.25)',
          transformOrigin: 'top left',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      >
        <iframe
          title="project-preview"
          srcDoc={srcDoc}
          sandbox="allow-scripts"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            background: '#ffffff',
            display: 'block',
          }}
          onLoad={() => setImageLoaded(true)}
          onError={() => setPreviewError(true)}
        />
      </div>

      {/* Hover overlay with view indicator */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: isHovered 
            ? 'linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.2) 50%, transparent 100%)'
            : 'linear-gradient(to top, rgba(0, 0, 0, 0.4) 0%, transparent 40%)',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          padding: '12px',
          transition: 'all 0.3s ease',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            borderRadius: '20px',
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? 'translateY(0)' : 'translateY(8px)',
            transition: 'all 0.3s ease',
          }}
        >
          <Eye style={{ width: '14px', height: '14px', color: '#ffffff' }} />
          <span style={{ fontSize: '12px', color: '#ffffff', fontWeight: 500 }}>
            Click to open
          </span>
        </div>
      </div>

      {/* Top gradient for depth */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '40px',
          background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.05), transparent)',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}
