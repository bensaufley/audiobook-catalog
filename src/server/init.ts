import Fastify, { FastifyBaseLogger, FastifyServerOptions } from 'fastify';
import fastifyStatic from '@fastify/static';
import type { Server } from 'node:http';
import { resolve } from 'node:path';
import httpDevServer from 'vavite/http-dev-server';

import { umzug } from '~db/migrations';
import { ready } from '~db/models';
import books from '~server/routes/books';

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

  let devServerOpts: Pick<FastifyServerOptions<Server, FastifyBaseLogger>, 'serverFactory'> | undefined;
  if (httpDevServer) {
    devServerOpts = {
      serverFactory: (handler) => {
        httpDevServer!.on('request', handler);
        return httpDevServer!;
      },
    };
  }

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
    ...devServerOpts,
  });

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
