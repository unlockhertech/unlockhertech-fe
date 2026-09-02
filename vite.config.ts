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
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
            // Core React runtime
            if (
              id.includes('/node_modules/react/') ||
              id.includes('\\node_modules\\react\\') ||
              id.includes('/node_modules/react-dom/') ||
              id.includes('\\node_modules\\react-dom\\') ||
              id.includes('/node_modules/react-router/') ||
              id.includes('\\node_modules\\react-router\\')
            ) {
              return 'vendor-react';
            }

            // Sanity CMS Studio (isolated from public routes)
            if (id.includes('sanity') || id.includes('@sanity')) {
              return 'vendor-sanity';
            }

            // PDF generation library (isolated for assessment page)
            if (id.includes('jspdf') || id.includes('html2canvas')) {
              return 'vendor-pdf';
            }

            // Icons
            if (id.includes('react-icons')) {
              return 'vendor-icons';
            }

            // Markdown & code highlighting
            if (
              id.includes('prismjs') ||
              id.includes('react-markdown') ||
              id.includes('@portabletext') ||
              id.includes('gray-matter')
            ) {
              return 'vendor-markdown';
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
