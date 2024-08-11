import { DataTypes } from '@sequelize/core';

import type { Migration } from '~db/migrations';

export const up: Migration = async ({ context: queryInterface }) =>
  queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.createTable(
      'AudiobookAuthors',
      {
        id: {
          allowNull: false,
          autoIncrement: false,
          primaryKey: true,
          type: DataTypes.TEXT,
        },
        AuthorId: {
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

    await queryInterface.addConstraint('AudiobookAuthors', {
      fields: ['AuthorId'],
      name: 'audiobookAuthorsAuthorReference',
      type: 'FOREIGN KEY',
      references: {
        table: 'Authors',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      transaction,
    });

    await queryInterface.addConstraint('AudiobookAuthors', {
      fields: ['AudiobookId'],
      name: 'audiobookAuthorsAudiobookReference',
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
    await queryInterface.removeConstraint('AudiobookAuthors', 'audiobookAuthorsAuthorReference', { transaction });
    await queryInterface.removeConstraint('AudiobookAuthors', 'audiobookAuthorsAudiobookReference', { transaction });
    await queryInterface.dropTable('AudiobookAuthors', { transaction });
  });
