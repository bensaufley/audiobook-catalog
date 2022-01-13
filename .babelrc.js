// @ts-check

/** @type {import('@babel/core').ConfigFunction} */
const babelConfig = (api) => {
  api.cache.never();

  return {
    plugins: [
      [
        'babel-plugin-module-resolver',
        {
          root: ['./'],
          alias: {
            '~client': './src/client',
            '~db': './src/db',
            '~server': './src/server',
            '~shared': './src/shared',
            '~test': './test',
          },
        },
      ],
      [
        '@babel/plugin-transform-react-jsx',
        {
          pragma: 'h',
          pragmaFrag: 'Fragment',
        },
      ],
    ],
    presets: [
      [
        '@babel/preset-typescript',
        {
          allowDeclareFields: true,
          onlyRemoveTypeImports: true,
        },
      ],
      ['@babel/preset-env', {}],
    ],
  };
};

module.exports = babelConfig;
