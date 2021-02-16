/* eslint-disable import/no-extraneous-dependencies */
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { resolve } from 'path';
import { Configuration, DefinePlugin, HotModuleReplacementPlugin, RuleSetRule } from 'webpack';
import webpackNodeExternals from 'webpack-node-externals';

const extensions = ['.ts', '.tsx', '.js', '.jsx', '.json', '.mjs'];

const mode = process.env.NODE_ENV === 'development' ? 'development' : 'production';

// urql importing 'preact/hooks' (and maybe more) has
// issues in Webpack 5 without this
// https://github.com/webpack/webpack/issues/11467#issuecomment-691873586
const moduleHackRule: RuleSetRule = {
  test: /\.m?js/,
  type: 'javascript/auto',
  resolve: { fullySpecified: false },
};

const babelLoaderRule: RuleSetRule = {
  test: /\.[tj]sx?$/,
  loader: 'babel-loader',
  exclude: /node_modules/,
  resolve: {
    extensions,
  },
};

const graphqlLoaderRule: RuleSetRule = {
  test: /\.graphqls?$/,
  use: ['babel-loader', 'graphql-tag/loader'],
};

const alias = {
  '~client': resolve(process.env.ROOT_DIR, 'src/client/'),
  '~graphql': resolve(process.env.ROOT_DIR, 'src/graphql/'),
  '~server': resolve(process.env.ROOT_DIR, 'src/server/'),
  '~spec': resolve(process.env.ROOT_DIR, 'spec/'),
};

const optimization: Configuration['optimization'] = {
  minimize: mode === 'production',
};

export const serverConfig: Configuration = {
  // https://github.com/webpack-contrib/webpack-hot-client/issues/11
  entry: () =>
    [mode === 'development' ? 'webpack/hot/poll?1000' : '', './src/server/index.ts'].filter(
      Boolean
    ),
  output: {
    filename: 'index.js',
    path: resolve(process.env.ROOT_DIR, '.build/server'),
  },

  externals: [webpackNodeExternals()],
  mode,
  module: {
    rules: [moduleHackRule, babelLoaderRule, graphqlLoaderRule],
  },
  optimization,
  plugins: [
    new DefinePlugin({
      'process.env.ROOT_DIR': JSON.stringify(process.env.ROOT_DIR),
    }),
    ...(mode === 'development' ? [new HotModuleReplacementPlugin()] : []),
  ],
  resolve: { alias },
  target: 'node',
};

export const clientConfig: Configuration = {
  entry: () => ['./src/client/index.tsx'], // https://github.com/webpack-contrib/webpack-hot-client/issues/11
  output: {
    filename: 'bundle-[contenthash].js',
    path: resolve(process.env.ROOT_DIR, '.build/client'),
    publicPath: '/static/',
  },

  mode,
  module: {
    rules: [moduleHackRule, babelLoaderRule, graphqlLoaderRule],
  },
  optimization,
  plugins: [
    new HtmlWebpackPlugin({
      minify: false,
      template: resolve(process.env.ROOT_DIR, 'src/client/index.html'),
    }),
    new DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
  ],
  resolve: { alias },
  target: 'web',
};

export default [serverConfig, clientConfig];
