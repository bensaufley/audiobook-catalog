import 'core-js/stable';

import { DIRECTIVES } from '@graphql-codegen/typescript-mongodb';
import { ApolloServer } from 'apollo-server-koa';
import Koa from 'koa';
import koaMount from 'koa-mount';
import koaSend from 'koa-send';
import koaStatic from 'koa-static';
import type koaWebpack from 'koa-webpack';
import { resolve } from 'path';
import { rawListeners } from 'process';

import Audiobook from '~graphql/Audiobook.graphqls';
import Author from '~graphql/Author.graphqls';
import Query from '~graphql/Query.graphqls';
import getClient from '~server/db/getClient';
import resolvers from '~server/graphql/resolvers';

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

    webpackMiddleware = await kw({
      config,
      hotClient: {
        port: 8081,
      },
    });
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

  const apolloServer = new ApolloServer({
    resolvers,
    typeDefs: [DIRECTIVES, Audiobook, Author, Query],
    playground: isDev,
    introspection: isDev,
  });

  apolloServer.applyMiddleware({
    app,
    path: '/graphql',
  });

  app.use(async (ctx) => {
    if (isDev) {
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

/* eslint-disable-next-line consistent-return */
const start = async () => {
  try {
    const client = await getClient();
    client.close();
    const app = await setUpServer();
    const port = process.env.PORT || '8080';
    console.log(`Listening on port ${port}`);
    app.listen(port);
    return app;
  } catch (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
};

start();

if (module.hot) {
  module.hot.accept();
}
