import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Streakly',
        short_name: 'Streakly',
        description: 'Build better habits with daily task tracking',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/Streakly02.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/Streakly02.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})
