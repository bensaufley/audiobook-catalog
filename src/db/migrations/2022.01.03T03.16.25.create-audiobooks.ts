import { BLOB, DATE, FLOAT, INTEGER, NUMBER, STRING } from 'sequelize';
import type { Migration } from '~db/migrations';

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.createTable('Audiobooks', {
    id: {
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
      type: STRING,
    },
    title: {
      type: STRING,
      allowNull: false,
    },
    filepath: {
      type: STRING,
      allowNull: false,
      unique: true,
    },
    cover: {
      type: BLOB,
    },
    coverType: {
      type: STRING,
    },
    duration: {
      type: FLOAT,
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
};

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.dropTable('Audiobooks');
};
