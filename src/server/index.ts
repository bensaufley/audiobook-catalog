import type { AddressInfo } from 'net';
import httpDevServer from 'vavite/http-dev-server';

import sequelize from '~db/sequelize';
import poll from '~server/filesystem/poll';
import init from '~server/init';

// TODO: get top-level await working
(async () => {
  const server = await init();

  const pollPeriod = parseInt(process.env.POLL_PERIOD || '', 10) || 5 * 60_000; // five minute default
  poll(sequelize, server.log, '/audiobooks', pollPeriod);

  try {
    await server.listen({
      port: httpDevServer ? (httpDevServer.address() as AddressInfo).port : 3000,
      host: '0.0.0.0',
    });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
})();
