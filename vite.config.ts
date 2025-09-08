import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  root: 'src/renderer',
  base: './',
  build: {
    outDir: '../../dist/renderer',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/renderer'),
      '@/components': path.resolve(__dirname, 'src/renderer/components'),
      '@/pages': path.resolve(__dirname, 'src/renderer/pages'),
      '@/store': path.resolve(__dirname, 'src/renderer/store'),
      '@/utils': path.resolve(__dirname, 'src/renderer/utils'),
      '@/types': path.resolve(__dirname, 'src/shared/types'),
      '@/shared': path.resolve(__dirname, 'src/shared'),
    },
  },
  server: {
    port: 3000,
  },
})
