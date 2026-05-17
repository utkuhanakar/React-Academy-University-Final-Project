import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

/** GitHub Pages repo adıyla eşlenen alt yol (`user.github.io/REPO_NAME/`). */
const GH_PAGES_BASE = '/React-Academy-University-Final-Project/'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: command === 'serve' ? '/' : GH_PAGES_BASE,
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    include: ['@supabase/supabase-js'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react-syntax-highlighter'))
            return 'syntax-highlighter'
          if (id.includes('node_modules/react-live')) return 'react-live'
          if (id.includes('node_modules/react-markdown')) return 'react-markdown'
          return undefined
        },
      },
    },
  },
}))
