import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    server: {
      port: 3000,
      open: true,
      proxy: {
        '/api/foursquare': {
          target: 'https://places-api.foursquare.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/foursquare/, ''),
          configure: (proxy, _options) => {
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              const serviceKey = env.VITE_FOURSQUARE_SERVICE_KEY
              if (serviceKey) {
                proxyReq.setHeader('Authorization', `Bearer ${serviceKey}`)
                proxyReq.setHeader('X-Places-Api-Version', '2025-06-17')
              }
            })
          },
        },
      },
    },
  }
})

