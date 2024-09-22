import s from 'ajv-ts';
import type { FastifyPluginAsync } from 'fastify';
import { basename } from 'path';
import { Op } from 'sequelize';

import Audiobook from '~db/models/Audiobook.js';
import Tag from '~db/models/Tag.js';
import UpNext from '~db/models/UpNext.js';
import UserAudiobook from '~db/models/UserAudiobook.js';

import { bookIdParams, onlyUserHeader } from '../../../utils/schema.js';
import { checkForUser, type UserRequest } from '../types.js';

interface BookParams {
  Params: { bookId: string };
}

const setBookReadStatus = (read: boolean) =>
  checkForUser(async ({ params: { bookId }, user }: UserRequest<BookParams, true>, res) => {
    const [userAudiobook] = await UserAudiobook.findOrCreate({ where: { UserId: user.id, AudiobookId: bookId } });

    await userAudiobook.update({ read });

    await res.status(204).send();
  });

const book: FastifyPluginAsync = async (fastify, _opts) => {
  fastify.get<BookParams>('/', {
    handler: async ({ params: { bookId: id } }, res) => {
      const book = await Audiobook.findOne({
        attributes: ['id', 'title', 'createdAt', 'updatedAt', 'duration'],
        include: [Audiobook.associations.Authors, Audiobook.associations.Narrators],
        where: { id },
      });

      if (book === null) {
        await res.status(404).send({});
        return;
      }

      await res.send(book);
    },
    schema: {
      description: 'Get book by id',
      ...bookIdParams,
      response: {
        200: s.object().meta({ $ref: 'audiobook-catalog#/components/schemas/Audiobook' }).schema,
      },
    },
  });

  fastify.get<BookParams>('/cover', {
    handler: async ({ params: { bookId: id } }, res) => {
      const book = (await Audiobook.findOne({
        attributes: ['cover', 'coverType'],
        where: { id, cover: { [Op.ne]: null } },
      })) as Audiobook<true> | null;

      if (book === null) {
        await res.status(404).send({});
        return;
      }

      res.header('Cache-Control', 'public, max-age=31536000');
      res.header('Content-Type', book.coverType);
      await res.send(book.cover);
    },
    schema: {
      description: 'Book cover image',
      ...bookIdParams,
      response: {
        200: {
          content: {
            'application/png': {
              schema: {
                type: 'string',
                format: 'binary',
              },
            },
            'application/jpeg': {
              schema: {
                type: 'string',
                format: 'binary',
              },
            },
          },
        },
      },
    },
  });

  fastify.get<BookParams>('/download', {
    handler: async ({ params: { bookId: id }, log }, res) => {
      log.info({ id }, 'Download book');
      const book = await Audiobook.findOne({ attributes: ['filepath'], where: { id } });

      if (book === null) {
        log.warn({ id }, 'Book not found');
        await res.status(404);
        return;
      }

      log.info({ filepath: book.filepath }, 'Sending file');
      const filename = basename(book.filepath);
      await res.header('Content-Disposition', `attachment; filename="${filename}"`).sendFile(book.filepath, '/');
    },
    schema: {
      description: 'Download Audiobook',
      ...bookIdParams,
      response: {
        200: {
          content: {
            '*': {
              schema: {
                type: 'string',
                format: 'binary',
              },
            },
          },
        },
      },
    },
  });

  fastify.post('/read', {
    handler: setBookReadStatus(true),
    schema: {
      description: 'Mark book as read',
      ...bookIdParams,
      headers: onlyUserHeader(),
      response: {
        204: s.never().schema,
      },
    },
  });

  fastify.post('/unread', {
    handler: setBookReadStatus(false),
    schema: {
      description: 'Mark book as unread',
      ...bookIdParams,
      headers: onlyUserHeader(),
      response: {
        204: s.never().schema,
      },
    },
  });

  fastify.post<BookParams & { Querystring: { name: string } }>('/tag', {
    handler: async ({ query: { name }, params: { bookId } }, res) => {
      const tag = await Tag.findOne({ where: { name } });
      if (!tag) {
        return res.status(404).send({ error: 'Tag not found' });
      }
      await tag.addAudiobook(bookId);
      return res.status(204).send();
    },
    schema: {
      description: 'Add tag to book',
      ...bookIdParams,
      response: {
        204: s.never().schema,
      },
    },
  });

  fastify.delete<BookParams & { Querystring: { name: string } }>('/tag', {
    handler: async ({ query: { name }, params: { bookId } }, res) => {
      if (!bookId || !name) return res.status(400).send({ error: 'Missing bookId or tag name' });

      const tag = await Tag.findOne({ where: { name } });
      if (!tag) return res.status(404).send({ error: 'Tag not found' });

      await tag.removeAudiobook(bookId);
      return res.status(204).send();
    },
    schema: {
      description: 'Remove tag from book',
      ...bookIdParams,
      response: {
        204: s.never().schema,
      },
    },
  });

  fastify.post<{ Params: { bookId: string } }>('/up-next', {
    handler: checkForUser<{ Params: { bookId: string } }>(async ({ user, params: { bookId } }, res) => {
      await UpNext.create({ UserId: user.id, AudiobookId: bookId });

      await res.status(204).send();
    }),
    schema: {
      description: 'Add book to up next list',
      ...bookIdParams,
      headers: onlyUserHeader(),
    },
  });

  fastify.delete<{ Params: { bookId: string } }>('/up-next', {
    handler: checkForUser<{ Params: { bookId: string } }>(async ({ user, params: { bookId } }, res) => {
      await UpNext.destroy({ where: { UserId: user.id, AudiobookId: bookId } });

      await res.status(204).send();
    }),
    schema: {
      description: 'Remove book from up next list',
      ...bookIdParams,
      headers: onlyUserHeader(),
    },
  });
};

export default book;
