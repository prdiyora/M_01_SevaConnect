import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { vercelToolbar } from '@vercel/toolbar/plugins/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), vercelToolbar()],
  css: {
    // Use esbuild instead of lightningcss (Vite 8 default) to avoid
    // platform-specific CSS parsing failures on Vercel's Linux environment.
    minify: 'esbuild',
  },
})
