import '@fastify/static';
import 'pino-http';

import fastifyEtag from '@fastify/etag';
import FastifyVite from '@fastify/vite';
import Fastify from 'fastify';
import { resolve } from 'node:path';

import { umzug } from '~db/migrations';
import { ready } from '~db/models';
import sequelize from '~db/sequelize';
import api from '~routes/api';
import watch from '~server/filesystem/watch';

const logLevels = ['trace', 'debug', 'info', 'warn', 'error'];
const sanitizeLogLevel = (level?: string) => {
  const standardized = level?.trim()?.toLocaleLowerCase();

  if (!standardized) return 'info';

  return logLevels.includes(standardized) ? standardized : 'info';
};

await umzug.up();

await ready;

process.stderr.write(`dev: ${import.meta.env.DEV}\n`);
const server = Fastify({
  logger: {
    level: sanitizeLogLevel(process.env.LOG_LEVEL),
    transport: { target: import.meta.env.DEV ? 'pino-pretty' : 'pino-http' },
  },
});

const teardown = watch(sequelize, server.log);

server.register(fastifyEtag);

server.log.info({ root: resolve(import.meta.dirname, '..') }, 'Registering API routes');
await server.register(api, { prefix: '/api' });
await server.register(FastifyVite, {
  root: resolve(import.meta.dirname, '..'),
  dev: process.argv.includes('--dev'),
  spa: true,
});
server.get('/*', (_, reply) => reply.html());

try {
  await server.vite.ready();
  await server.listen({
    port: 3000,
    host: '0.0.0.0',
  });
} catch (err) {
  server.log.error(err);
  process.exit(1);
}

if (import.meta.hot) {
  import.meta.hot.accept();
  import.meta.hot.dispose(() => {
    server.close();
    teardown();
  });
}
