/* eslint-disable import/no-extraneous-dependencies, @typescript-eslint/no-var-requires */

/** @type {import('eslint').Linter.Config} */
const config = {
  extends: ['@bensaufley', require.resolve('@bensaufley/eslint-config/preact.cjs')],
  rules: {
    camelcase: ['error', { allow: ['OpenAPIV3_1'] }],
    'implicit-arrow-linebreak': 'off',
    'no-redeclare': 'off',
    'import/extensions': 'off', // handled by typescript
    'import/no-unresolved': 'off', // handled by typescript
  },
  overrides: [
    {
      files: ['*.jsx', '*.tsx'],
      parserOptions: {
        jsx: true,
      },
    },
  ],
};

module.exports = config;
