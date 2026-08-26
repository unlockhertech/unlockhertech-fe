import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import type { UserConfig } from 'vite'
// @ts-expect-error: InlineConfig is not exported from vite but used by vitest
import type { InlineConfig } from 'vitest'

interface VitestConfigExport extends UserConfig {
  test?: InlineConfig;
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    target: 'es2022',
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'vendor-react';
            }
            if (id.includes('react-icons')) {
              return 'vendor-icons';
            }
            if (id.includes('sanity') || id.includes('@sanity')) {
              return 'vendor-sanity';
            }
            if (id.includes('jspdf')) {
              return 'vendor-pdf';
            }
          }
        },
      },
    },
  },
  assetsInclude: ['**/*.svg', '**/*.png', '**/*.jpg',
    '**/*.gif', '**/*.webp', '**/*.csv'],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    testTimeout: 15000,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
} as VitestConfigExport)
