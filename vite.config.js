import { fileURLToPath, URL } from 'node:url'
import os from 'node:os'

import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import argv from 'vite-plugin-argv'

const localIP = () =>
  Object.values(os.networkInterfaces())
    .flat()
    .find((i) => i?.family === 'IPv4' && !i.internal)?.address || 'localhost'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss(), argv()],
  server: {
    port: 3562,
    host: '0.0.0.0',
    hmr: { host: localIP(), port: 3562, protocol: 'ws' },
  },
  build: {
    outDir: 'build/spa',
    rollupOptions: {
      output: {
        entryFileNames: 'a/[name]_[hash:16].js',
        chunkFileNames: 'b/[name]_[hash:16].js',
        assetFileNames: 'c/[name]_[hash:16].[ext]',
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
