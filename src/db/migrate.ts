import { pino } from 'pino';
import { SequelizeStorage, Umzug } from 'umzug';

import sequelize from '~db/sequelize.js';

// eslint-disable-next-line import/prefer-default-export
export const umzug = new Umzug({
  migrations: { glob: import.meta.resolve('./migrations/*.*.*.ts') },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: pino({ name: 'umzug' }),
});

if (process.argv[1] && import.meta.url.endsWith(process.argv[1])) {
  umzug.runAsCLI();
}
