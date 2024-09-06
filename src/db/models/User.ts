import {
  type Association,
  type CreationOptional,
  DATE,
  type HasManyAddAssociationMixin,
  type HasManyGetAssociationsMixin,
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

import type UpNext from './UpNext';

export default class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  public declare id: CreationOptional<string>;

  public declare username: string;

  public declare readonly createdAt: CreationOptional<Date>;

  public declare readonly updatedAt: CreationOptional<Date>;

  public declare addUpNext: HasManyAddAssociationMixin<UpNext, string>;

  public declare getUpNexts: HasManyGetAssociationsMixin<UpNext>;

  declare static associations: {
    Audiobooks: Association<User, Audiobook>;
    UserAudiobooks: Association<User, UserAudiobook>;
    UpNexts: Association<User, UpNext>;
    UpNextBooks: Association<User, Audiobook>;
  };

  public static associate(m: typeof models) {
    User.hasMany(m.UserAudiobook);
    User.belongsToMany(m.Audiobook, { through: m.UserAudiobook });
    User.hasMany(m.UpNext, { as: { singular: 'UpNext', plural: 'UpNexts' } });
    User.belongsToMany(m.Audiobook, { as: 'UpNextBook', through: m.UpNext });
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
        hooks: {
          async beforeDestroy(user) {
            await user.sequelize.models.UserAudiobook?.destroy({ where: { UserId: user.id } });
            await user.sequelize.models.UpNext?.destroy({ where: { UserId: user.id } });
          },
        },
      },
    );
  }
}

export type UserAttributes = InferAttributes<User>;
