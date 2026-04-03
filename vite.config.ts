import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return
        warn(warning)
      }
    }
  },
  resolve: {
    conditions: ['browser']
  },
  optimizeDeps: {
    include: ['@mysten/sui', '@mysten/dapp-kit'],
    esbuildOptions: {
      define: {
        global: 'globalThis'
      }
    }
  }
})
