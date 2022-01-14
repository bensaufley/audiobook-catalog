import { SequelizeStorage, Umzug } from 'umzug';
import sequelize from '~db/sequelize';

export const umzug = new Umzug({
  migrations: { glob: 'src/db/migrations/*.*.*.ts' },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});

umzug.runAsCLI();
