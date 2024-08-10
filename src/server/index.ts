/// <reference types="vite/client" />

import type { AddressInfo } from 'net';
import type httpDevServer from 'vavite/http-dev-server';

import sequelize from '~db/sequelize';
import poll from '~server/filesystem/poll';
import init from '~server/init';

const server = await init();

const pollPeriod = parseInt(process.env.POLL_PERIOD || '', 10) || 5 * 60_000; // five minute default
poll(sequelize, server.log, '/audiobooks', pollPeriod);

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
