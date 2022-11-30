import { defineConfig } from 'vite';
import path from 'path';
import envCompatible from 'vite-plugin-env-compatible';
import { createHtmlPlugin } from 'vite-plugin-html';
import preact from '@preact/preset-vite';
import vavite from 'vavite';

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
    envCompatible(),
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
      serverEntry: './src/server/index.ts',
      reloadOn: 'static-deps-change',
      serveClientAssetsInDev: true,
    }),
  ],
  build: {},
});
