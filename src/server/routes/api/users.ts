import s from 'ajv-ts';
import type { FastifyPluginAsync, FastifyRequest } from 'fastify';

import User from '~db/models/User.js';

const users: FastifyPluginAsync = async (fastify, _opts) => {
  fastify.get('/', {
    handler: async (_, res) => {
      const users = await User.findAll({
        order: ['username'],
        include: [User.associations.UserAudiobooks],
      });

      await res.send(users);
    },
    schema: {
      description: 'Get all users',
      response: {
        200: s.array(s.object().meta({ $ref: 'audiobook-catalog#/components/schemas/User' })).schema,
      },
    },
  });

  fastify.post('/', {
    handler: async ({ body }: FastifyRequest<{ Body: string }>, res) => {
      const { username } = JSON.parse(body);
      const user = await User.create({ username });

      await res.send(user);
    },
    schema: {
      description: 'Create a user',
      body: s.string().schema,
      response: {
        200: s.object().meta({ $ref: 'audiobook-catalog#/components/schemas/User' }).schema,
      },
    },
  });
};

export default users;
