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
import type { NarratorJSON } from '~shared/jsonModels';

import AudiobookNarrator from './AudiobookNarrator';

@Table({ modelName: 'Narrator' })
export default class Narrator
  extends Model<InferAttributes<Narrator>, InferCreationAttributes<Narrator>>
  implements NarratorJSON
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

  @HasMany(() => AudiobookNarrator, 'NarratorId')
  public declare AudiobookNarrators?: NonAttribute<AudiobookNarrator[]>;

  @BelongsToMany(() => Audiobook, { through: () => AudiobookNarrator })
  public declare Audiobooks?: NonAttribute<Audiobook[]>;

  public declare static associations: {
    AudiobookNarrators: HasManyAssociation<Narrator, AudiobookNarrator>;
    Audiobooks: BelongsToManyAssociation<Narrator, Audiobook>;
  };
}
