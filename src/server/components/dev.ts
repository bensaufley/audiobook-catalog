/* eslint-disable global-require, import/no-extraneous-dependencies, @typescript-eslint/no-var-requires */
import type Koa from 'koa';
import type koaWebpack from 'koa-webpack';
import { resolve } from 'path';

import type { clientConfig } from '../../../webpack.config';

const dev = async (app: Koa) => {
  if (process.env.NODE_ENV !== 'development') return false;

  const kw: typeof koaWebpack = require('koa-webpack');
  const { clientConfig: config } = require('../../../webpack.config') as {
    clientConfig: typeof clientConfig;
  };

  const webpackMiddleware = await kw({
    config,
    hotClient: {
      port: 8081,
    },
  });
  app.use(webpackMiddleware);
  app.use(async (ctx) => {
    ctx.response.type = 'html';
    ctx.response.body = webpackMiddleware.devMiddleware.fileSystem.createReadStream(
      resolve(process.env.ROOT_DIR, '.build/client/index.html'),
    );
  });

  return true;
};

export default dev;
