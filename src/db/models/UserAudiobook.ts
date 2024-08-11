import {
  type BelongsToAssociation,
  type CreationOptional,
  DataTypes,
  type InferAttributes,
  type InferCreationAttributes,
  Model,
} from '@sequelize/core';
import { Attribute, BelongsTo, Default, NotNull, Table } from '@sequelize/core/decorators-legacy';

import Audiobook from '~db/models/Audiobook';
import User from '~db/models/User';
import type { UserAudiobookJSON } from '~shared/jsonModels';

@Table({ modelName: 'UserAudiobook' })
export default class UserAudiobook
  extends Model<InferAttributes<UserAudiobook>, InferCreationAttributes<UserAudiobook>>
  implements UserAudiobookJSON
{
  @Attribute(DataTypes.BOOLEAN)
  @NotNull
  @Default(false)
  public declare read: CreationOptional<boolean>;

  @Attribute(DataTypes.UUIDV4)
  @NotNull
  public declare AudiobookId: string;

  @Attribute(DataTypes.UUIDV4)
  @NotNull
  public declare UserId: string;

  public declare readonly createdAt: CreationOptional<Date>;

  public declare readonly updatedAt: CreationOptional<Date>;

  @BelongsTo(() => Audiobook, 'AudiobookId')
  public declare Audiobook: Audiobook;

  @BelongsTo(() => User, 'UserId')
  public declare User: User;

  public declare static associations: {
    Audiobook: BelongsToAssociation<UserAudiobook, Audiobook>;
    User: BelongsToAssociation<UserAudiobook, User>;
  };
}
