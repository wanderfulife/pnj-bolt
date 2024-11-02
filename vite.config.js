import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 3000,
    // Changement ici : utilisation de 'localhost' au lieu de '0.0.0.0'
    host: 'localhost',
    strictPort: true
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: true,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': [
            'vue',
            'vue-router',
            'pinia',
            '@vueuse/core',
            'date-fns'
          ],
          'firebase': [
            'firebase/app',
            'firebase/auth',
            'firebase/firestore'
          ],
          'ui': [
            '@heroicons/vue'
          ]
        }
      }
    },
    cssCodeSplit: true,
    reportCompressedSize: true,
    assetsInlineLimit: 4096
  },
  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      'pinia',
      '@vueuse/core',
      'firebase/app',
      'firebase/auth',
      'firebase/firestore',
      'date-fns'
    ]
  }
})