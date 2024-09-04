import type { FastifyPluginAsync } from 'fastify';

import User from '~db/models/User';
import books from '~routes/api/books';
import tags from '~routes/api/tags';
import type { UserRequest } from '~routes/api/types';
import users from '~routes/api/users';

const api: FastifyPluginAsync = async (server, _opts) => {
  server.decorateRequest<User | undefined>('user', undefined);
  server.addHook('preHandler', async (req: UserRequest) => {
    req.user = null;
    const userId = req.headers['x-audiobook-catalog-user'];

    req.log.debug('x-audiobook-catalog-user: %s', userId);
    if (!userId) return;

    try {
      req.user = await User.findOne({ where: { id: userId } });
    } catch (err) {
      req.log.error(err);
    }
  });

  server.register(books, { prefix: '/books' });
  server.register(users, { prefix: '/users' });
  server.register(tags, { prefix: '/tags' });

  server.all('/*', async (_req, res) => res.status(404).send({ error: 'Not Found' }));
};

export default api;
