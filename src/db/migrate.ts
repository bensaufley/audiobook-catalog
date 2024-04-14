import pino from 'pino';
import { SequelizeStorage, Umzug } from 'umzug';

import sequelize from '~db/sequelize';

// eslint-disable-next-line import/prefer-default-export
export const umzug = new Umzug({
  migrations: { glob: 'src/db/migrations/*.*.*.ts' },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: pino({ name: 'umzug' }),
});

umzug.runAsCLI();
