import Fastify, { FastifyRequest } from 'fastify';
import fastifyStatic from 'fastify-static';
import type webpackT from 'webpack';
import { basename, resolve } from 'path';

import type * as configT from '../../webpack.config';
import { umzug } from '~db/migrations';
import Audiobook from '~db/models/Audiobook';
import { ready } from '~db/models';

type BookRequest = FastifyRequest<{
  Params: { id: string };
}>;

const logLevels = ['trace', 'debug', 'info', 'warn', 'error'];
const sanitizeLogLevel = (level?: string) => {
  const standardized = level?.trim()?.toLocaleLowerCase();

  if (!standardized) return 'info';

  return logLevels.includes(standardized) ? standardized : 'info';
};

const init = async () => {
  await umzug.up();

  await ready;

  const fastify = Fastify({
    logger: {
      prettyPrint: process.env.APP_ENV === 'development',
      level: sanitizeLogLevel(process.env.LOG_LEVEL),
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

      logging: (...args) => fastify.log.debug(...args),
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

export default init;
