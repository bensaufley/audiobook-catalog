import { DATE, TEXT, UUIDV4 } from 'sequelize';

import type { Migration } from '~db/migrations';

export const up: Migration = async ({ context: queryInterface }) =>
  queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.createTable(
      'Tags',
      {
        id: {
          allowNull: false,
          autoIncrement: false,
          primaryKey: true,
          type: UUIDV4,
        },
        name: {
          type: TEXT,
          allowNull: false,
          unique: true,
        },
        color: {
          type: TEXT,
          allowNull: false,
          unique: true,
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

    await queryInterface.createTable(
      'AudiobookTags',
      {
        AudiobookId: {
          type: UUIDV4,
          references: {
            model: 'Audiobooks',
            key: 'id',
          },
          primaryKey: true,
        },
        TagId: {
          type: UUIDV4,
          references: {
            model: 'Tags',
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
    await queryInterface.dropTable('AudiobookTags', { transaction });
    await queryInterface.dropTable('UserTags', { transaction });
    await queryInterface.dropTable('Tags', { transaction });
  });
