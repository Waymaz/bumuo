import { useEffect, useRef, useState, useMemo, forwardRef, useImperativeHandle } from 'react'

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

export const PreviewPane = forwardRef(({ html, css, js }, ref) => {
  const [error, setError] = useState(null)
  const iframeRef = useRef(null)

  // Expose the iframe ref so parent can disable pointer-events during resize
  useImperativeHandle(ref, () => ({
    getIframe: () => iframeRef.current,
  }))

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

            /* BumuO Preview Toast Notification */
            .bumuo-preview-toast {
              position: fixed;
              bottom: 20px;
              left: 50%;
              transform: translateX(-50%) translateY(100px);
              background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
              color: #e2e8f0;
              padding: 12px 20px;
              border-radius: 12px;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              font-size: 13px;
              font-weight: 500;
              box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.08);
              z-index: 999999;
              display: flex;
              align-items: center;
              gap: 10px;
              max-width: 90%;
              opacity: 0;
              transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.25s ease;
              pointer-events: none;
              backdrop-filter: blur(12px);
              -webkit-backdrop-filter: blur(12px);
            }
            .bumuo-preview-toast.visible {
              transform: translateX(-50%) translateY(0);
              opacity: 1;
            }
            .bumuo-preview-toast .toast-icon {
              display: flex;
              align-items: center;
              justify-content: center;
              width: 28px;
              height: 28px;
              background: rgba(59, 130, 246, 0.15);
              border-radius: 8px;
              flex-shrink: 0;
            }
            .bumuo-preview-toast .toast-icon svg {
              width: 16px;
              height: 16px;
              color: #60a5fa;
            }
            .bumuo-preview-toast .toast-text {
              line-height: 1.4;
            }
            .bumuo-preview-toast .toast-hint {
              font-size: 11px;
              color: #94a3b8;
              margin-top: 2px;
            }

            ${css || ''}
          </style>
        </head>
        <body>
          ${safeHtml}

          <!-- BumuO Preview Toast Element -->
          <div class="bumuo-preview-toast" id="bumuo-toast">
            <div class="toast-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="16" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
            </div>
            <div>
              <div class="toast-text">This link isn't connected yet</div>
              <div class="toast-hint">Navigation is disabled in preview mode</div>
            </div>
          </div>

          <script>
            // ===== BumuO Preview Navigation Guard =====
            // Intercept all navigation attempts (dead links, form submits, etc.)
            // and show a friendly toast instead of breaking the preview
            (function() {
              var toastTimer = null;

              function showToast(message, hint) {
                var toast = document.getElementById('bumuo-toast');
                if (!toast) return;
                var textEl = toast.querySelector('.toast-text');
                var hintEl = toast.querySelector('.toast-hint');
                if (textEl) textEl.textContent = message || "This link isn't connected yet";
                if (hintEl) hintEl.textContent = hint || "Navigation is disabled in preview mode";
                
                // Clear any existing timer
                if (toastTimer) clearTimeout(toastTimer);
                
                // Show toast
                toast.classList.add('visible');
                
                // Auto-hide after 3 seconds
                toastTimer = setTimeout(function() {
                  toast.classList.remove('visible');
                }, 3000);
              }

              // Intercept all click events on links
              document.addEventListener('click', function(e) {
                var link = e.target.closest('a');
                if (!link) return;

                var href = link.getAttribute('href');
                
                // Allow valid anchor links that point to IDs on the page
                if (href && href.startsWith('#') && href.length > 1) {
                  var targetId = href.substring(1);
                  var targetEl = document.getElementById(targetId);
                  if (targetEl) return; // Valid anchor, let it work
                }

                // Block all other navigation
                if (href === '#' || href === '' || href === 'javascript:void(0)' || !href) {
                  e.preventDefault();
                  e.stopPropagation();
                  showToast("This link isn't connected yet", "Add a valid URL to enable navigation");
                  return;
                }

                // Block relative URLs and non-http links that would break the iframe
                if (href && !href.startsWith('http://') && !href.startsWith('https://') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
                  e.preventDefault();
                  e.stopPropagation();
                  showToast("Local file links aren't available", "Use full URLs (https://) for external links");
                  return;
                }

                // For external URLs, open in a new tab instead of inside the iframe
                if (href && (href.startsWith('http://') || href.startsWith('https://'))) {
                  e.preventDefault();
                  e.stopPropagation();
                  window.parent.postMessage({ type: 'preview-open-url', url: href }, '*');
                  showToast("Opening link in new tab...", href.length > 50 ? href.substring(0, 50) + '...' : href);
                  return;
                }
              }, true); // Use capture phase to intercept before user scripts

              // Intercept form submissions
              document.addEventListener('submit', function(e) {
                var form = e.target;
                var action = form.getAttribute('action');
                
                if (!action || action === '#' || action === '' || (!action.startsWith('http://') && !action.startsWith('https://'))) {
                  e.preventDefault();
                  e.stopPropagation();
                  showToast("Form submission is disabled", "Forms don't submit in preview mode");
                }
              }, true);

              // Block window.location changes
              var origAssign = window.location.assign;
              var origReplace = window.location.replace;
              window.location.assign = function() {
                showToast("Navigation blocked", "Page redirects are disabled in preview");
              };
              window.location.replace = function() {
                showToast("Navigation blocked", "Page redirects are disabled in preview");
              };
            })();

            // ===== User Code Error Handling =====
            window.onerror = function(message, source, lineno, colno, error) {
              if (message && typeof message === 'string') {
                // Filter out noise from sandbox restrictions
                if (message.includes('LockManager') || message.includes('SecurityError')) {
                  return true;
                }
                window.parent.postMessage({ type: 'preview-error', message: message }, '*');
              }
              return true;
            };

            window.addEventListener('unhandledrejection', function(e) {
              if (e.reason && e.reason.message) {
                // Filter sandbox-related errors
                if (e.reason.message.includes('LockManager') || e.reason.message.includes('SecurityError')) {
                  e.preventDefault();
                  return;
                }
              }
            });

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

  // Listen for messages from iframe (errors & external URL open requests)
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === 'preview-error') {
        setError(event.data.message)
      }
      if (event.data?.type === 'preview-open-url') {
        // Open external URLs in a new browser tab
        window.open(event.data.url, '_blank', 'noopener,noreferrer')
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
        ref={iframeRef}
        title="preview"
        srcDoc={srcDoc}
        sandbox="allow-scripts allow-modals"
        className="absolute inset-0 w-full h-full bg-white border-0"
        style={{ pointerEvents: 'auto' }}
      />
    </div>
  )
})
