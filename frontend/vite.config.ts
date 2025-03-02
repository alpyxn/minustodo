import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as dotenv from 'dotenv'

dotenv.config();

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    port:3000
  },
  define: {
    'process.env.API_URL': JSON.stringify(process.env.API_URL)
  }
})
