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

            // Lightweight Sanity client for public queries
            if (id.includes('@sanity/client') || id.includes('@sanity/image-url')) {
              return 'vendor-sanity-client';
            }

            // Portable Text renderer used by public blog pages. Must be isolated
            // BEFORE the broad `sanity` rule below, otherwise it gets hoisted into
            // the heavy Sanity Studio chunk (and drags Studio's global CSS reset
            // onto every public page that renders blog content).
            if (id.includes('@portabletext')) {
              return 'vendor-portabletext';
            }

            // Markdown / unified-remark-rehype ecosystem used by `react-markdown`
            // on public blog pages. Several of its low-level utilities (hast/unist
            // helpers, property-information, entity parsers) are ALSO pulled in by
            // Sanity Studio's `react-refractor`. Isolate them here — again BEFORE the
            // broad `sanity` rule — so these shared modules are NOT hoisted into the
            // heavy Studio chunk, which would force blog pages to statically import
            // the entire 6.5 MB Studio bundle and its global CSS reset.
            if (
              /[\\/]node_modules[\\/](react-markdown|micromark|mdast|hast|unist|vfile|remark|rehype|refractor|property-information|comma-separated-tokens|space-separated-tokens|character-entities|character-reference-invalid|decode-named-character-reference|parse-entities|is-alphabetical|is-alphanumerical|is-decimal|is-hexadecimal|trim-lines|style-to-object|html-url-attributes|zwitch|longest-streak|ccount|markdown-table|devlop|estree-util|web-namespaces|stringify-entities|bail|is-plain-obj|trough|extend|inline-style-parser)/.test(
                id
              )
            ) {
              return 'vendor-markdown';
            }

            // Heavy Sanity Studio (isolated for /admin routes)
            if (id.includes('sanity') || id.includes('@sanity') || id.includes('styled-components')) {
              return 'vendor-sanity-studio';
            }

            // PDF generation library (isolated for assessment page)
            if (id.includes('jspdf') || id.includes('html2canvas')) {
              return 'vendor-pdf';
            }

            // Icons
            if (id.includes('react-icons')) {
              return 'vendor-icons';
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
  server: {
    proxy: {
      // Vite does not run Netlify functions. Local submissions use the live service.
      '/api/booking-portal': {
        target: 'https://www.unlockhertech.com',
        changeOrigin: true,
      },
      '/api/podcast-rss': {
        target: 'https://anchor.fm',
        changeOrigin: true,
        rewrite: () => '/s/e6cb6024/podcast/rss',
      },
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
