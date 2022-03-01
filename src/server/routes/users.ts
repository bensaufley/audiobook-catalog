import { FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify';
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
  async ({ params: { bookId }, user }: UserBookRequest, res: FastifyReply) => {
    if (!user) {
      await res.status(403).send({ error: 'Not Authorized' });
      return;
    }

    const [userAudiobook] = await UserAudiobook.findOrCreate({ where: { UserId: user.id, AudiobookId: bookId } });

    await userAudiobook.update({ read });

    await res.status(204);
  };

export const addUserHook: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('preHandler', async (req) => {
    const userId = req.headers['x-audiobook-catalog-user'];

    if (!userId) return;

    try {
      const user = await User.findOne({ where: { id: userId } });

      if (user) req.user = user;
      else req.log.warn('No User found for id %s', userId);
    } catch (err) {
      req.log.error(err);
    }
  });
};

const users: FastifyPluginAsync = async (fastify, opts) => {
  fastify.decorateRequest<User | undefined>('user', undefined);
  fastify.register(addUserHook);

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
