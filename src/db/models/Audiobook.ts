import {
  type Association,
  type BelongsToManyAddAssociationMixin,
  type BelongsToManyGetAssociationsMixin,
  BLOB,
  FLOAT,
  type HasManyGetAssociationsMixin,
  type InferAttributes,
  Model,
  type Optional,
  type Sequelize,
  STRING,
  UUID,
  UUIDV4,
} from 'sequelize';

import type models from '~db/models';
import type Author from '~db/models/Author';
import type { AuthorAttributes } from '~db/models/Author';
import type Narrator from '~db/models/Narrator';
import type { NarratorAttributes } from '~db/models/Narrator';
import type User from '~db/models/User';
import type UserAudiobook from '~db/models/UserAudiobook';
import type { UserAudiobookJSON } from '~db/models/UserAudiobook';

import type AudiobookAuthor from './AudiobookAuthor';
import type AudiobookNarrator from './AudiobookNarrator';
import type AudiobookTag from './AudiobookTag';
import type Tag from './Tag';
import type { InferJSONAttributes } from './types';
import type UpNext from './UpNext';

interface NullCoverProps {
  cover: null;
  coverType: null;
}

interface CoverProps {
  cover: Buffer;
  coverType: string;
}

export type AudiobookAttributes<HasCover extends boolean = boolean> = {
  id: string;
  title: string;
  filepath: string;
  duration: number | null;
} & (HasCover extends true ? CoverProps : HasCover extends false ? NullCoverProps : CoverProps | NullCoverProps);

type AudiobookCreationAttributes = Optional<AudiobookAttributes<boolean>, 'id'>;

export default class Audiobook<HasCover extends boolean = boolean> extends Model<
  AudiobookAttributes<HasCover>,
  AudiobookCreationAttributes
> {
  declare static associations: {
    Authors: Association<Audiobook, Author>;
    Narrators: Association<Audiobook, Narrator>;
    UserAudiobooks: Association<Audiobook, UserAudiobook>;
    Users: Association<Audiobook, User>;
    UpNexts: Association<Audiobook, UpNext>;
    UserUpNexts: Association<Audiobook, User>;
  };

  public declare id: string;

  public declare title: string;

  public declare filepath: string;

  public declare cover: HasCover extends false ? null : HasCover extends true ? Buffer : Buffer | null;

  public declare coverType: HasCover extends false ? null : HasCover extends true ? string : string | null;

  public declare duration: number | null;

  public declare readonly createdAt: Date;

  public declare readonly updatedAt: Date;

  public declare Authors?: Author[];

  public declare Narrators?: Narrator[];

  public declare Users?: User[];

  public declare UserAudiobooks?: UserAudiobook[];

  public declare addAuthor: BelongsToManyAddAssociationMixin<Author, AuthorAttributes>;

  public declare addNarrator: BelongsToManyAddAssociationMixin<Narrator, NarratorAttributes>;

  public declare addTag: BelongsToManyAddAssociationMixin<Tag, InferAttributes<Tag>>;

  public declare getAudiobookAuthors: HasManyGetAssociationsMixin<AudiobookAuthor>;

  public declare getAudiobookNarrators: HasManyGetAssociationsMixin<AudiobookNarrator>;

  public declare getAudiobookTags: HasManyGetAssociationsMixin<AudiobookTag>;

  public declare getAuthors: BelongsToManyGetAssociationsMixin<Author>;

  public declare getNarrators: BelongsToManyGetAssociationsMixin<Author>;

  public declare getTags: BelongsToManyGetAssociationsMixin<Tag>;

  public static associate(m: typeof models) {
    this.hasMany(m.AudiobookAuthor);
    this.belongsToMany(m.Author, { through: m.AudiobookAuthor });
    this.hasMany(m.AudiobookNarrator);
    this.belongsToMany(m.Narrator, { through: m.AudiobookNarrator });
    this.hasMany(m.UserAudiobook);
    this.belongsToMany(m.User, { through: m.UserAudiobook });
    this.hasMany(m.AudiobookTag);
    this.belongsToMany(m.Tag, { through: m.AudiobookTag });
    this.hasMany(m.UpNext, { as: { singular: 'UpNext', plural: 'UpNexts' } });
    this.belongsToMany(m.User, { as: { singular: 'UserUpNext', plural: 'UserUpNexts' }, through: m.UpNext });
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
        title: {
          type: STRING,
          allowNull: false,
        },
        filepath: {
          type: STRING,
          allowNull: false,
        },
        cover: {
          type: BLOB,
        },
        coverType: {
          type: STRING,
        },
        duration: {
          type: FLOAT,
        },
      },
      {
        modelName: 'Audiobook',
        sequelize,
        hooks: {
          async beforeDestroy(audiobook) {
            await audiobook.sequelize.models.AudiobookAuthor?.destroy({ where: { AudiobookId: audiobook.id } });
            await audiobook.sequelize.models.AudiobookNarrator?.destroy({ where: { AudiobookId: audiobook.id } });
            await audiobook.sequelize.models.AudiobookTag?.destroy({ where: { AudiobookId: audiobook.id } });
          },
        },
      },
    );
  }
}

export interface AudiobookJSON<HasCover extends boolean = boolean>
  extends Omit<Audiobook<HasCover>, 'createdAt' | 'updatedAt' | 'UserAudiobooks'> {
  createdAt: string;
  updatedAt: string;
  UserAudiobooks?: UserAudiobookJSON[];
  UpNexts?: InferJSONAttributes<UpNext>[];
}
