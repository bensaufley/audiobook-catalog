import { DataTypes } from '@sequelize/core';

import type { Migration } from '~db/migrations';

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
            type: DataTypes.TEXT,
            references: { table: 'Audiobooks', key: 'id' },
            primaryKey: true,
            allowNull: false,
          },
          AuthorId: {
            type: DataTypes.TEXT,
            references: { table: 'Authors', key: 'id' },
            primaryKey: true,
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
            type: DataTypes.TEXT,
            references: { table: 'Audiobooks', key: 'id' },
            primaryKey: true,
            allowNull: false,
          },
          NarratorId: {
            type: DataTypes.TEXT,
            references: { table: 'Narrators', key: 'id' },
            primaryKey: true,
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
      step = 'transfer data AudiobookNarrators';
      await queryInterface.sequelize.query(
        'INSERT INTO AudiobookNarrators (AudiobookId, NarratorId, createdAt, updatedAt) SELECT AudiobookId, NarratorId, createdAt, updatedAt FROM _AudiobookNarrators;',
        { transaction, raw: true },
      );
      step = 'drop table _AudiobookNarrators';
      await queryInterface.dropTable('_AudiobookNarrators', { transaction });
    } catch (err) {
      console.log(step, err, (err as Error).stack);
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
          type: DataTypes.UUIDV4,
          primaryKey: true,
        },
        AudiobookId: {
          type: DataTypes.TEXT,
          references: 'Audiobooks',
          primaryKey: true,
          allowNull: false,
        },
        AuthorId: {
          type: DataTypes.TEXT,
          references: 'Authors',
          primaryKey: true,
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
          type: DataTypes.UUIDV4,
          primaryKey: true,
        },
        AudiobookId: {
          type: DataTypes.TEXT,
          references: 'Audiobooks',
          primaryKey: true,
          allowNull: false,
        },
        NarratorId: {
          type: DataTypes.TEXT,
          references: 'Narrators',
          primaryKey: true,
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
    await queryInterface.sequelize.query(
      'INSERT INTO AudiobookNarrators (AudiobookId, NarratorId, createdAt, updatedAt) SELECT (AudiobookId, NarratorId, createdAt, updatedAt) FROM _AudiobookNarrators;',
      { transaction, raw: true },
    );
    await queryInterface.dropTable('_AudiobookNarrators', { transaction });
  });
