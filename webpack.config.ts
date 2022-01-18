import type from 'webpack-dev-server';

import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { Configuration, DefinePlugin, EnvironmentPlugin, HotModuleReplacementPlugin } from 'webpack';
import webpackNodeExternals from 'webpack-node-externals';
import { readdirSync } from 'fs';

const hotConf = 'webpack-hot-middleware/client?path=/__webpack_hmr';
const isProduction = process.env.NODE_ENV == 'production';

const baseConfig: Configuration = {
  mode: isProduction ? 'production' : 'development',
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/i,
        loader: 'babel-loader',
        exclude: ['/node_modules/'],
      },
    ],
  },
  plugins: [new EnvironmentPlugin('APP_ENV', 'NODE_ENV')],
  resolve: {
    extensions: ['.ts', '.js'],
  },
};

export const migrationsConfig: Configuration = {
  ...baseConfig,
  target: 'node16.13',
  devtool: 'inline-cheap-module-source-map',
  entry: readdirSync('./src/db/migrations/')
    .filter((f) => /\.ts$/.test(f) && f !== 'index.ts')
    .reduce((o, f) => ({ ...o, [f.replace('.ts', '')]: `./src/db/migrations/${f}` }), {}),
  output: {
    clean: true,
    libraryTarget: 'commonjs',
    path: path.resolve(__dirname, '.build/migrations'),
  },
  externals: [webpackNodeExternals()],
};

export const clientConfig: Configuration = {
  ...baseConfig,
  target: 'browserslist',
  entry: {
    index: ['./src/client/index.tsx', ...(isProduction ? [] : [hotConf])],
  },
  output: {
    clean: true,
    path: path.resolve(__dirname, '.build/client'),
    publicPath: '/static/',
  },
  devServer: {
    open: true,
    host: 'localhost',
  },
  plugins: [
    ...baseConfig.plugins!,
    new HtmlWebpackPlugin({
      publicPath: '/static/',
      template: 'src/client/index.html',
    }),
    ...(isProduction ? [] : [new HotModuleReplacementPlugin()]),
  ],
  module: {
    rules: [
      ...baseConfig.module!.rules!,
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: 'asset',
      },
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  [
                    'postcss-preset-env',
                    {
                      stage: 0,
                    },
                  ],
                ],
              },
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [...baseConfig.resolve!.extensions!, '.tsx', '.jsx'],
  },
};

export const serverConfig: Configuration = {
  ...baseConfig,
  target: 'node16.13',
  entry: {
    index: './src/server/index.ts',
  },
  externals: [webpackNodeExternals()],
  output: {
    clean: true,
    path: path.resolve(__dirname, '.build/server'),
  },
  plugins: [
    ...baseConfig.plugins!,
    new DefinePlugin({
      'process.env.DB_DIR': JSON.stringify(isProduction ? '/db/' : process.env.DB_DIR),
      'process.env.DB_NAME': JSON.stringify(isProduction ? 'books' : process.env.APP_ENV),
    }),
  ],
};

export default [clientConfig, migrationsConfig, serverConfig];
