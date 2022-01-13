import Fastify, { FastifyRequest } from 'fastify';
import fastifyStatic from 'fastify-static';
import type webpackT from 'webpack';
import { basename } from 'path';

import type * as configT from '../../webpack.config';
import { umzug } from '~db/migrations';
import { resolve } from 'path';
import sequelize from '~db/sequelize';
import poll from '~server/filesystem/poll';
import Audiobook from '~db/models/Audiobook';
import { ready } from '~db/models';

type BookRequest = FastifyRequest<{
  Params: { id: string };
}>;

export const init = async () => {
  await umzug.up();

  await ready;

  const fastify = Fastify({
    logger: {
      prettyPrint: process.env.APP_ENV === 'development',
    },
  });

  if (process.env.APP_ENV === 'development') {
    const webpack: typeof webpackT = require('webpack');
    const HMR = require('fastify-webpack-hmr');
    const { clientConfig }: typeof configT = require('../../webpack.config');

    const compiler = webpack(clientConfig);
    fastify.register(HMR, { compiler, webpackDev: { publicPath: '/static/' } });
  }

  fastify.register(fastifyStatic, {
    root: resolve(__dirname, '../client'),
    prefix: '/static/',
  });

  fastify.get('/books', async (_, res) => {
    const audiobooks = await Audiobook.findAll({
      attributes: ['id', 'title', 'duration'],
      include: [Audiobook.associations.Authors, Audiobook.associations.Narrators],
      order: [
        [Audiobook.associations.Authors, 'lastName', 'ASC'],
        [Audiobook.associations.Authors, 'firstName', 'ASC'],
        ['title', 'ASC'],
      ],

      logging: fastify.log.debug,
    });
    await res.send(audiobooks);
  });

  fastify.get('/books/:id', async ({ params: { id } }: BookRequest, res) => {
    const book = await Audiobook.findOne({
      attributes: ['id', 'title', 'duration'],
      include: [Audiobook.associations.Authors, Audiobook.associations.Narrators],
      where: { id },
    });

    if (book === null) {
      await res.status(404).send({});
      return;
    }

    await res.send(book);
  });

  fastify.get('/books/:id/cover', async ({ params: { id } }: BookRequest, res) => {
    const book = await Audiobook.findOne({ attributes: ['cover', 'coverType'], where: { id } });

    if (book === null) {
      await res.status(404).send({});
      return;
    }

    await res.header('Content-Type', book.coverType).send(book.cover);
  });

  fastify.get('/books/:id/download', async ({ params: { id } }: BookRequest, res) => {
    const book = await Audiobook.findOne({ attributes: ['filepath'], where: { id } });

    if (book === null) {
      await res.status(404);
      return;
    }

    const filename = basename(book.filepath);
    await res.header('Content-Disposition', `attachment; filename="${filename}"`).sendFile(book.filepath, '/');
  });

  fastify.get('/*', async (req, res) => {
    await res.sendFile('index.html');
  });

  return fastify;
};

if (process.env.AUTORUN === 'true') {
  (async () => {
    const server = await init();
    if (!process.env.AUDIOBOOKS_PATH) {
      server.log.error('AUDIOBOOKS_PATH cannot be empty');
      process.exit(1);
    }

    const pollPeriod = parseInt(process.env.POLL_PERIOD || '', 10) || 5 * 60_000; // five minute default
    poll(sequelize, server.log, process.env.AUDIOBOOKS_PATH, pollPeriod);

    try {
      await server.listen(3000, '0.0.0.0');
    } catch (err) {
      server.log.error(err);
      process.exit(1);
    }
  })();
}
