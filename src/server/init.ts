import '~db/models';

import fastifyEtag from '@fastify/etag';
import fastifyStatic from '@fastify/static';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import Fastify from 'fastify';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import type { pino } from 'pino';
import type { LokiOptions } from 'pino-loki';
import type { PrettyOptions } from 'pino-pretty';

import { umzug } from '~db/migrations/index.js';
import User from '~db/models/User.js';
import api from '~server/routes/api.js';
import type { UserRequest } from '~server/routes/api/types.js';
import withLock from '~shared/withLock.js';

const logLevels = ['trace', 'debug', 'info', 'warn', 'error'];
const sanitizeLogLevel = (level?: string) => {
  const standardized = level?.trim()?.toLocaleLowerCase();

  if (!standardized) return 'info';

  return logLevels.includes(standardized) ? standardized : 'info';
};
const logLevel = sanitizeLogLevel(process.env.LOG_LEVEL);

const prettyTransport: pino.TransportTargetOptions<PrettyOptions> = {
  target: 'pino-pretty',
  level: logLevel,
  options: {
    colorize: true,
    colorizeObjects: true,
    hideObject: false,
  },
};

const lokiTransport: pino.TransportTargetOptions<LokiOptions> = {
  target: 'pino-loki',
  level: logLevel,
  options: {
    batching: true,
    interval: 5,

    labels: Object.fromEntries(process.env.LOKI_LABELS?.split(',').map((v) => v.split(':')) ?? []),
    host: process.env.LOKI_HOST ?? '',
    ...(process.env.LOKI_USER &&
      process.env.LOKI_PASSWORD && {
        basicAuth: {
          username: process.env.LOKI_USER,
          password: process.env.LOKI_PASSWORD,
        },
      }),
  },
};

const baseTransport: pino.TransportTargetOptions = {
  target: 'pino/file',
  level: logLevel,
  options: { destination: 1 }, // writes to stdout
};

const init = async () => {
  await umzug.up();

  const server = Fastify({
    logger: {
      transport: {
        targets: [import.meta.env.DEV && prettyTransport, process.env.LOKI_HOST && lokiTransport, baseTransport].filter(
          (x) => !!x,
        ),
      },
    },
  });

  await server.register(swagger, {
    openapi: {
      info: {
        version: process.env.APP_VERSION ?? 'unknown',
        title: 'Audiobook Catalog API',
      },
    },
  });
  await server.register(swaggerUi, { prefix: '/api/docs', routePrefix: '/api/docs' });

  server.register(fastifyEtag);

  await server.register(fastifyStatic, {
    root: resolve(import.meta.dirname, '../client/assets'),
    prefix: '/assets/',
  });

  server.decorateRequest<User | undefined>('user', undefined);
  server.addHook('preHandler', async (req: UserRequest) => {
    req.user = null;
    const path = req.url.startsWith('/') ? req.url : new URL(req.url).pathname;
    if (!path.startsWith('/api/')) return;

    const userId = req.headers['x-audiobook-catalog-user'];

    req.log.debug('x-audiobook-catalog-user: %s', userId);
    if (!userId) return;

    try {
      req.user = await withLock('db', () => User.findOne({ where: { id: userId } }));
    } catch (err) {
      req.log.error(err);
    }
  });

  await server.register(api, { prefix: '/api' });

  // eslint-disable-next-line import/no-extraneous-dependencies
  const viteDevServer = import.meta.env.DEV ? (await import('vavite/vite-dev-server')).default : undefined;
  server.get('/*', {
    handler: async (req, res) => {
      if (import.meta.env.DEV) {
        const index = await readFile(resolve(process.env.INDEX_HTML_PATH, 'index.html'), 'utf-8');
        res.header('Content-Type', 'text/html');
        return res.send(await viteDevServer!.transformIndexHtml(req.url, index));
      }

      req.log.debug('Serving index.html from %s', process.env.INDEX_HTML_PATH);
      return res.sendFile('index.html', process.env.INDEX_HTML_PATH);
    },
    schema: {
      hide: true,
    },
  });

  return server;
};

export default init;
