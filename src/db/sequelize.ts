import { Sequelize } from 'sequelize';

import config from '~db/config/index.mjs';

const sequelize = new Sequelize(config[process.env.APP_ENV]);
await sequelize.query('PRAGMA journal_mode = WAL;', { raw: true });

export default sequelize;
