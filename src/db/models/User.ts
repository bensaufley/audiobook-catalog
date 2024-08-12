import {
  type Association,
  type CreationOptional,
  DATE,
  type InferAttributes,
  type InferCreationAttributes,
  Model,
  type Sequelize,
  STRING,
  UUID,
  UUIDV4,
} from 'sequelize';

import type models from '~db/models';
import type Audiobook from '~db/models/Audiobook';
import type UserAudiobook from '~db/models/UserAudiobook';

export default class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  public declare id: CreationOptional<string>;

  public declare username: string;

  public declare readonly createdAt: CreationOptional<Date>;

  public declare readonly updatedAt: CreationOptional<Date>;

  declare static associations: {
    Audiobooks: Association<User, Audiobook>;
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
        createdAt: DATE,
        updatedAt: DATE,
      },
      {
        modelName: 'User',
        sequelize,
      },
    );
  }
}

export type UserAttributes = InferAttributes<User>;
