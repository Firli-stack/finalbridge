import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    host: '0.0.0.0',
    port: 5173,
    watch: {
      usePolling: true, // Memastikan Hot-Reload deteksi Ctrl+S di Windows-Docker secara instan
    },
    proxy: {
      '/api': {
        target: process.env.VITE_BACKEND_URL || 'http://backend:8000',
        changeOrigin: true,
      },
      '/ws': {
        target: process.env.VITE_BACKEND_WS_URL || 'ws://backend:8000',
        ws: true,
      },
      '/stream': {
        target: process.env.VITE_BACKEND_URL || 'http://backend:8000',
        changeOrigin: true,
      },
      '/uploads': {
        target: process.env.VITE_BACKEND_URL || 'http://backend:8000',
        changeOrigin: true,
      },
    },
  },
})
