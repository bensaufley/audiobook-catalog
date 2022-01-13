import { DATE, STRING } from 'sequelize';
import type { Migration } from '~db/migrations';

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.createTable('Narrators', {
    id: {
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
      type: STRING,
    },
    firstName: {
      type: STRING,
    },
    lastName: {
      type: STRING,
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
  });

  await queryInterface.createTable('AudiobookNarrators', {
    id: {
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
      type: STRING,
    },
    NarratorId: {
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
  });

  await queryInterface.addConstraint('AudiobookNarrators', {
    fields: ['NarratorId'],
    name: 'audiobookNarratorNarratorReference',
    type: 'foreign key',
    references: {
      table: 'Narrators',
      field: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  await queryInterface.addConstraint('AudiobookNarrators', {
    fields: ['AudiobookId'],
    name: 'audiobookNarratorsAudiobookReference',
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
  await queryInterface.removeConstraint('AudiobookNarrators', 'audiobookNarratorsNarratorReference');
  await queryInterface.removeConstraint('AudiobookNarrators', 'audiobookNarratorsAudiobookReference');
  await queryInterface.dropTable('AudiobookNarrators');
  await queryInterface.dropTable('Narrators');
};
