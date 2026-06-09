import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  build: { target: 'es2020', minify: false },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@solana/web3.js': path.resolve(__dirname, './src/solana-stub.js')
    }
  }
})
