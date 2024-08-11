import {
  type BelongsToAssociation,
  type CreationOptional,
  DataTypes,
  type InferAttributes,
  type InferCreationAttributes,
  Model,
} from '@sequelize/core';
import { Attribute, BelongsTo, NotNull, Table } from '@sequelize/core/decorators-legacy';

import Audiobook from '~db/models/Audiobook';
import type { AudiobookAuthorJSON } from '~shared/jsonModels';

import Author from './Author';

@Table({ modelName: 'AudiobookAuthor' })
export default class AudiobookAuthor
  extends Model<InferAttributes<AudiobookAuthor>, InferCreationAttributes<AudiobookAuthor>>
  implements AudiobookAuthorJSON
{
  @Attribute(DataTypes.UUIDV4)
  @NotNull
  public declare AudiobookId: string;

  @Attribute(DataTypes.UUIDV4)
  @NotNull
  public declare AuthorId: string;

  public declare readonly createdAt: CreationOptional<Date>;

  public declare readonly updatedAt: CreationOptional<Date>;

  @BelongsTo(() => Audiobook, 'AudiobookId')
  public declare Audiobook: Audiobook;

  @BelongsTo(() => Author, 'AuthorId')
  public declare Author: Author;

  public declare static associations: {
    Audiobook: BelongsToAssociation<AudiobookAuthor, Audiobook>;
    Author: BelongsToAssociation<AudiobookAuthor, Author>;
  };
}
