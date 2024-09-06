import type { FastifyPluginAsync, FastifyRequest } from 'fastify';

import User from '~db/models/User';

const users: FastifyPluginAsync = async (fastify, _opts) => {
  fastify.get('/', async (_, res) => {
    const users = await User.findAll({
      order: ['username'],
      include: [User.associations.UserAudiobooks],
    });

    await res.send(users);
  });

  fastify.post('/', async ({ body }: FastifyRequest<{ Body: string }>, res) => {
    const { username } = JSON.parse(body);
    const user = await User.create({ username });

    await res.send(user);
  });
};

export default users;
