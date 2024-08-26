import {
  type BelongsToManyGetAssociationsMixin,
  type CreationOptional,
  DataTypes,
  type HasManyGetAssociationsMixin,
  type InferAttributes,
  type InferCreationAttributes,
  Model,
  type Sequelize,
  UUIDV4,
} from 'sequelize';

import type Audiobook from './Audiobook';
import type AudiobookTag from './AudiobookTag';

import type models from '.';

export default class Tag extends Model<InferAttributes<Tag, { omit: 'associations' }>, InferCreationAttributes<Tag>> {
  public declare id: CreationOptional<string>;

  public declare name: string;

  public declare color: string;

  public declare createdAt: CreationOptional<Date>;

  public declare updatedAt: CreationOptional<Date>;

  public declare getAudiobookTags: HasManyGetAssociationsMixin<AudiobookTag>;

  public declare getAudiobooks: BelongsToManyGetAssociationsMixin<Audiobook>;

  static associate(m: typeof models) {
    this.hasMany(m.AudiobookTag);
    this.belongsToMany(m.Audiobook, { through: m.AudiobookTag });
  }

  public declare associations: {
    Audiobooks?: Audiobook[];
  };

  public static generate(sequelize: Sequelize) {
    return this.init(
      {
        id: {
          type: DataTypes.UUIDV4,
          primaryKey: true,
          defaultValue: UUIDV4,
          allowNull: false,
          autoIncrement: false,
        },
        name: {
          type: DataTypes.TEXT,
          allowNull: false,
          unique: true,
        },
        color: {
          type: DataTypes.TEXT,
          allowNull: false,
          unique: true,
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
      },
      {
        sequelize,
        modelName: 'Tag',
        hooks: {
          async beforeDestroy(tag) {
            await tag.sequelize.models.AudiobookTag?.destroy({ where: { TagId: tag.id } });
          },
        },
      },
    );
  }
}
