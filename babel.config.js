// @ts-check

/** @type {import('@babel/core').ConfigFunction} */
module.exports = (api) => {
  const isNode = api.caller(
    (/** @type {import('@babel/core').TransformCaller & { target?: string }} */ caller) =>
      !!caller && caller.target === 'node'
  );
  return {
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '~client': './src/client',
            '~graphql': './src/graphql',
            '~server': './src/server',
            '~spec': './spec',
          },
        },
      ],
    ],
    presets: [
      [
        '@babel/preset-env',
        {
          corejs: 3,
          targets: isNode ? { node: 'current' } : '> 1%, not dead',
          useBuiltIns: 'entry',
        },
      ],
      [
        '@babel/preset-typescript',
        {
          onlyRemoveTypeImports: true,
        },
      ],
      ...(isNode
        ? []
        : [
            [
              '@babel/preset-react',
              {
                pragma: 'h',
                pragmaFrag: 'Fragment',
              },
            ],
          ]),
    ],
    sourceMaps: true,
  };
};
