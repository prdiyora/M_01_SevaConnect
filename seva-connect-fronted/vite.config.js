import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    // Use esbuild instead of lightningcss (Vite 8 default) to avoid
    // platform-specific CSS parsing failures on Vercel's Linux environment.
    minify: 'esbuild',
  },
})
