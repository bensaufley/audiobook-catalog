// For dev

/// <reference types="vite/client" />

import type { IncomingMessage, ServerResponse } from 'http';

import sequelize from '~db/sequelize.js';
import watch from '~server/filesystem/watch.js';
import init from '~server/init.js';

const fastify = await init();

watch(sequelize, fastify.log);

let fastifyReadyPromise: PromiseLike<void> | undefined = fastify.ready();

const handler = async (request: IncomingMessage, reply: ServerResponse) => {
  if (fastifyReadyPromise) {
    await fastifyReadyPromise;
    fastifyReadyPromise = undefined;
  }

  fastify.server.emit('request', request, reply);
};

export default handler;
