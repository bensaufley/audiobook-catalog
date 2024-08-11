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
import UserAudiobook from '~db/models/UserAudiobook';
import type { UserJSON } from '~shared/jsonModels';

@Table({ modelName: 'User' })
export default class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> implements UserJSON {
  @Attribute(DataTypes.UUIDV4)
  @PrimaryKey
  @Default(sql.uuidV4)
  public declare id: CreationOptional<string>;

  @Attribute(DataTypes.TEXT)
  @NotNull
  public declare username: string;

  public declare readonly createdAt: CreationOptional<Date>;

  public declare readonly updatedAt: CreationOptional<Date>;

  @HasMany(() => UserAudiobook, 'UserId')
  public declare UserAudiobooks?: NonAttribute<UserAudiobook[]>;

  @BelongsToMany(() => Audiobook, { through: () => UserAudiobook })
  public declare Audiobooks?: NonAttribute<Audiobook[]>;

  public declare static associations: {
    Audiobooks: BelongsToManyAssociation<User, Audiobook>;
    UserAudiobooks: HasManyAssociation<User, UserAudiobook>;
  };
}
