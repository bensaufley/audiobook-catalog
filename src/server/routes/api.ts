import { JsonSchemaManager, OpenApi3Strategy } from '@alt3/sequelize-to-json-schemas';
import type { FastifyPluginAsync } from 'fastify';
import type { OpenAPIV3_1 } from 'openapi-types';

import models from '~db/models';
import books from '~server/routes/api/books';
import tags from '~server/routes/api/tags';
import users from '~server/routes/api/users';

import { fourOhFour } from '../utils/schema';

const schemaManager = new JsonSchemaManager();

const deepUpdateRef = <T>(schema: T, ref: string): T => {
  if (typeof schema !== 'object' || schema === null) return schema;

  if (Array.isArray(schema)) return schema.map((v) => deepUpdateRef(v, ref)) as T;

  return Object.fromEntries(
    Object.entries(schema).map(([key, value]) => {
      if (key === '$ref') return [key, `${ref}${value}`];
      if (typeof value === 'object') return [key, deepUpdateRef(value, ref)];
      return [key, value];
    }),
  ) as T;
};
const strategy = new OpenApi3Strategy();
const schemas = Object.fromEntries(
  Object.entries(models).map(([name, model]) => [
    name,
    deepUpdateRef(schemaManager.generate(model, strategy), 'audiobook-catalog'),
  ]),
);

const api: FastifyPluginAsync = async (fastify, _opts) => {
  fastify.addSchema({
    $id: 'audiobook-catalog',
    type: 'object',
    components: { schemas } satisfies OpenAPIV3_1.Document['components'],
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
