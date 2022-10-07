import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import { resolve } from 'path';
import type webpackT from 'webpack';
import { umzug } from '~db/migrations';
import { ready } from '~db/models';
import books from '~server/routes/books';

import type * as configT from '../../webpack.config';
import User from '~db/models/User';
import users from '~server/routes/users';

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
      level: sanitizeLogLevel(process.env.LOG_LEVEL),
      ...(process.env.APP_ENV === 'development'
        ? {
            transport: {
              target: 'pino-pretty',
            },
          }
        : {}),
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
  fastify.addHook('preHandler', async (req) => {
    const userId = req.headers['x-audiobook-catalog-user'];

    req.log.debug('x-audiobook-catalog-user: %s', userId);
    if (!userId) return;

    try {
      const user = await User.findOne({ where: { id: userId } });

      if (user) req.user = user;
      else req.log.warn('No User found for id %s', userId);
    } catch (err) {
      req.log.error(err);
    }
  });

  await fastify.register(books, { prefix: '/books' });
  await fastify.register(users, { prefix: '/users' });

  fastify.get('/*', async (req, res) => {
    await res.sendFile('index.html');
  });

  return fastify;
};

export default init;
