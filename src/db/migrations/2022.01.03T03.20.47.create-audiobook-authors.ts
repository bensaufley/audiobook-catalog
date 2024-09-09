import { DATE, STRING } from 'sequelize';

import type { Migration } from '~db/migrations/index.js';

export const up: Migration = async ({ context: queryInterface }) =>
  queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.createTable(
      'AudiobookAuthors',
      {
        id: {
          allowNull: false,
          autoIncrement: false,
          primaryKey: true,
          type: STRING,
        },
        AuthorId: {
          allowNull: false,
          primaryKey: true,
          type: STRING,
        },
        AudiobookId: {
          allowNull: false,
          primaryKey: true,
          type: STRING,
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

    await queryInterface.addConstraint('AudiobookAuthors', {
      fields: ['AuthorId'],
      name: 'audiobookAuthorsAuthorReference',
      type: 'foreign key',
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
      type: 'foreign key',
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
