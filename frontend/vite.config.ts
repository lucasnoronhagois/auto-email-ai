import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    // Otimizações de build
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        // Chunking para melhor cache
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['lucide-react'],
          http: ['axios'],
        },
        // Nomes de arquivos com hash para cache
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    // Otimizações de tamanho
    chunkSizeWarningLimit: 1000,
    sourcemap: false, // Desabilitar sourcemaps em produção
  },
  // Otimizações de desenvolvimento
  optimizeDeps: {
    include: ['react', 'react-dom', 'axios', 'lucide-react'],
  },
})
