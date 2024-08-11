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
import Narrator from '~db/models/Narrator';
import type { AudiobookNarratorJSON } from '~shared/jsonModels';

@Table({ modelName: 'AudiobookNarrator' })
export default class AudiobookNarrator
  extends Model<InferAttributes<AudiobookNarrator>, InferCreationAttributes<AudiobookNarrator>>
  implements AudiobookNarratorJSON
{
  @Attribute(DataTypes.UUIDV4)
  @NotNull
  public declare AudiobookId: string;

  @Attribute(DataTypes.UUIDV4)
  @NotNull
  public declare NarratorId: string;

  @BelongsTo(() => Audiobook, 'AudiobookId')
  public declare Audiobook: Audiobook;

  @BelongsTo(() => Narrator, 'NarratorId')
  public declare Narrator: Narrator;

  public declare readonly createdAt: CreationOptional<Date>;

  public declare readonly updatedAt: CreationOptional<Date>;

  public declare static associations: {
    Audiobook: BelongsToAssociation<AudiobookNarrator, Audiobook>;
    Narrator: BelongsToAssociation<AudiobookNarrator, Narrator>;
  };
}
