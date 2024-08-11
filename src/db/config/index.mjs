// @ts-check

import { SqliteDialect } from '@sequelize/sqlite3';
import { join } from 'node:path';

import dbModels from '../models';

/** @type {import('@sequelize/core').Options<import('@sequelize/sqlite3').SqliteDialect>} */
const config = {
  dialect: SqliteDialect,
  storage: join(process.env.DB_DIR || '/db/', `${process.env.DB_NAME}.sqlite3`),
  models: dbModels,
};

/** @type {{[key in typeof process.env.APP_ENV]?: import('@sequelize/core').Options<import('@sequelize/sqlite3').SqliteDialect>}} */
const envConfig = {
  [process.env.APP_ENV]: config,
};

export default envConfig;
