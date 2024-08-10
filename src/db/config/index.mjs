// @ts-check

import { join } from 'node:path';

/** @type {{[key in typeof process.env.APP_ENV]?: import('sequelize').Options}} */
const config = {
  [process.env.APP_ENV]: {
    dialect: 'sqlite',
    storage: join(process.env.DB_DIR || '/db/', `${process.env.DB_NAME}.sqlite3`),
  },
};

export default config;
