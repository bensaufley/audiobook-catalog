import { DataTypes } from '@sequelize/core';

import type { Migration } from '~db/migrations';

export const up: Migration = async ({ context: queryInterface }) =>
  queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.createTable(
      'Users',
      {
        id: {
          allowNull: false,
          autoIncrement: false,
          primaryKey: true,
          type: DataTypes.TEXT,
        },
        username: {
          type: DataTypes.TEXT,
          allowNull: false,
          unique: true,
        },
        createdAt: {
          allowNull: false,
          type: DataTypes.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: DataTypes.DATE,
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
            table: 'Users',
            key: 'id',
          },
          type: DataTypes.TEXT,
        },
        AudiobookId: {
          allowNull: false,
          primaryKey: true,
          references: {
            table: 'Audiobooks',
            key: 'id',
          },
          type: DataTypes.TEXT,
        },
        read: {
          allowNull: false,
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
        createdAt: {
          allowNull: false,
          type: DataTypes.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: DataTypes.DATE,
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
