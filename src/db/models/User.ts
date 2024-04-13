import { type Association, Model, type Optional, type Sequelize, STRING, UUID, UUIDV4 } from 'sequelize';

import type models from '~db/models';
import type Audiobook from '~db/models/Audiobook';
import type UserAudiobook from '~db/models/UserAudiobook';

export interface UserAttributes {
  id: string;
  username: string;
}

type UserCreationAttributes = Optional<UserAttributes, 'id'>;

export default class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public declare id: string;

  public declare username: string;

  public declare readonly createdAt: Date;

  public declare readonly updatedAt: Date;

  declare static associations: {
    Audiobooks: Association<User, Audiobook<unknown>>;
    UserAudiobooks: Association<User, UserAudiobook>;
  };

  public static associate(m: typeof models) {
    User.hasMany(m.UserAudiobook);
    User.belongsToMany(m.Audiobook, { through: m.UserAudiobook });
  }

  public static generate(sequelize: Sequelize) {
    return this.init(
      {
        id: {
          type: UUID,
          primaryKey: true,
          defaultValue: UUIDV4,
          allowNull: false,
          autoIncrement: false,
        },
        username: {
          type: STRING,
          allowNull: false,
          unique: true,
        },
      },
      {
        modelName: 'User',
        sequelize,
      },
    );
  }
}
