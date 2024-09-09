import { type Association, BOOLEAN, Model, type Sequelize, STRING } from 'sequelize';

import type Audiobook from '~db/models/Audiobook.js';
import type models from '~db/models/index.js';
import type User from '~db/models/User.js';

export interface UserAudiobookAttributes {
  read: boolean;

  AudiobookId: string;
  UserId: string;
}

type UserAudiobookCreationAttributes = Partial<UserAudiobookAttributes>;

export default class UserAudiobook
  extends Model<UserAudiobookAttributes, UserAudiobookCreationAttributes>
  implements UserAudiobookAttributes
{
  public declare read: boolean;

  public declare AudiobookId: string;

  public declare UserId: string;

  public declare readonly createdAt: Date;

  public declare readonly updatedAt: Date;

  public declare Audiobook: Audiobook;

  public declare User: User;

  declare static associations: {
    Audiobook: Association<UserAudiobook, Audiobook>;
    User: Association<UserAudiobook, User>;
  };

  public static associate(m: typeof models) {
    this.belongsTo(m.Audiobook);
    this.belongsTo(m.User);
  }

  public static generate(sequelize: Sequelize) {
    return this.init(
      {
        read: {
          type: BOOLEAN,
          defaultValue: false,
          allowNull: false,
        },
        AudiobookId: {
          type: STRING,
          allowNull: false,
          references: 'Audiobooks',
        },
        UserId: {
          type: STRING,
          allowNull: false,
          references: 'Users',
        },
      },
      {
        modelName: 'UserAudiobook',
        sequelize,
      },
    );
  }
}

export type UserAudiobookJSON = Pick<UserAudiobook, 'read' | 'UserId' | 'AudiobookId'> & {
  createdAt: string;
  updatedAt: string;
};
