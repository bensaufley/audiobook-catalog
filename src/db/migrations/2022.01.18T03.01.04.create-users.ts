import { BOOLEAN, DATE, STRING } from 'sequelize';

import type { Migration } from '~db/migrations/index.js';

export const up: Migration = async ({ context: queryInterface }) =>
  queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.createTable(
      'Users',
      {
        id: {
          allowNull: false,
          autoIncrement: false,
          primaryKey: true,
          type: STRING,
        },
        username: {
          type: STRING,
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
      'UserAudiobooks',
      {
        UserId: {
          allowNull: false,
          primaryKey: true,
          references: {
            model: 'Users',
            key: 'id',
          },
          type: STRING,
        },
        AudiobookId: {
          allowNull: false,
          primaryKey: true,
          references: {
            model: 'Audiobooks',
            key: 'id',
          },
          type: STRING,
        },
        read: {
          allowNull: false,
          type: BOOLEAN,
          defaultValue: false,
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
    await queryInterface.removeConstraint('UserAudiobooks', 'userAudiobooksUserReference', { transaction });
    await queryInterface.removeConstraint('UserAudiobooks', 'userAudiobooksAudiobookReference', { transaction });
    await queryInterface.dropTable('UserAudiobooks', { transaction });
    await queryInterface.dropTable('Users', { transaction });
  });
