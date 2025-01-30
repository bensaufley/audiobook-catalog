// @ts-check

import { join } from 'node:path';
import sqlite3 from 'sqlite3';

if (process.env.DB_VERBOSE) {
  sqlite3.verbose();
}

/** @type {{[key in typeof process.env.APP_ENV]?: import('sequelize').Options}} */
const config = {
  [process.env.APP_ENV]: {
    dialect: 'sqlite',
    storage: join(process.env.DB_DIR || '/db/', `${process.env.DB_NAME}.sqlite3`),
    module: sqlite3,
  },
};

export default config;
