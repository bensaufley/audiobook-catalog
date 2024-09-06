import { DATE, INTEGER, UUIDV4 } from 'sequelize';

import type { Migration } from '~db/migrations';

export const up: Migration = async ({ context: queryInterface }) =>
  queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.createTable(
      'UpNexts',
      {
        order: {
          type: INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        AudiobookId: {
          type: UUIDV4,
          references: {
            model: 'Audiobooks',
            key: 'id',
          },
          primaryKey: true,
        },
        UserId: {
          type: UUIDV4,
          references: {
            model: 'Users',
            key: 'id',
          },
          primaryKey: true,
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
    await queryInterface.dropTable('UpNexts', { transaction });
  });
