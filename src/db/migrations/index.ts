import { basename } from 'node:path';
import pino from 'pino';
import type { QueryInterface } from 'sequelize';
import { type RunnableMigration, SequelizeStorage, Umzug } from 'umzug';

import sequelize from '~db/sequelize';

const migrations = Object.entries(import.meta.glob('./*.*.*.ts', { eager: true })).map(
  ([path, mod]): RunnableMigration<QueryInterface> => {
    const { up, down } = mod as Pick<RunnableMigration<QueryInterface>, 'up' | 'down'>;

    return {
      path,
      // For backwards-compatibility with earlier version of the codebase:
      name: `${basename(path, '.ts')}.js`,

      up,
      ...(down ? { down } : {}),
    };
  },
);

export const umzug = new Umzug({
  migrations,
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: pino({ name: 'umzug' }),
});

// export the type helper exposed by umzug, which will have the `context` argument typed correctly
export type Migration = typeof umzug._types.migration;
