/* eslint-disable import/no-extraneous-dependencies */
/// <reference types="preact" />

import preact from '@preact/preset-vite';
import path from 'node:path';
import { vavite } from 'vavite';
import { defineConfig } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: '.build',
  },
  root: 'src',
  resolve: {
    alias: [
      { find: /^~client(?=\/)/, replacement: path.resolve(__dirname, 'src/client') },
      { find: /^~db(?=\/)/, replacement: path.resolve(__dirname, 'src/db') },
      { find: /^~server(?=\/)/, replacement: path.resolve(__dirname, 'src/server') },
      { find: /^~shared(?=\/)/, replacement: path.resolve(__dirname, 'src/shared') },
      { find: /^~test(?=\/)/, replacement: path.resolve(__dirname, 'test') },
    ],
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    hmr: {
      port: 6453,
    },
  },
  plugins: [
    preact(),
    createHtmlPlugin({
      entry: 'index.tsx',
      template: 'client/index.html',
      inject: {
        data: {
          title: 'audiobook-catalog',
        },
      },
    }),
    vavite({
      serverEntry: './server/index.ts',
      reloadOn: 'static-deps-change',
      serveClientAssetsInDev: true,
    }),
  ],
});
