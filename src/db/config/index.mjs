// @ts-check

import { SqliteDialect } from '@sequelize/sqlite3';
import * as betterSqlite3 from 'better-sqlite3';
import { join } from 'node:path';

/** @type {{[key in typeof process.env.APP_ENV]?: import('sequelize').Options}} */
const config = {
  [process.env.APP_ENV]: {
    dialect: SqliteDialect,
    storage: join(process.env.DB_DIR || '/db/', `${process.env.DB_NAME}.sqlite3`),
    dialectOptions: /** @type {import('@sequelize/sqlite3').SqliteDialectOptions} */ ({
      sqlite3Module: betterSqlite3,
    }),
  },
};

export default config;
