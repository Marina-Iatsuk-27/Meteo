import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,

    //для node.js
    proxy: {
       // Внешний API
      '/api': {
        target: 'https://sandbox.rightech.io',
        changeOrigin: true,
      },
      // Внутренний API
    '/internal': {
      target: 'http://localhost:5001',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/internal/, '') 
    },
      
    },
    
    
  }
})
