/// <reference types="vite/client" />
/* eslint-disable import/no-extraneous-dependencies */
import { preact } from '@preact/preset-vite';
import { resolve } from 'node:path';
import { vavite } from 'vavite';
import { defineConfig, type UserConfig } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import svgr from 'vite-plugin-svgr';

const dirname = typeof __dirname === 'undefined' ? import.meta.dirname : __dirname;

const viteResolve: UserConfig['resolve'] = {
  alias: [
    { find: /^~client(?=\/)/, replacement: resolve(dirname, 'src/client') },
    { find: /^~db(?=\/)/, replacement: resolve(dirname, 'src/db') },
    { find: /^~icons(?=\/)/, replacement: resolve(dirname, 'node_modules/bootstrap-icons/icons') },
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
          outDir: '.build/client',
        },
        resolve: viteResolve,
        root: '.',
        plugins: [],
      },
    },
    {
      name: 'server',
      config: {
        define: {
          'process.env.DB_NAME': JSON.stringify(process.env.DB_NAME || 'books'),
          'process.env.APP_VERSION': JSON.stringify(process.env.APP_VERSION || 'unknown'),
        },
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
    preact(),
    svgr({
      svgrOptions: {
        // TODO: pending https://github.com/gregberge/svgr/pull/927
        // jsxRuntime: 'classic-preact',
        svgProps: {
          role: 'img',
        },
      },
      // esbuildOptions: {
      //   jsxFactory: 'h',
      //   jsxFragment: 'Fragment',
      // },
    }),
    vavite({
      bundleSirv: false,
      serverEntry: 'src/server/index.ts',
      reloadOn: 'any-change',
      serveClientAssetsInDev: true,
    }),
    createHtmlPlugin({
      entry: resolve(dirname, 'src/client/index.tsx'),
      template: 'src/client/index.html',
    }),
  ],
});
