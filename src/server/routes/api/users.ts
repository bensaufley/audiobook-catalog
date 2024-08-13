import type { FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify';

import User from '~db/models/User';
import UserAudiobook from '~db/models/UserAudiobook';

declare module 'fastify' {
  interface FastifyRequest {
    user?: User;
  }
}

type CreateUserRequest = FastifyRequest<{
  Body: string;
}>;

type UserBookRequest = FastifyRequest<{ Params: { bookId: string } }>;

const setBookReadStatus =
  (read: boolean) =>
  async ({ log, params: { bookId }, user }: UserBookRequest, res: FastifyReply) => {
    log.debug('bookId: %s', bookId);
    if (!user) {
      await res.status(403).send({ error: 'Not Authorized' });
      return;
    }

    const [userAudiobook] = await UserAudiobook.findOrCreate({ where: { UserId: user.id, AudiobookId: bookId } });

    await userAudiobook.update({ read });

    await res.status(204).send();
  };

const users: FastifyPluginAsync = async (fastify, _opts) => {
  fastify.decorateRequest<User | undefined>('user', undefined);

  fastify.get('/', async (_, res) => {
    const users = await User.findAll({
      order: ['username'],
      include: [User.associations.UserAudiobooks],
    });

    await res.send(users);
  });

  fastify.post('/', async ({ body }: CreateUserRequest, res) => {
    const { username } = JSON.parse(body);
    console.log('body.username: ', username);
    const user = await User.create({ username });

    await res.send(user);
  });

  fastify.post('/books/:bookId/read', setBookReadStatus(true));
  fastify.post('/books/:bookId/unread', setBookReadStatus(false));
};

export default users;
