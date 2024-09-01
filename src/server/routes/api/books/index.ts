import type { FastifyPluginAsync } from 'fastify';

import Audiobook from '~db/models/Audiobook';
import UpNext from '~db/models/UpNext';
import sequelize from '~db/sequelize';

import { checkForUser, type UserRequest } from '../types';

import book from './book';

type BooksRequest = UserRequest<{ Querystring: { page?: number; perPage?: number } }>;

const books: FastifyPluginAsync = async (fastify, _opts) => {
  fastify.get<{ Querystring: { page?: number; perPage?: number } }>(
    '/',
    async ({ log, user, query: { page, perPage } }: BooksRequest, res) => {
      log.debug('user: %o', user);
      const total = await Audiobook.count();
      const audiobooks = await Audiobook.findAll({
        attributes: ['id', 'title', 'createdAt', 'duration'],
        include: [Audiobook.associations.Authors, Audiobook.associations.Narrators],
        order: [
          [Audiobook.associations.Authors, 'lastName', 'ASC'],
          [Audiobook.associations.Authors, 'firstName', 'ASC'],
          ['title', 'ASC'],
        ],
        ...(page && perPage ? { offset: (page - 1) * perPage, limit: perPage } : {}),

        logging: (...args) => fastify.log.debug(...args),
      });
      await res.send({ audiobooks, total, more: page && perPage ? page * perPage < total : false });
    },
  );

  fastify.get('/up-next', async ({ user }: UserRequest, res) => {
    if (!user) {
      await res.send({ upNexts: [] });
      return;
    }

    const upNexts = await user.getUpNexts({ attributes: ['AudiobookId', 'order'] });
    await res.send({ upNexts });
  });

  fastify.post<{ Body: { bookIds: string[] } }>(
    '/up-next',
    checkForUser(async ({ user, log, body: { bookIds } }, res) => {
      try {
        let upNexts: UpNext[] | undefined;
        await sequelize.transaction(async (transaction) => {
          await UpNext.destroy({ where: { UserId: user.id }, transaction });
          upNexts = await UpNext.bulkCreate(
            bookIds.map((id, index) => ({
              UserId: user.id,
              AudiobookId: id,
              order: index,
            })),
            { transaction },
          );
        });

        await res.status(200).send({ upNexts });
      } catch (error) {
        log.error(error, 'Error reordering up nexts');
        await res.status(500).send({ error: (error as Error).message });
      }
    }),
  );

  fastify.register(book, { prefix: '/:bookId' });
};

export default books;
