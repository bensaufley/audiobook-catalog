import { FastifyLoggerInstance } from 'fastify';
import { extname } from 'path';
import type { Sequelize } from 'sequelize';
import importBook from '~server/filesystem/importBook';

import walk from '~server/filesystem/walk';
import { wait } from '~shared/utilities';

const extensions = ['.m4a', '.m4b'];

const poll = async (sequelize: Sequelize, log: FastifyLoggerInstance, directory: string, pollPeriod: number) => {
  try {
    log.info('Walking %s...', directory);
    const files = await walk(directory);
    log.info('Found %d files.', files.length);

    let i = files.length;
    while (i--) {
      const filepath = files[i];
      if (!extensions.includes(extname(filepath))) continue;

      await importBook(filepath, sequelize, log);
    }

    log.info('Done importing from %s.', directory);
  } catch (error) {
    log.error({ error }, 'Error walking %s');
  }
  await wait(pollPeriod);

  setImmediate(() => poll(sequelize, log, directory, pollPeriod));
};

export default poll;
