/* eslint-disable import/no-extraneous-dependencies */
/// <reference types="preact" />

import preact from '@preact/preset-vite';
import { resolve } from 'node:path';
import { vavite } from 'vavite';
import { defineConfig, type UserConfig } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';

const dirname = typeof __dirname === 'undefined' ? import.meta.dirname : __dirname;

const viteResolve: UserConfig['resolve'] = {
  alias: [
    { find: /^~client(?=\/)/, replacement: resolve(dirname, 'src/client') },
    { find: /^~db(?=\/)/, replacement: resolve(dirname, 'src/db') },
    { find: /^~server(?=\/)/, replacement: resolve(dirname, 'src/server') },
    { find: /^~shared(?=\/)/, replacement: resolve(dirname, 'src/shared') },
    { find: /^~test(?=\/)/, replacement: resolve(dirname, 'test') },
  ],
  extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
};

// https://vitejs.dev/config/
export default defineConfig({
  buildSteps: [
    {
      name: 'client',
      config: {
        build: {
          manifest: true,
          outDir: resolve(dirname, '.build/client'),
        },
        resolve: viteResolve,
        root: 'src/client',
        plugins: [
          preact(),
          createHtmlPlugin({
            entry: 'index.tsx',
            template: 'index.html',
          }),
        ],
      },
    },
    {
      name: 'server',
      config: {
        build: {
          outDir: resolve(dirname, '.build/server'),
          ssr: 'src/server',
          target: 'node20',
        },
      },
    },
  ],
  resolve: viteResolve,
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    hmr: {
      port: 6453,
    },
  },
  plugins: [
    vavite({
      bundleSirv: false,
      serverEntry: 'src/server/index.ts',
      reloadOn: 'static-deps-change',
    }),
  ],
});
