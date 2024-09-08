import type { FastifyPluginAsync } from 'fastify';
import type { OpenAPIV3_1 } from 'openapi-types';

import books from '~server/routes/api/books';
import tags from '~server/routes/api/tags';
import users from '~server/routes/api/users';

import { fourOhFour } from '../utils/schema';

import modelSchemas from './api/modelSchema';

const api: FastifyPluginAsync = async (fastify, _opts) => {
  fastify.addSchema({
    $id: 'audiobook-catalog',
    type: 'object',
    components: { schemas: modelSchemas } satisfies OpenAPIV3_1.Document['components'],
  });

  await fastify.register(books, { prefix: '/books' });
  await fastify.register(users, { prefix: '/users' });
  await fastify.register(tags, { prefix: '/tags' });

  fastify.all('/*', {
    handler: async (_req, res) => res.status(404).send({ error: 'Not Found' }),
    schema: { response: fourOhFour() },
  });
};

export default api;
