import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import { VitePWA } from 'vite-plugin-pwa'

// Dev-only: the strict CSP meta (`script-src 'self'`) blocks Vite's inline
// HMR preamble and vite-plugin-pwa's inline dev-SW registration script, so
// the service worker never registers on localhost and the browser never
// offers to install the app. Relax script-src just for `vite dev`; the
// production bundle keeps the strict CSP unchanged.
const relaxCspForDev: Plugin = {
  name: 'relax-csp-for-dev',
  apply: 'serve',
  transformIndexHtml(html) {
    return html.replace("script-src 'self';", "script-src 'self' 'unsafe-inline';")
  }
}

export default defineConfig({
  root: 'src/renderer',
  envDir: process.cwd(),
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src/renderer/src'),
      '@renderer': resolve(__dirname, 'src/renderer/src')
    }
  },
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true
    }),
    react(),
    tailwindcss(),
    relaxCspForDev,
    VitePWA({
      registerType: 'autoUpdate',
      // 'auto' injects an external /registerSW.js script (CSP-safe) and keeps
      // the Electron build (electron.vite.config.ts) free of the virtual import.
      injectRegister: 'auto',
      includeAssets: ['apple-touch-icon.png'],
      manifest: {
        name: 'Membership Allocation',
        short_name: 'Membership',
        description:
          'Your membership portal — profile, dependants, payments, and messages in one secure place.',
        lang: 'en',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#0a0f1d',
        theme_color: '#0a0f1d',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icon-maskable-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
          { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        // manifest.webmanifest must be precached too: the installed PWA's
        // window chrome reads the manifest at launch, and if it can't be
        // fetched (offline launch), Chromium falls back to a default WHITE
        // title bar instead of the app's theme color.
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2,webmanifest}'],
        navigateFallback: '/index.html'
      },
    })
  ],
  server: {
    port: 3000
  }
})
