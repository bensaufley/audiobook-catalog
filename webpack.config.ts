import type from 'webpack-dev-server';

import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { Configuration, HotModuleReplacementPlugin } from 'webpack';
import webpackNodeExternals from 'webpack-node-externals';

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
  resolve: {
    extensions: ['.ts', '.js'],
  },
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
  output: {
    clean: true,
    path: path.resolve(__dirname, '.build/server'),
  },
  externals: [webpackNodeExternals()],
};

export default [clientConfig, serverConfig];
