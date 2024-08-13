import type { FastifyPluginAsync } from 'fastify';

import books from './api/books';
import users from './api/users';

const api: FastifyPluginAsync = async (fastify, _opts) => {
  fastify.register(books, { prefix: '/books' });
  fastify.register(users, { prefix: '/users' });

  fastify.all('/*', async (_req, res) => res.status(404).send({ error: 'Not Found' }));
};

export default api;
