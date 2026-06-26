import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
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
    // Intercepts the config after Tina sets it, but before esbuild crashes
    {
      name: 'fix-tina-vite-crash',
      config(config) {
        if (config.define && typeof config.define['process.env'] === 'object') {
          // Replaces the raw object with a stringified empty object
          config.define['process.env'] = '"{}"';
        }
      }
    }],
  define: {
    // This forces process.env to be a plain object,
    // overriding the broken 'new Object({})' from Tina
    'process.env': JSON.stringify({}),
  },
  build: {
    target: 'es2022',
  },
  esbuild: {
    target: 'es2022',
    supported: {
      'destructuring': true
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2022',
    },
  },
  assetsInclude: ['**/*.svg', '**/*.png', '**/*.jpg',
    '**/*.gif', '**/*.webp', '**/*.csv'],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      buffer: 'buffer',
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
