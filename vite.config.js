import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3002,

    //для node.js
    proxy: {
       // Внешний API
      '/api': {
        target: 'https://sandbox.rightech.io',
        changeOrigin: true,
      },
      // Внутренний API
    // '/internal': {
    //   target: 'http://localhost:5001',
    //   changeOrigin: true,
    //   rewrite: (path) => path.replace(/^\/internal/, '') 
    // },
      
    },
    
    
  }
})






                                 
{/* <VirtualHost *:3002>
    ServerName 185.71.82.247

 
    ProxyPreserveHost On
    ProxyPass /api https://sandbox.rightech.io/api
    ProxyPassReverse /api https://sandbox.rightech.io/api

      
    DocumentRoot /home/marina/projects/MeteoApp/dist
    <Directory /home/marina/projects/MeteoApp/dist>
        AllowOverride All
        Require all granted
    </Directory>

  
   # ErrorLog ${APACHE_LOG_DIR}/your-site-error.log
   # CustomLog ${APACHE_LOG_DIR}/your-site-access.log combined
</VirtualHost> */}






