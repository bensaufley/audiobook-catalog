// @ts-check

/** @type {import('@babel/core').ConfigFunction} */
const babelConfig = (api) => {
  const isNode = api.caller((/** @type {any} */ caller) => caller?.target === 'node');

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
        '@babel/preset-env',
        {
          corejs: '3',
          useBuiltIns: 'usage',

          ...(isNode ? { targets: { node: 'current' } } : {}),
        },
      ],
      [
        '@babel/preset-typescript',
        {
          allowDeclareFields: true,
          onlyRemoveTypeImports: true,
        },
      ],
    ],
  };
};

module.exports = babelConfig;
