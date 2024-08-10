import { DATE, STRING } from 'sequelize';

import type { Migration } from '~db/migrations';

export const up: Migration = async ({ context: queryInterface }) =>
  queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.createTable(
      'Authors',
      {
        id: {
          allowNull: false,
          autoIncrement: false,
          primaryKey: true,
          type: STRING,
        },
        firstName: {
          type: STRING,
        },
        lastName: {
          type: STRING,
          allowNull: false,
        },
        createdAt: {
          allowNull: false,
          type: DATE,
        },
        updatedAt: {
          allowNull: false,
          type: DATE,
        },
      },
      { transaction },
    );
  });

export const down: Migration = async ({ context: queryInterface }) =>
  queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.dropTable('Authors', { transaction });
  });
