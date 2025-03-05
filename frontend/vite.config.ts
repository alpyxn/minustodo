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
        secure: false
      },
      '/realms': {
        target: 'http://localhost:8180',
        changeOrigin: true,
        secure: false
      }
    },
    cors: {
      origin: ['http://localhost:8180'],
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
      credentials: true,
      allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
      exposedHeaders: ['Authorization']
    },
    headers: {
      'Content-Security-Policy': [
        "default-src 'self' http://localhost:8180",
        "img-src 'self' data: blob: http://localhost:8180",
        "frame-src 'self' http://localhost:8180",
        "frame-ancestors 'self' http://localhost:8180",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
        "style-src 'self' 'unsafe-inline'",
        "connect-src 'self' http://localhost:8180 http://localhost:8081 ws://localhost:3000",
        "base-uri 'self'",
        "form-action 'self'",
        "object-src 'none'"
      ].join('; '),
      'X-Frame-Options': 'SAMEORIGIN',
      'X-Content-Type-Options': 'nosniff'
    }
  },
  define: {
    'process.env': process.env
  }
})
