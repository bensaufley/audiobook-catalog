import { DATE, INTEGER, STRING, UUID } from 'sequelize';
import type { Migration } from '~db/migrations';

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.createTable('AudiobookAuthors', {
    id: {
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
      type: STRING,
    },
    AuthorId: {
      primaryKey: true,
      type: STRING,
    },
    AudiobookId: {
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
  });

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
  });
};

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.removeConstraint(
    'AudiobookAuthors',
    'audiobookAuthorsAuthorReference',
  );
  await queryInterface.removeConstraint(
    'AudiobookAuthors',
    'audiobookAuthorsAudiobookReference',
  );
  await queryInterface.dropTable('AudiobookAuthors');
};
