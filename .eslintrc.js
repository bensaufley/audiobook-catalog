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

    // Disable rules made redundant or ineffective by simple-import-sort
    'sort-imports': ['off'],
    'import/order': ['off'],

    'import/extensions': ['error', 'never', { json: 'always' }],

    'simple-import-sort/imports': ['error'],
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts'],
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
