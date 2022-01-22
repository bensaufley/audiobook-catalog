import { FastifyPluginAsync, FastifyRequest } from 'fastify';
import { basename } from 'path';

import Audiobook from '~db/models/Audiobook';
import UserAudiobook from '~db/models/UserAudiobook';

type BookRequest = FastifyRequest<{
  Params: { id: string };
}>;

const books: FastifyPluginAsync = async (fastify, opts) => {
  fastify.get('/', async (_, res) => {
    const audiobooks = await Audiobook.findAll({
      attributes: ['id', 'title', 'createdAt', 'duration'],
      include: [Audiobook.associations.Authors, Audiobook.associations.Narrators],
      order: [
        [Audiobook.associations.Authors, 'lastName', 'ASC'],
        [Audiobook.associations.Authors, 'firstName', 'ASC'],
        ['title', 'ASC'],
      ],

      logging: (...args) => fastify.log.debug(...args),
    });
    await res.send(audiobooks);
  });

  fastify.get('/:id', async ({ params: { id } }: BookRequest, res) => {
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

  fastify.get('/:id/cover', async ({ params: { id } }: BookRequest, res) => {
    const book = await Audiobook.findOne({ attributes: ['cover', 'coverType'], where: { id } });

    if (book === null) {
      await res.status(404).send({});
      return;
    }

    await res.header('Content-Type', book.coverType).send(book.cover);
  });

  fastify.get('/:id/download', async ({ params: { id } }: BookRequest, res) => {
    const book = await Audiobook.findOne({ attributes: ['filepath'], where: { id } });

    if (book === null) {
      await res.status(404);
      return;
    }

    const filename = basename(book.filepath);
    await res.header('Content-Disposition', `attachment; filename="${filename}"`).sendFile(book.filepath, '/');
  });
};

export default books;
