import { DataTypes } from '@sequelize/core';

import type { Migration } from '~db/migrations';

export const up: Migration = async ({ context: queryInterface }) =>
  queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.createTable(
      'Narrators',
      {
        id: {
          allowNull: false,
          autoIncrement: false,
          primaryKey: true,
          type: DataTypes.TEXT,
        },
        firstName: {
          type: DataTypes.TEXT,
        },
        lastName: {
          type: DataTypes.TEXT,
          allowNull: false,
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
      'AudiobookNarrators',
      {
        id: {
          allowNull: false,
          autoIncrement: false,
          primaryKey: true,
          type: DataTypes.TEXT,
        },
        NarratorId: {
          allowNull: false,
          primaryKey: true,
          type: DataTypes.TEXT,
        },
        AudiobookId: {
          allowNull: false,
          primaryKey: true,
          type: DataTypes.TEXT,
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

    await queryInterface.addConstraint('AudiobookNarrators', {
      fields: ['NarratorId'],
      name: 'audiobookNarratorNarratorReference',
      type: 'FOREIGN KEY',
      references: {
        table: 'Narrators',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      transaction,
    });

    await queryInterface.addConstraint('AudiobookNarrators', {
      fields: ['AudiobookId'],
      name: 'audiobookNarratorsAudiobookReference',
      type: 'FOREIGN KEY',
      references: {
        table: 'Audiobooks',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      transaction,
    });
  });

export const down: Migration = async ({ context: queryInterface }) =>
  queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.removeConstraint('AudiobookNarrators', 'audiobookNarratorsNarratorReference', { transaction });
    await queryInterface.removeConstraint('AudiobookNarrators', 'audiobookNarratorsAudiobookReference', {
      transaction,
    });
    await queryInterface.dropTable('AudiobookNarrators', { transaction });
    await queryInterface.dropTable('Narrators', { transaction });
  });
