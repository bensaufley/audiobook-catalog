import 'core-js/stable';

import Koa from 'koa';
import koaMount from 'koa-mount';
import koaSend from 'koa-send';
import koaStatic from 'koa-static';
import type koaWebpack from 'koa-webpack';
import { resolve } from 'path';

import getClient from '~server/db/getClient';

import type { clientConfig } from '../../webpack.config';

const isDev = process.env.NODE_ENV === 'development';

const setUpServer = async (): Promise<Koa> => {
  const app = new Koa();
  let webpackMiddleware: ReturnType<typeof koaWebpack> extends Promise<infer T> ? T : void;
  if (isDev) {
    /* eslint-disable global-require, import/no-extraneous-dependencies, @typescript-eslint/no-var-requires */
    const kw: typeof koaWebpack = require('koa-webpack');
    const { clientConfig: config } = require('../../webpack.config') as {
      clientConfig: typeof clientConfig;
    };

    webpackMiddleware = await kw({ config });
    app.use(webpackMiddleware);
    /* eslint-enable global-require, import/no-extraneous-dependencies, @typescript-eslint/no-var-requires */
  }

  app.use(
    koaMount(
      '/static',
      koaStatic(resolve(process.env.ROOT_DIR, '.build/client'), {
        gzip: true,
      })
    )
  );

  app.use(async (ctx) => {
    console.log('fallback handler request', process.env.NODE_ENV, ctx);
    if (isDev) {
      console.log('isDev');
      ctx.response.type = 'html';
      ctx.response.body = webpackMiddleware.devMiddleware.fileSystem.createReadStream(
        resolve(process.env.ROOT_DIR, '.build/client/index.html')
      );
    } else {
      await koaSend(ctx, resolve(process.env.ROOT_DIR, '.build/client/index.html'));
    }
  });

  return app;
};

getClient()
  .then((client) => {
    client.close();
  })
  .then(async () => {
    const app = await setUpServer();
    const port = process.env.PORT || '8080';
    console.log(`Listening on port ${port}`);
    app.listen(port);
  })
  .catch((err) => {
    console.error('Error starting server:', err);
  });
