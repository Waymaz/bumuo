import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Production optimizations using esbuild (faster than terser)
    minify: 'esbuild',
    rollupOptions: {
      output: {
        // Code splitting for better caching
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          editor: ['@monaco-editor/react'],
          supabase: ['@supabase/supabase-js'],
        },
      },
    },
    // Generate source maps for debugging production issues
    sourcemap: false,
    // Reduce chunk size warnings
    chunkSizeWarningLimit: 1000,
  },
  // Dependency pre-bundling optimization
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'lucide-react'],
  },
  // Remove console.log in production via esbuild
  esbuild: {
    drop: ['console', 'debugger'],
  },
})
