import Fastify from 'fastify';
import fastifyStatic from 'fastify-static';
import { resolve } from 'path';
import type webpackT from 'webpack';
import { umzug } from '~db/migrations';
import { ready } from '~db/models';
import books from '~server/routes/books';
import users from '~server/routes/users';

import type * as configT from '../../webpack.config';

const logLevels = ['trace', 'debug', 'info', 'warn', 'error'];
const sanitizeLogLevel = (level?: string) => {
  const standardized = level?.trim()?.toLocaleLowerCase();

  if (!standardized) return 'info';

  return logLevels.includes(standardized) ? standardized : 'info';
};

const init = async () => {
  await umzug.up();

  await ready;

  const fastify = Fastify({
    logger: {
      prettyPrint: process.env.APP_ENV === 'development',
      level: sanitizeLogLevel(process.env.LOG_LEVEL),
    },
  });

  if (process.env.APP_ENV === 'development') {
    const webpack: typeof webpackT = require('webpack');
    const HMR = require('fastify-webpack-hmr');
    const { clientConfig }: typeof configT = require('../../webpack.config');

    const compiler = webpack(clientConfig);
    fastify.register(HMR, { compiler, webpackDev: { publicPath: '/static/' } });
  }

  fastify.register(fastifyStatic, {
    root: resolve(__dirname, '../client'),
    prefix: '/static/',
  });

  fastify.register(books, { prefix: '/books/' });
  fastify.register(users, { prefix: '/users/' });

  fastify.get('/*', async (req, res) => {
    await res.sendFile('index.html');
  });

  return fastify;
};

export default init;
