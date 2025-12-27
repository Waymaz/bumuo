import { useEffect, useRef } from 'react'

export const PreviewPane = ({ html, css, js }) => {
  const iframeRef = useRef(null)

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    const document = iframe.contentDocument
    const documentContents = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>${css}</style>
        </head>
        <body>
          ${html}
          <script>
            try {
              ${js}
            } catch (error) {
              console.error('Error:', error)
              document.body.innerHTML += '<div style="color: red; padding: 20px; font-family: monospace;">Error: ' + error.message + '</div>'
            }
          </script>
        </body>
      </html>
    `

    document.open()
    document.write(documentContents)
    document.close()
  }, [html, css, js])

  return (
    <div className="flex flex-col h-full">
      <div className="bg-dark-surface border-b border-dark-border px-4 py-2">
        <span className="text-sm font-medium text-gray-300">Preview</span>
      </div>
      <iframe
        ref={iframeRef}
        title="preview"
        sandbox="allow-scripts"
        className="w-full flex-1 bg-white"
      />
    </div>
  )
}
