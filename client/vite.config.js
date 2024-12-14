import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // All requests from Frontend first go to Vite server (localhost:5173)
  // Vite then forwards these requests to backend (localhost:8080)
  // Browser thinks all requests are coming from the same origin (8080)
  server: {
    proxy: {
      '/api': {
        target: 'https://kawach-server.onrender.com',
        changeOrigin: true,
      }
    }
  }
})
