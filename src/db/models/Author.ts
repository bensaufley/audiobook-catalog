import {
  type BelongsToManyAssociation,
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
  Attribute,
  BelongsToMany,
  Default,
  HasMany,
  NotNull,
  PrimaryKey,
  Table,
} from '@sequelize/core/decorators-legacy';

import Audiobook from '~db/models/Audiobook';
import type { AuthorJSON } from '~shared/jsonModels';

import AudiobookAuthor from './AudiobookAuthor';

@Table({ modelName: 'Author' })
export default class Author
  extends Model<InferAttributes<Author>, InferCreationAttributes<Author>>
  implements AuthorJSON
{
  @Attribute(DataTypes.UUIDV4)
  @PrimaryKey
  @Default(sql.uuidV4)
  public declare id: CreationOptional<string>;

  @Attribute(DataTypes.TEXT)
  public declare firstName: string | null;

  @Attribute(DataTypes.TEXT)
  @NotNull
  public declare lastName: string;

  public declare readonly createdAt: CreationOptional<Date>;

  public declare readonly updatedAt: CreationOptional<Date>;

  @HasMany(() => AudiobookAuthor, 'AuthorId')
  public declare AudiobookAuthors?: NonAttribute<AudiobookAuthor[]>;

  @BelongsToMany(() => Audiobook, { through: () => AudiobookAuthor })
  public declare Audiobooks?: NonAttribute<Audiobook[]>;

  public declare static associations: {
    AudiobookAuthors: HasManyAssociation<Author, AudiobookAuthor>;
    Audiobooks: BelongsToManyAssociation<Author, Audiobook>;
  };
}
