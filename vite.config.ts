/* eslint-disable import/no-extraneous-dependencies */
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

    { find: /^react(?=\/|$)/, replacement: resolve(dirname, 'node_modules/preact/compat') },
    { find: /^react\/jsx-(dev-)?runtime(?=\/|$)/, replacement: resolve(dirname, 'node_modules/preact/jsx-runtime') },
    { find: /^react-dom(?=\/|$)/, replacement: resolve(dirname, 'node_modules/preact/compat') },
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
          outDir: '.build/client',
        },
        resolve: viteResolve,
        root: '.',
        plugins: [preact()],
      },
    },
    {
      name: 'server',
      config: {
        build: {
          outDir: '.build/server',
          ssr: 'src/server',
          target: 'node22',
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
      serveClientAssetsInDev: true,
    }),
    createHtmlPlugin({
      entry: resolve(dirname, 'src/client/index.tsx'),
      template: 'src/client/index.html',
    }),
  ],
});
