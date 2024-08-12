import type { Migration } from 'sequelize-cli';

/** @type {import('sequelize-cli').Migration} */
const migration: Migration = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Tags', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.UUIDV4,
      },
      name: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: true,
      },
      color: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.createTable('AudiobookTags', {
      AudiobookId: {
        type: Sequelize.UUIDV4,
        references: 'Audiobooks',
        primaryKey: true,
      },
      TagId: {
        type: Sequelize.UUIDV4,
        references: 'Tags',
        primaryKey: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('AudiobookTags');
    await queryInterface.dropTable('UserTags');
    await queryInterface.dropTable('Tags');
  },
};

export default migration;
