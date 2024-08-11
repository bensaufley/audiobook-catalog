import {
  type BelongsToAssociation,
  type BelongsToManyAddAssociationMixin,
  type CreationOptional,
  DataTypes,
  type HasManyAssociation,
  type InferAttributes,
  type InferCreationAttributes,
  Model,
  type NonAttribute,
  sql,
} from '@sequelize/core';
import {
  AllowNull,
  Attribute,
  BelongsToMany,
  Default,
  HasMany,
  NotNull,
  PrimaryKey,
  Table,
} from '@sequelize/core/decorators-legacy';

import Author from '~db/models/Author';
import Narrator from '~db/models/Narrator';
import User from '~db/models/User';
import UserAudiobook from '~db/models/UserAudiobook';
import type { AudiobookJSON } from '~shared/jsonModels';

import AudiobookAuthor from './AudiobookAuthor';
import AudiobookNarrator from './AudiobookNarrator';

@Table({ modelName: 'Audiobook' })
export default class Audiobook<HasCover extends boolean = boolean>
  extends Model<InferAttributes<Audiobook<HasCover>>, InferCreationAttributes<Audiobook<HasCover>>>
  implements AudiobookJSON
{
  @Attribute(DataTypes.UUIDV4)
  @PrimaryKey
  @Default(sql.uuidV4)
  public declare id: CreationOptional<string>;

  @Attribute(DataTypes.TEXT)
  @NotNull
  public declare title: string;

  @Attribute(DataTypes.TEXT)
  @NotNull
  public declare filepath: string;

  @Attribute(DataTypes.BLOB)
  public declare cover: HasCover extends false ? null : HasCover extends true ? Buffer : Buffer | null;

  @Attribute(DataTypes.TEXT)
  @AllowNull
  public declare coverType: HasCover extends false ? null : HasCover extends true ? string : string | null;

  @Attribute(DataTypes.REAL)
  @AllowNull
  public declare duration: number | null;

  public declare readonly createdAt: CreationOptional<Date>;

  public declare readonly updatedAt: CreationOptional<Date>;

  @HasMany(() => AudiobookAuthor, 'AudiobookId')
  public declare AudiobookAuthors?: NonAttribute<AudiobookAuthor[]>;

  @HasMany(() => AudiobookNarrator, 'AudiobookId')
  public declare AudiobookNarrators?: NonAttribute<AudiobookNarrator[]>;

  @HasMany(() => UserAudiobook, 'AudiobookId')
  public declare UserAudiobooks?: NonAttribute<UserAudiobook[]>;

  @BelongsToMany(() => Author, { through: () => AudiobookAuthor })
  public declare Authors?: NonAttribute<Author[]>;

  @BelongsToMany(() => Narrator, { through: () => AudiobookNarrator })
  public declare Narrators?: NonAttribute<Narrator[]>;

  @BelongsToMany(() => User, { through: () => UserAudiobook })
  public declare Users?: NonAttribute<User[]>;

  public declare addAuthor: BelongsToManyAddAssociationMixin<Author, Author['id']>;

  public declare addNarrator: BelongsToManyAddAssociationMixin<Narrator, Narrator['id']>;

  public declare static associations: {
    AudiobookAuthors: HasManyAssociation<Audiobook, AudiobookAuthor>;
    AudiobookNarrators: HasManyAssociation<Audiobook, AudiobookNarrator>;
    UserAudiobooks: HasManyAssociation<Audiobook, UserAudiobook>;
    Authors: BelongsToAssociation<Audiobook, Author>;
    Narrators: BelongsToAssociation<Audiobook, Narrator>;
    Users: BelongsToAssociation<Audiobook, User>;
  };
}
