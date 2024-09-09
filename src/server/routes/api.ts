import type { FastifyPluginAsync } from 'fastify';
import type { OpenAPIV3_1 } from 'openapi-types';

import books from '~server/routes/api/books/index.js';
import modelSchemas from '~server/routes/api/modelSchema.js';
import tags from '~server/routes/api/tags.js';
import users from '~server/routes/api/users.js';
import { fourOhFour } from '~server/utils/schema.js';

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
