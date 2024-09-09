import { DATE, STRING, UUID } from 'sequelize';

import type { Migration } from '~db/migrations/index.js';

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.sequelize.transaction(async (transaction) => {
    let step = 'renameTable AudiobookAuthors';
    try {
      await queryInterface.renameTable('AudiobookAuthors', '_AudiobookAuthors', { transaction });
      step = 'createTable AudiobookAuthors';
      await queryInterface.createTable(
        'AudiobookAuthors',
        {
          AudiobookId: {
            type: STRING,
            references: { model: 'Audiobooks', key: 'id' },
            primaryKey: true,
            allowNull: false,
          },
          AuthorId: {
            type: STRING,
            references: { model: 'Authors', key: 'id' },
            primaryKey: true,
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
      step = 'transfer data AudiobookAuthors';
      await queryInterface.sequelize.query(
        'INSERT INTO AudiobookAuthors (AudiobookId, AuthorId, createdAt, updatedAt) SELECT AudiobookId, AuthorId, createdAt, updatedAt FROM _AudiobookAuthors;',
        { transaction, raw: true },
      );
      step = 'drop table _AudiobookAuthors';
      await queryInterface.dropTable('_AudiobookAuthors', { transaction });

      step = 'renameTable AudiobookNarrators';
      await queryInterface.renameTable('AudiobookNarrators', '_AudiobookNarrators', { transaction });
      step = 'createTable AudiobookNarrators';
      await queryInterface.createTable(
        'AudiobookNarrators',
        {
          AudiobookId: {
            type: STRING,
            references: { model: 'Audiobooks', key: 'id' },
            primaryKey: true,
            allowNull: false,
          },
          NarratorId: {
            type: STRING,
            references: { model: 'Narrators', key: 'id' },
            primaryKey: true,
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
      step = 'transfer data AudiobookNarrators';
      await queryInterface.sequelize.query(
        'INSERT INTO AudiobookNarrators (AudiobookId, NarratorId, createdAt, updatedAt) SELECT AudiobookId, NarratorId, createdAt, updatedAt FROM _AudiobookNarrators;',
        { transaction, raw: true },
      );
      step = 'drop table _AudiobookNarrators';
      await queryInterface.dropTable('_AudiobookNarrators', { transaction });
    } catch (err) {
      console.error(step, err, (err as Error).stack);
      throw err;
    }
  });
};

export const down: Migration = async ({ context: queryInterface }) =>
  queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.renameTable('AudiobookAuthors', '_AudiobookAuthors', { transaction });
    await queryInterface.createTable(
      'AudiobookAuthors',
      {
        id: {
          allowNull: false,
          autoIncrement: false,
          type: UUID,
          primaryKey: true,
        },
        AudiobookId: {
          type: STRING,
          references: 'Audiobooks',
          primaryKey: true,
          allowNull: false,
        },
        AuthorId: {
          type: STRING,
          references: 'Authors',
          primaryKey: true,
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
    await queryInterface.sequelize.query(
      'INSERT INTO AudiobookAuthors (AudiobookId, AuthorId, createdAt, updatedAt) SELECT (AudiobookId, AuthorId, createdAt, updatedAt) FROM _AudiobookAuthors;',
      { transaction, raw: true },
    );
    await queryInterface.dropTable('_AudiobookAuthors', { transaction });

    await queryInterface.renameTable('AudiobookNarrators', '_AudiobookNarrators', { transaction });
    await queryInterface.createTable(
      'AudiobookNarrators',
      {
        id: {
          allowNull: false,
          autoIncrement: false,
          type: UUID,
          primaryKey: true,
        },
        AudiobookId: {
          type: STRING,
          references: 'Audiobooks',
          primaryKey: true,
          allowNull: false,
        },
        NarratorId: {
          type: STRING,
          references: 'Narrators',
          primaryKey: true,
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
    await queryInterface.sequelize.query(
      'INSERT INTO AudiobookNarrators (AudiobookId, NarratorId, createdAt, updatedAt) SELECT (AudiobookId, NarratorId, createdAt, updatedAt) FROM _AudiobookNarrators;',
      { transaction, raw: true },
    );
    await queryInterface.dropTable('_AudiobookNarrators', { transaction });
  });
