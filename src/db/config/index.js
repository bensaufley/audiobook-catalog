// @ts-check

/** @type {{[key in typeof process.env.APP_ENV]?: import('sequelize').Options}} */
const config = {
  [process.env.APP_ENV]: {
    dialect: 'sqlite',
    storage: process.env.DB_PATH,
  },
};

module.exports = config;
