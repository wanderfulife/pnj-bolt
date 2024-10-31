import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  base: './', // Add this line
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 3000,
    host: '0.0.0.0', // Add this line
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: true, // Add this line
    outDir: 'dist'  // Add this line
  }
})