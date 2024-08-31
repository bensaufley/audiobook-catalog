import {
  type BelongsToGetAssociationMixin,
  type CreationOptional,
  DataTypes,
  type InferAttributes,
  type InferCreationAttributes,
  Model,
  type Sequelize,
} from 'sequelize';

import type Audiobook from './Audiobook';
import type { InferJSONAttributes } from './types';
import type User from './User';

import type models from '.';

export default class UpNext extends Model<
  InferAttributes<UpNext, { omit: 'associations' }>,
  InferCreationAttributes<UpNext, { omit: 'associations' }>
> {
  public declare AudiobookId: string;

  public declare UserId: string;

  public declare order: CreationOptional<number>;

  public declare createdAt: CreationOptional<Date>;

  public declare updatedAt: CreationOptional<Date>;

  public declare getUser: BelongsToGetAssociationMixin<User>;

  public declare getAudiobook: BelongsToGetAssociationMixin<Audiobook>;

  public static associate(m: typeof models) {
    this.belongsTo(m.Audiobook);
    this.belongsTo(m.User);
  }

  public declare associations: {
    Audiobook: Audiobook;
    User: User;
  };

  public static generate(sequelize: Sequelize) {
    return this.init(
      {
        AudiobookId: {
          type: DataTypes.UUIDV4,
          primaryKey: true,
        },
        UserId: {
          type: DataTypes.UUIDV4,
          primaryKey: true,
        },
        order: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
      },
      {
        sequelize,
        name: {
          singular: 'UpNext',
          plural: 'UpNexts',
        },
        hooks: {
          async beforeValidate(upNext) {
            if (typeof upNext.dataValues.order === 'number') return;

            const maxOrder: number | undefined = await upNext.sequelize.models.UpNext!.max('order', {
              where: { UserId: upNext.UserId },
            });
            // eslint-disable-next-line no-param-reassign
            upNext.dataValues.order = (maxOrder || 0) + 1;
          },
        },
      },
    );
  }
}

export type UpNextJSON = InferJSONAttributes<UpNext>;
