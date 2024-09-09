/* eslint-disable import/no-extraneous-dependencies */
/// <reference types="vitest/globals" />
import { defineConfig, mergeConfig } from 'vitest/config';

import viteConfig from './vite.config.js';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      coverage: {
        provider: 'istanbul',
        reporter: ['text', 'lcov'],
        exclude: [
          'node_modules/**',
          '.build/**',
          '*.spec.ts{,x}',
          '*.test.ts{,x}',
          'test/support/**',
          'script/build/binaries.ts',
        ],
      },
      environment: 'jsdom',
    },
  }),
);
