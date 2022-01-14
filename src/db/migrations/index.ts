const isProd = process.env.APP_ENV === 'prod';

import { SequelizeStorage, Umzug } from 'umzug';

import sequelize from '~db/sequelize';

export const umzug = new Umzug({
  migrations: { glob: '.build/migrations/*.js' },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});

// export the type helper exposed by umzug, which will have the `context` argument typed correctly
export type Migration = typeof umzug._types.migration;
