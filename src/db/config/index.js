// @ts-check

const { join } = require('path');

/** @type {{[key in typeof process.env.APP_ENV]?: import('sequelize').Options}} */
const config = {
  [process.env.APP_ENV]: {
    dialect: 'sqlite',
    storage: join(process.env.DB_DIR || '/audiobooks', process.env.DB_NAME),
  },
};

module.exports = config;
