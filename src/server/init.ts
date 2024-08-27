import fastifyEtag from '@fastify/etag';
import fastifyStatic from '@fastify/static';
import Fastify, { type FastifyBaseLogger, type FastifyServerOptions } from 'fastify';
import { readFile } from 'node:fs/promises';
import type { Server } from 'node:http';
import { resolve } from 'node:path';

import { umzug } from '~db/migrations';
import { ready } from '~db/models';
import User from '~db/models/User';

import api from './routes/api';
import type { UserRequest } from './routes/api/types';

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
  if (import.meta.env.DEV) {
    // eslint-disable-next-line import/no-extraneous-dependencies
    const { default: devServer } = await import('vavite/http-dev-server');
    devServerOpts = {
      serverFactory: (handler) => {
        devServer!.on('request', handler);
        return devServer!;
      },
    };
  }

  const server = Fastify({
    logger: {
      level: sanitizeLogLevel(process.env.LOG_LEVEL),
      ...(import.meta.env.DEV
        ? {
            transport: {
              target: 'pino-pretty',
            },
          }
        : {}),
    },
    ...devServerOpts,
  });

  server.register(fastifyEtag);

  if (import.meta.env.PROD) {
    server.register(fastifyStatic, {
      root: resolve(import.meta.dirname, '../client/assets'),
      prefix: '/assets/',
    });
  }

  server.addHook('preHandler', async (req: UserRequest) => {
    req.user = null;
    const path = req.url.startsWith('/') ? req.url : new URL(req.url).pathname;
    if (!path.startsWith('/api/')) return;

    const userId = req.headers['x-audiobook-catalog-user'];

    req.log.debug('x-audiobook-catalog-user: %s', userId);
    if (!userId) return;

    try {
      req.user = await User.findOne({ where: { id: userId } });
    } catch (err) {
      req.log.error(err);
    }
  });

  await server.register(api, { prefix: '/api' });

  // eslint-disable-next-line import/no-extraneous-dependencies
  const viteDevServer = import.meta.env.DEV ? (await import('vavite/vite-dev-server')).default : undefined;
  server.get('/*', async (req, res) => {
    if (import.meta.env.DEV) {
      const index = await readFile(resolve(import.meta.dirname, '../client/index.html'), 'utf-8');
      res.header('Content-Type', 'text/html');
      return res.send(await viteDevServer!.transformIndexHtml(req.url, index));
    }

    return res.sendFile('index.html', resolve(import.meta.dirname, '../client/'));
  });

  return server;
};

export default init;
