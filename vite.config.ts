import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import compression from 'vite-plugin-compression';

export default defineConfig(({ mode, command }) => {
    const env = loadEnv(mode, '.', '');
    if (command === 'build') {
      const apiKey = env.API_KEY || env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('Missing API key. Set API_KEY or GEMINI_API_KEY before building.');
      }
    }
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        compression({ algorithm: 'gzip', ext: '.gz', apply: 'build' }),
        compression({ algorithm: 'brotliCompress', ext: '.br', apply: 'build' }),
      ],
      define: {
        'import.meta.env.API_KEY': JSON.stringify(env.API_KEY ?? ''),
        'import.meta.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY ?? ''),
      },
      build: {
        minify: 'esbuild',
        sourcemap: false,
        cssCodeSplit: true,
        assetsInlineLimit: 4096,
        rollupOptions: {
          output: {
            manualChunks: {
              vendor: ['react', 'react-dom'],
            },
          },
        },
      },
      test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: './tests/setupTests.ts',
        coverage: {
          provider: 'v8',
          reporter: ['text', 'html'],
        },
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
