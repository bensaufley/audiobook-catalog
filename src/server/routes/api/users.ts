import type { FastifyPluginAsync, FastifyRequest } from 'fastify';

import UpNext from '~db/models/UpNext';
import User from '~db/models/User';
import UserAudiobook from '~db/models/UserAudiobook';
import sequelize from '~db/sequelize';

import { checkForUser, type UserRequest } from './types';

type UserBookRequest = UserRequest<{ Params: { bookId: string } }, true>;
const setBookReadStatus = (read: boolean) =>
  checkForUser(async ({ params: { bookId }, user }: UserBookRequest, res) => {
    const [userAudiobook] = await UserAudiobook.findOrCreate({ where: { UserId: user.id, AudiobookId: bookId } });

    await userAudiobook.update({ read });

    await res.status(204).send();
  });

const addToUpNext = checkForUser(async ({ log, params: { bookId }, user }: UserBookRequest, res) => {
  try {
    await UpNext.create({ UserId: user.id, AudiobookId: bookId });

    await res.status(204).send();
  } catch (error) {
    log.error(error, 'Error adding book to up next');
    await res.status(500).send({ error });
  }
});

const removeFromUpNext = checkForUser(async ({ log, params: { bookId }, user }: UserBookRequest, res) => {
  try {
    await UpNext.destroy({ where: { UserId: user.id, AudiobookId: bookId } });

    await res.status(204).send();
  } catch (error) {
    log.error(error, 'Error removing book from up next');
    await res.status(500).send({ error });
  }
});

const reorderUpNext = checkForUser(
  async ({ log, body: { bookIds }, user }: UserRequest<{ Body: { bookIds: string[] } }, true>, res) => {
    try {
      let upNexts: UpNext[] | undefined;
      sequelize.transaction(async (transaction) => {
        await UpNext.destroy({ where: { UserId: user.id }, transaction });
        upNexts = await UpNext.bulkCreate(
          bookIds.map(
            (id, index) => ({
              UserId: user.id,
              AudiobookId: id,
              order: index,
            }),
            { transaction },
          ),
        );
      });

      await res.status(200).send({ upNexts });
    } catch (error) {
      log.error(error, 'Error reordering up nexts');
      await res.status(500).send({ error });
    }
  },
);

const users: FastifyPluginAsync = async (fastify, _opts) => {
  fastify.decorateRequest<User | undefined>('user', undefined);

  fastify.get('/', async (_, res) => {
    const users = await User.findAll({
      order: ['username'],
      include: [User.associations.UserAudiobooks],
    });

    await res.send(users);
  });

  fastify.post('/', async ({ body }: FastifyRequest<{ Body: string }>, res) => {
    const { username } = JSON.parse(body);
    console.log('body.username: ', username);
    const user = await User.create({ username });

    await res.send(user);
  });

  fastify.post('/books/:bookId/read', setBookReadStatus(true));
  fastify.post('/books/:bookId/unread', setBookReadStatus(false));

  fastify.post('/books/:bookId/up-next', addToUpNext);
  fastify.delete('/books/:bookId/up-next', removeFromUpNext);
  fastify.post('/books/up-next', reorderUpNext);
};

export default users;
