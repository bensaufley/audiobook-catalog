import { BOOLEAN, DATE, STRING } from 'sequelize';
import type { Migration } from '~db/migrations';

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.createTable('Users', {
    id: {
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
      type: STRING,
    },
    username: {
      type: STRING,
      allowNull: false,
      unique: true,
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

  await queryInterface.createTable('UserAudiobooks', {
    UserId: {
      allowNull: false,
      primaryKey: true,
      type: STRING,
    },
    AudiobookId: {
      allowNull: false,
      primaryKey: true,
      type: STRING,
    },
    read: {
      allowNull: false,
      type: BOOLEAN,
      defaultValue: false,
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

  await queryInterface.addConstraint('UserAudiobooks', {
    fields: ['UserId'],
    name: 'userAudiobookUserReference',
    type: 'foreign key',
    references: {
      table: 'Users',
      field: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  await queryInterface.addConstraint('UserAudiobooks', {
    fields: ['AudiobookId'],
    name: 'userAudiobooksAudiobookReference',
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
  await queryInterface.removeConstraint('UserAudiobooks', 'userAudiobooksUserReference');
  await queryInterface.removeConstraint('UserAudiobooks', 'userAudiobooksAudiobookReference');
  await queryInterface.dropTable('UserAudiobooks');
  await queryInterface.dropTable('Users');
};
