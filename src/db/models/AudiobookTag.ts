import {
  type Association,
  type CreationOptional,
  DataTypes,
  type InferAttributes,
  type InferCreationAttributes,
  Model,
  type Sequelize,
} from 'sequelize';

import type Audiobook from './Audiobook';
import type Tag from './Tag';

import type models from '.';

export default class AudiobookTag extends Model<InferAttributes<AudiobookTag>, InferCreationAttributes<AudiobookTag>> {
  public declare AudiobookId: string;

  public declare TagId: string;

  public declare createdAt: CreationOptional<Date>;

  public declare updatedAt: CreationOptional<Date>;

  public static associate(m: typeof models) {
    this.belongsTo(m.Audiobook);
    this.belongsTo(m.Tag);
  }

  public declare static readonly associations: {
    Audiobook: Association<Audiobook>;
    Tag: Association<Tag>;
  };

  public static generate(sequelize: Sequelize) {
    return this.init(
      {
        AudiobookId: {
          type: DataTypes.UUIDV4,
          primaryKey: true,
        },
        TagId: {
          type: DataTypes.UUIDV4,
          primaryKey: true,
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
      },
      {
        sequelize,
        modelName: 'AudiobookTag',
      },
    );
  }
}
