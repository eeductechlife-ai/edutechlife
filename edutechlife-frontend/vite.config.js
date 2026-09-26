import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { visualizer } from 'rollup-plugin-visualizer'
import path from 'path'

// Solo `vite dev`: la vista de prueba /dev/ingenia no tiene sesión, así que sus
// llamadas de IA llegan aquí y salen a DeepSeek con la clave del backend local
// (edutechlife-backend/.env). No existe en el build (apply: 'serve'), la clave
// nunca llega al navegador y solo atiende peticiones de este mismo equipo.
function devIngenIAAi() {
  return {
    name: 'dev-ingenia-ai',
    apply: 'serve',
    configureServer(server) {
      const env = loadEnv('development', path.resolve(__dirname, '../edutechlife-backend'), 'DEEPSEEK_')
      server.middlewares.use('/__dev/ai', async (req, res) => {
        const send = (status, body) => {
          res.statusCode = status
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(body))
        }
        const ip = req.socket.remoteAddress || ''
        if (req.method !== 'POST' || !/^(::1$|127\.|::ffff:127\.)/.test(ip)) {
          return send(403, { error: 'Solo disponible desde este equipo' })
        }
        const key = process.env.DEEPSEEK_API_KEY || env.DEEPSEEK_API_KEY
        if (!key) return send(500, { error: 'Falta DEEPSEEK_API_KEY en edutechlife-backend/.env' })
        try {
          let raw = ''
          for await (const chunk of req) raw += chunk
          const { messages, isJson, temperature, maxTokens } = JSON.parse(raw || '{}')
          if (!Array.isArray(messages) || !messages.length) {
            return send(400, { error: 'messages es obligatorio' })
          }
          const r = await fetch('https://api.deepseek.com/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
            body: JSON.stringify({
              model: 'deepseek-flash',
              messages,
              temperature: temperature ?? 0.7,
              max_tokens: maxTokens || 2000,
              ...(isJson ? { response_format: { type: 'json_object' } } : {}),
            }),
            signal: AbortSignal.timeout(60000),
          })
          const data = await r.json().catch(() => null)
          if (!r.ok) return send(r.status, { error: data?.error?.message || `DeepSeek HTTP ${r.status}` })
          send(200, { result: data?.choices?.[0]?.message?.content || '' })
        } catch (e) {
          send(500, { error: e.message })
        }
      })
    },
  }
}

export default defineConfig({
  // Con minify:'esbuild', drop_console se hace aquí (equivalente al terserOptions
  // que se retiró para evitar el bug de mangle entre chunks).
  esbuild: {
    drop: ['console', 'debugger'],
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.{test,spec}.{js,jsx}'],
  },
  plugins: [
    react(),
    devIngenIAAi(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'offline.html'],
      manifest: {
        name: 'Edutechlife',
        short_name: 'Edutechlife',
        description: 'Edutechlife — Leading the Future of Education with Pedagogy and AI. Educación del Futuro con Pedagogía e Inteligencia Artificial.',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#004B63',
        orientation: 'portrait-primary',
        lang: 'es',
        icons: [
          { src: '/pwa-192x192.png', type: 'image/png', sizes: '192x192' },
          { src: '/pwa-512x512.png', type: 'image/png', sizes: '512x512' },
          { src: '/pwa-512x512.png', type: 'image/png', sizes: '512x512', purpose: 'maskable' },
          { src: '/favicon.svg', type: 'image/svg+xml', sizes: 'any' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,webp}'],
        globIgnores: [
          '**/pdf-vendor*',
        ],
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
        // Evita que chunks viejos (hash desactualizado) crasheen la app tras un deploy
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        // No sirvas index.html cuando se pide un asset JS/CSS que no existe:
        // así el fallo de import se detecta y no genera error de MIME "text/html"
        navigateFallbackDenylist: [/^\/assets\//, /\.[a-z0-9]+\.(js|css)$/i],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/cdnjs\.cloudflare\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'cdnjs-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 30
              }
            }
          },
          {
            urlPattern: /^\/Doc\/.*\.pdf$/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'local-pdfs',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 30
              }
            }
          },
          {
            urlPattern: /^\/ialab-resources\/.*\.mp4$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'video-cache',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 60
              }
            }
          },
          {
            urlPattern: /^\/dashboard\.mp4$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'video-cache',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 60
              }
            }
          },
          {
            urlPattern: /^\/infographics\/.*\.pdf$/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'infographics-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30
              }
            }
          },
          {
            urlPattern: /\.(png|jpg|jpeg|webp|gif|svg)$/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'image-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    }),
    process.env.BUILD_ANALYZE === 'true' && visualizer({
      filename: 'bundle-stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
  ].filter(Boolean),
  server: {
    port: 5174,
    host: true,
    open: true,
    cors: true,
    // No vigilar salidas de build commiteadas: evita recargas espurias del
    // dev server que abortan imports dinámicos en curso.
    watch: {
      ignored: ['**/storybook-static/**', '**/dist/**']
    },
    hmr: {
      overlay: true
    },
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'https://edutechlife-api.vercel.app',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    target: 'es2020',
    // esbuild (no terser): terser manglaba nombres de nivel superior de forma
    // inconsistente entre chunks compartidos → "Export 'X' is not defined in
    // module" solo en el build de Vercel (con drift de versión de terser,
    // "^5.49.0"). esbuild viene con Vite (sin drift), es determinista y no
    // rompe los bindings de export entre chunks. drop_console vía esbuild.
    minify: 'esbuild',
    rollupOptions: {
      external: ['@solana/web3.js'],
      output: {
        // Chunking por defecto de Vite. El "Export not defined" venía del
        // minificador terser (ver build.minify), no del chunking.
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    // The landing page (/) doesn't render charts, state, analytics, PDF tools,
    // Radix UI, Supabase or Stripe — those live behind protected/lazy routes.
    // Skip the eager <link rel="modulepreload"> for those vendor chunks so
    // the initial payload stays small; they load on-demand when the router
    // lazy() reaches a route that actually imports them.
    modulePreload: {
      resolveDependencies: (_filename, deps) =>
        deps.filter(
          (d) =>
            !d.includes('charts-vendor') &&
            !d.includes('supabase-vendor') &&
            !d.includes('stripe-vendor') &&
            !d.includes('state-vendor') &&
            !d.includes('radix-vendor') &&
            !d.includes('analytics-vendor') &&
            !d.includes('markdown-vendor') &&
            !d.includes('pdf-tools'),
        ),
    },
    chunkSizeWarningLimit: 250,
    sourcemap: false,
    reportCompressedSize: true,
    cssCodeSplit: true,
    cssMinify: true
  },
  optimizeDeps: {
    // Solo el entry real de la app. Por defecto Vite escanea `**/*.html` del
    // root e intenta pre-bundlear `storybook-static/` (salida de build
    // commiteada), lo que dispara re-optimizaciones y recargas ("optimized
    // dependencies changed. reloading") que abortan imports dinámicos en
    // curso — la causa de "Failed to fetch dynamically imported module".
    entries: ['index.html'],
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'zustand',
      '@tanstack/react-query',
      'framer-motion',
      'lucide-react',
      'canvas-confetti',
      'prop-types',
    ],
    exclude: ['lottie-web', '@solana/web3.js', 'tesseract.js', 'mammoth']
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@solana/web3.js': path.resolve(__dirname, './src/solana-stub.js')
    }
  },
  preview: {
    port: 4173,
    host: true
  }
})
