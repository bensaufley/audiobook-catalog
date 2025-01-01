import s from 'ajv-ts';
import type { FastifyPluginAsync } from 'fastify';

import Audiobook from '~db/models/Audiobook.js';
import UpNext from '~db/models/UpNext.js';
import UserAudiobook from '~db/models/UserAudiobook.js';
import sequelize from '~db/sequelize.js';
import { onlyUserHeader } from '~server/utils/schema.js';
import withLock from '~shared/withLock.js';

import { checkForUser, type UserRequest } from '../types.js';

import book from './book.js';

type BooksRequest = UserRequest<{ Querystring: { page?: number; perPage?: number } }>;

const books: FastifyPluginAsync = async (fastify, _opts) => {
  fastify.get<{ Querystring: { page?: number; perPage?: number } }>('/', {
    handler: async ({ log, user, query: { page, perPage } }: BooksRequest, res) =>
      withLock('db', async () => {
        log.debug('user: %o', user);
        const total = await Audiobook.count();
        const audiobooks = await Audiobook.findAll({
          attributes: ['id', 'title', 'createdAt', 'updatedAt', 'duration'],
          include: [Audiobook.associations.Authors, Audiobook.associations.Narrators],
          order: [
            [Audiobook.associations.Authors, 'lastName', 'ASC'],
            [Audiobook.associations.Authors, 'firstName', 'ASC'],
            ['title', 'ASC'],
          ],
          ...(page && perPage ? { offset: (page - 1) * perPage, limit: perPage } : {}),

          logging: (...args) => fastify.log.debug(...args),
        });
        await res.status(200).send({ audiobooks, total, more: page && perPage ? page * perPage < total : false });
      }),
    schema: {
      description: 'Get all audiobooks',
      headers: onlyUserHeader(false),
      querystring:
        // TODO: https://github.com/fastify/ajv-compiler/issues/105
        // .dependentRequired({
        //   page: ['perPage'],
        //   perPage: ['page'],
        // })
        s
          .object({
            page: s.integer().minimum(1),
            perPage: s.integer().minimum(1),
          })
          .partial().schema,
      response: {
        200: s
          .object({
            audiobooks: s.array(s.object().meta({ $ref: 'audiobook-catalog#/components/schemas/Audiobook' })),
            total: s.integer(),
            more: s.boolean(),
          })
          .required().schema,
      },
    },
  });

  fastify.get('/read', {
    handler: checkForUser(async ({ user }, res) => {
      const read = await UserAudiobook.findAll({ where: { UserId: user.id, read: true } });
      return res.status(200).send({ bookIds: read.map((r) => r.AudiobookId) });
    }),
    schema: {
      description: 'Get all read books for user',
      headers: onlyUserHeader(),
      response: {
        200: s.object({ bookIds: s.array(s.string().format('uuid')) }).required().schema,
      },
    },
  });

  fastify.get('/up-next', {
    handler: async ({ user }: UserRequest, res) =>
      withLock('db', async () => {
        if (!user) {
          await res.send({ upNexts: [] });
          return;
        }

        const upNexts = await user.getUpNexts({ attributes: ['AudiobookId', 'order'] });
        await res.send({ upNexts });
      }),
    schema: {
      description: 'Get up next list for user',
      headers: onlyUserHeader(),
      response: {
        200: s
          .object({
            upNexts: s.array(s.object().meta({ $ref: 'audiobook-catalog#/components/schemas/UpNext' })),
          })
          .requiredFor('upNexts').schema,
      },
    },
  });

  fastify.post<{ Body: { bookIds: string[] } }>('/up-next', {
    handler: checkForUser<{ Body: { bookIds: string[] } }>(async ({ user, log, body: { bookIds } }, res) => {
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
    schema: {
      description:
        'Reorder or bulk-change up next list. Completely replaces the current list for this user with the provided bookIds',
      headers: onlyUserHeader(),
      body: s.object({ bookIds: s.array(s.string().format('uuid')).minLength(1) }).required().schema,
      response: {
        200: s
          .object({
            upNexts: s.array(s.object().meta({ $ref: 'audiobook-catalog#/components/schemas/UpNext' })),
          })
          .requiredFor('upNexts').schema,
      },
    },
  });

  fastify.register(book, { prefix: '/:bookId' });
};

export default books;
