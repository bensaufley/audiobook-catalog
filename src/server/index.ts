/// <reference types="vite/client" />

import sequelize from '~db/sequelize.js';
import watch from '~server/filesystem/watch.js';
import init from '~server/init.js';

const server = await init();

watch(sequelize, server.log);

try {
  await server.listen({
    port: 3000,
    host: '0.0.0.0',
  });
} catch (err) {
  server.log.error(err);
  process.exit(1);
}
