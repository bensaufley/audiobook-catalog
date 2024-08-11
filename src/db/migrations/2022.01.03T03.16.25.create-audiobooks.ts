import { DataTypes } from '@sequelize/core';

import type { Migration } from '~db/migrations';

export const up: Migration = async ({ context: queryInterface }) =>
  queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.createTable(
      'Audiobooks',
      {
        id: {
          allowNull: false,
          autoIncrement: false,
          primaryKey: true,
          type: DataTypes.TEXT,
        },
        title: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        filepath: {
          type: DataTypes.TEXT,
          allowNull: false,
          unique: true,
        },
        cover: {
          type: DataTypes.BLOB,
        },
        coverType: {
          type: DataTypes.TEXT,
        },
        duration: {
          type: DataTypes.REAL,
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
    await queryInterface.dropTable('Audiobooks', { transaction });
  });
