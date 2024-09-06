import type { FastifyPluginAsync } from 'fastify';
import { basename } from 'path';
import { Op } from 'sequelize';

import Audiobook from '~db/models/Audiobook';
import Tag from '~db/models/Tag';
import UpNext from '~db/models/UpNext';
import UserAudiobook from '~db/models/UserAudiobook';

import { checkForUser, type UserRequest } from '../types';

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
  fastify.get<BookParams>('/', async ({ params: { bookId: id } }, res) => {
    const book = await Audiobook.findOne({
      attributes: ['id', 'title', 'createdAt', 'duration'],
      include: [Audiobook.associations.Authors, Audiobook.associations.Narrators],
      where: { id },
    });

    if (book === null) {
      await res.status(404).send({});
      return;
    }

    await res.send(book);
  });

  fastify.get<BookParams>('/cover', async ({ params: { bookId: id } }, res) => {
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
  });

  fastify.get<BookParams>('/download', async ({ params: { bookId: id } }, res) => {
    const book = await Audiobook.findOne({ attributes: ['filepath'], where: { id } });

    if (book === null) {
      await res.status(404);
      return;
    }

    const filename = basename(book.filepath);
    await res.header('Content-Disposition', `attachment; filename="${filename}"`).sendFile(book.filepath, '/');
  });

  fastify.post('/read', setBookReadStatus(true));
  fastify.post('/unread', setBookReadStatus(false));

  fastify.post<BookParams & { Querystring: { name: string } }>(
    '/tag',
    async ({ query: { name }, params: { bookId } }, res) => {
      const tag = await Tag.findOne({ where: { name } });
      if (!tag) {
        return res.status(404).send({ error: 'Tag not found' });
      }
      await tag.addAudiobook(bookId);
      return res.status(204).send();
    },
  );

  fastify.delete<BookParams & { Querystring: { name: string } }>(
    '/tag',
    async ({ query: { name }, params: { bookId } }, res) => {
      if (!bookId || !name) return res.status(400).send({ error: 'Missing bookId or tag name' });

      const tag = await Tag.findOne({ where: { name } });
      if (!tag) return res.status(404).send({ error: 'Tag not found' });

      await tag.removeAudiobook(bookId);
      return res.status(204).send();
    },
  );

  fastify.post<{ Params: { bookId: string } }>(
    '/up-next',
    checkForUser(async ({ user, params: { bookId } }, res) => {
      await UpNext.create({ UserId: user.id, AudiobookId: bookId });

      await res.status(204).send();
    }),
  );

  fastify.delete<{ Params: { bookId: string } }>(
    '/up-next',
    checkForUser(async ({ user, params: { bookId } }, res) => {
      await UpNext.destroy({ where: { UserId: user.id, AudiobookId: bookId } });

      await res.status(204).send();
    }),
  );
};

export default book;
