/* eslint-disable @typescript-eslint/no-var-requires,import/no-extraneous-dependencies,prefer-object-spread */
const { rules: styleRules } = require('eslint-config-airbnb-base/rules/style');

module.exports = {
  extends: 'airbnb-typescript-prettier',
  plugins: ['simple-import-sort'],
  rules: {
    '@typescript-eslint/no-namespace': ['off'],
    '@typescript-eslint/no-non-null-assertion': ['off'],
    '@typescript-eslint/no-explicit-any': ['off'],
    '@typescript-eslint/no-empty-interface': ['off'],
    '@typescript-eslint/explicit-module-boundary-types': ['off'],

    '@typescript-eslint/ban-types': ['off'],

    '@typescript-eslint/no-unused-vars': ['off'], // typechecking covers this

    'no-underscore-dangle': [
      styleRules['no-underscore-dangle'][0],
      Object.assign(Object.assign({}, styleRules['no-underscore-dangle'][1]), {
        allow: ['_id'],
      }),
    ],

    // Disable rules made redundant or ineffective by simple-import-sort
    'sort-imports': ['off'],
    'import/order': ['off'],

    'import/extensions': ['error', 'never', { css: 'always', json: 'always' }],

    'simple-import-sort/imports': ['error'],

    'react/no-unknown-property': ['error', { ignore: ['class'] }],
  },
  settings: {
    'import/ignore': ['\\.css$'],
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      'babel-module': {
        extensions: ['.d.ts', '.ts', '.js', '.tsx', '.jsx'],
        alias: {
          '~client': './src/client',
          '~graphql': './src/graphql',
          '~server': './src/server',
          '~test': './test',
        },
      },
    },
    react: {
      pragma: 'h',
    },
  },
};
