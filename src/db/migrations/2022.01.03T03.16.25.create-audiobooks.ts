import { BLOB, DATE, FLOAT, STRING } from 'sequelize';
import type { Migration } from '~db/migrations';

export const up: Migration = async ({ context: queryInterface }) =>
  queryInterface.sequelize.transaction(async (transaction) => {
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
    }, { transaction });
  });

export const down: Migration = async ({ context: queryInterface }) => queryInterface.sequelize.transaction(async (transaction) => {
  await queryInterface.dropTable('Audiobooks', { transaction });
});
