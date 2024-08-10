import { Sequelize } from 'sequelize';

import config from '~db/config/index.mjs';

const sequelize = new Sequelize(config[process.env.APP_ENV]);

export default sequelize;
