// В режиме разработки (npm run dev) работает прокси из vite.config.js
// В production (server.cjs) работает прокси из Express (создан отдельно)
// Они конфликтуют, так как сборка пытается использовать vite-прокси, которого нет в production, поэтому меняем vite.config.js на это:

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5050,
    proxy: {
      '/api': {  // Добавляем /api префикс для всех API запросов
        target: 'http://185.71.82.247:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: false
      }
    }
  },
  build: {
    outDir: './dist',
    emptyOutDir: true
  }
})