import {
  type Association,
  type BelongsToManyAddAssociationMixin,
  type BelongsToManyAddAssociationsMixin,
  type BelongsToManyGetAssociationsMixin,
  type BelongsToManyRemoveAssociationMixin,
  type CreationOptional,
  DataTypes,
  type HasManyAddAssociationMixin,
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

export default class Tag extends Model<InferAttributes<Tag>, InferCreationAttributes<Tag>> {
  public declare id: CreationOptional<string>;

  public declare name: string;

  public declare color: string;

  public declare createdAt: CreationOptional<Date>;

  public declare updatedAt: CreationOptional<Date>;

  public declare addAudiobook: BelongsToManyAddAssociationMixin<Audiobook, Audiobook['id']>;

  public declare addAudiobooks: BelongsToManyAddAssociationsMixin<Audiobook, Audiobook['id']>;

  public declare removeAudiobook: BelongsToManyRemoveAssociationMixin<Audiobook, Audiobook['id']>;

  public declare addAudiobookTag: HasManyAddAssociationMixin<AudiobookTag, AudiobookTag['AudiobookId']>;

  public declare getAudiobookTags: HasManyGetAssociationsMixin<AudiobookTag>;

  public declare getAudiobooks: BelongsToManyGetAssociationsMixin<Audiobook>;

  static associate(m: typeof models) {
    this.hasMany(m.AudiobookTag);
    this.belongsToMany(m.Audiobook, { through: m.AudiobookTag });
  }

  public declare static readonly associations: {
    Audiobooks: Association<Audiobook>;
    AudiobookTags: Association<AudiobookTag>;
  };

  public declare Audiobooks?: Audiobook[];

  public declare AudiobookTags?: AudiobookTag[];

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

export type TagJSON = InferAttributes<Tag>;
