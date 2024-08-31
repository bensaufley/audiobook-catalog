/* eslint-disable import/no-extraneous-dependencies */
/// <reference types="vitest/globals" />
import { defineConfig, mergeConfig } from 'vitest/config';

import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      coverage: {
        provider: 'istanbul',
        reporter: ['text', 'lcov'],
      },
      environment: 'jsdom',
    },
  }),
);
