/// <reference types="vite/client" />

import type { AddressInfo } from 'net';
import type httpDevServer from 'vavite/http-dev-server';

import sequelize from '~db/sequelize';
import init from '~server/init';

import watch from './filesystem/watch';

const server = await init();

const teardown = watch(sequelize, server.log);

try {
  let devServer: typeof httpDevServer | undefined;
  if (import.meta.env.DEV) {
    // eslint-disable-next-line import/no-extraneous-dependencies
    ({ default: devServer } = await import('vavite/http-dev-server'));
  }
  await server.listen({
    port: (devServer?.address() as AddressInfo | undefined | null)?.port ?? 3000,
    host: '0.0.0.0',
  });
} catch (err) {
  server.log.error(err);
  process.exit(1);
}

if (import.meta.hot) {
  import.meta.hot.accept(() => {
    server.log.info('Reloading server...');
    server
      .close()
      .then(teardown)
      .then(init)
      .then((newServer) => {
        Object.assign(server, newServer);
      });
  });
}
