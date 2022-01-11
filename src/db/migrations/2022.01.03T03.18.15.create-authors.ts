import { DATE, INTEGER, STRING } from 'sequelize';
import type { Migration } from '~db/migrations';

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.createTable('Authors', {
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
};

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.dropTable('Authors');
};
