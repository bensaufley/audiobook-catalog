module.exports = {
  extends: 'airbnb-typescript-prettier',
  plugins: ['simple-import-sort'],
  rules: {
    '@typescript-eslint/no-namespace': 0,
    '@typescript-eslint/no-non-null-assertion': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-empty-interface': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,

    '@typescript-eslint/no-unused-vars': 0, // typechecking covers this

    // Disable rules made redundant or ineffective by simple-import-sort
    'sort-imports': 0,
    'import/order': 0,

    'simple-import-sort/imports': ['error'],
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts'],
    },
    'import/resolver': {
      'babel-module': {
        extensions: ['.ts', '.js'],
        alias: {
          '~server': './src/server',
          '~test': './test',
        }
      },
    },
  },
};
