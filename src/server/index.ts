import Fastify from 'fastify';
import fastifyStatic from 'fastify-static';
import type webpackT from 'webpack';

import type * as configT from '../../webpack.config';
import { umzug } from '~db/migrations';
import { resolve } from 'path';

export const init = async () => {
  await umzug.up();

  const fastify = Fastify({
    logger: true,
  });

  if (process.env.APP_ENV === 'development') {
    const webpack: typeof webpackT = require('webpack');
    const HMR = require('fastify-webpack-hmr');
    const { clientConfig }: typeof configT = require('../../webpack.config');

    const compiler = webpack(clientConfig);
    fastify.register(HMR, { compiler });
  }

  fastify.register(fastifyStatic, {
    root: resolve(__dirname, '../client'),
    prefix: '/static/',
  });

  fastify.get('/*', async (req, res) => {
    await res.sendFile('index.html');
  });

  return fastify;
};

if (process.env.AUTORUN === 'true') {
  (async () => {
    const server = await init();
    try {
      await server.listen(3000, '0.0.0.0');
    } catch (err) {
      server.log.error(err);
      process.exit(1);
    }
  })();
}
