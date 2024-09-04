/// <reference types="vite/client" />
/* eslint-disable import/no-extraneous-dependencies */
import preact from '@preact/preset-vite';
import { resolve } from 'node:path';
import { defineConfig, type UserConfig } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import svgr from 'vite-plugin-svgr';

const workdir = typeof __dirname === 'undefined' ? import.meta.dirname : __dirname;

const viteResolve: UserConfig['resolve'] = {
  alias: [
    { find: /^~client(?=\/)/, replacement: resolve(workdir, 'src/client') },
    { find: /^~db(?=\/)/, replacement: resolve(workdir, 'src/db') },
    { find: /^~icons(?=\/)/, replacement: resolve(workdir, 'node_modules/bootstrap-icons/icons') },
    { find: /^~server(?=\/)/, replacement: resolve(workdir, 'src') },
    { find: /^~routes(?=\/)/, replacement: resolve(workdir, 'src/routes') },
    { find: /^~shared(?=\/)/, replacement: resolve(workdir, 'src/shared') },
    { find: /^~test(?=\/)/, replacement: resolve(workdir, 'test') },
  ],
  extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
};

export default defineConfig({
  root: resolve(workdir, 'src', 'client'),
  build: {
    emptyOutDir: true,
  },
  define: {
    'process.env.DB_NAME': JSON.stringify(process.env.DB_NAME || 'books'),
    'process.env.ROOT_DIR': JSON.stringify(workdir),
  },
  resolve: viteResolve,
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
    createHtmlPlugin({
      entry: 'index.tsx',
      template: 'src/client/index.html',
    }),
  ],
});
