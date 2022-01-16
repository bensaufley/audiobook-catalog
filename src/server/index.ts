import sequelize from '~db/sequelize';
import poll from '~server/filesystem/poll';
import init from '~server/init';

// TODO: get top-level await working
(async () => {
  const server = await init();
  if (!process.env.DB_DIR) {
    server.log.warn('DB_DIR is empty; using /audiobooks');
  }

  const pollPeriod = parseInt(process.env.POLL_PERIOD || '', 10) || 5 * 60_000; // five minute default
  poll(sequelize, server.log, '/audiobooks', pollPeriod);

  try {
    await server.listen(3000, '0.0.0.0');
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
})();
