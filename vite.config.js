import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    host: true,
    headers: {
      'Content-Security-Policy': `
        default-src 'self';
        script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://maps.googleapis.com;
        style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://m.stripe.network;
        font-src 'self' https://fonts.gstatic.com;
        img-src 'self' data: https:;
        connect-src 'self' http://localhost:5000 http://localhost:* https://api.stripe.com https://maps.googleapis.com;
        frame-src 'self' https://js.stripe.com https://hooks.stripe.com;
        worker-src 'self' blob:;
        media-src 'self' blob:;
        style-src-attr 'unsafe-inline';
      `.replace(/\s+/g, ' ').trim()
    }
  }
})
