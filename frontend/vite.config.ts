import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as dotenv from 'dotenv'

dotenv.config()

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/auth': {
        target: 'http://localhost:8180',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path
      },
      '/realms': {
        target: 'http://localhost:8180',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path
      },
      '/realms/task': {
        target: 'http://localhost:8180',
        changeOrigin: true,
        secure: false
      },
      '/resources': {
        target: 'http://localhost:8180',
        changeOrigin: true,
        secure: false
      }
    }
  },
  define: {
    'process.env': process.env
  }
})
