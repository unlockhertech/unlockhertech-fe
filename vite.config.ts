import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import type { UserConfig } from 'vite'
import type { InlineConfig } from 'vitest'

interface VitestConfigExport extends UserConfig {
  test?: InlineConfig;
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    'process.env.TINA_CLIENT_ID': JSON.stringify(process.env.TINA_CLIENT_ID || ''),
    'process.env.TINA_TOKEN': JSON.stringify(process.env.TINA_TOKEN || ''),
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
    'process.env.HEAD': JSON.stringify(process.env.HEAD || 'main'),
  },
  assetsInclude: ['**/*.svg', '**/*.png', '**/*.jpg',
    '**/*.gif', '**/*.webp', '**/*.csv'],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
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
