import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { visualizer } from 'rollup-plugin-visualizer'
import path from 'path'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.{test,spec}.{js,jsx}'],
  },
  plugins: [
    react(),
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
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
      format: {
        comments: false,
      },
    },
    rollupOptions: {
      external: ['@solana/web3.js'],
      output: {
        // Chunking por defecto de Vite (sin manualChunks custom).
        // Ver nota sobre el bug de Vercel más abajo / en el historial.
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
    exclude: ['lottie-web', '@solana/web3.js', 'tesseract.js', 'mammoth', 'xlsx']
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
