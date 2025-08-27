// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3002,
    proxy: {
      "/api": {
        target: "http://185.71.82.247:5001",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""), // убираем /api
      },
      "/devices": {
        target: "http://185.71.82.247:3000",
        changeOrigin: true,
        secure: false,
      },
      "/data": {
        target: "http://185.71.82.247:3000",
        changeOrigin: true,
        secure: false,
      },
      "/sensor": {
        target: "http://185.71.82.247:5001",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""), // убираем /api
      },
    },
  },
});
