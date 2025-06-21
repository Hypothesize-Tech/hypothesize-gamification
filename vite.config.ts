import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['stream', 'buffer', 'util', 'process'],
  },
  resolve: {
    alias: {
      stream: false,
      buffer: false,
      util: false,
      process: false,
    },
  },
})
