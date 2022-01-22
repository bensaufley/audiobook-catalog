import { Association, BOOLEAN, Model, Optional, Sequelize, STRING, UUID, UUIDV4 } from 'sequelize';
import type models from '~db/models';
import type Audiobook from '~db/models/Audiobook';
import type User from '~db/models/User';

export interface UserAudiobookAttributes {
  id: string;
  read: boolean;

  audiobookId: string;
  userId: string;
}

type UserAudiobookCreationAttributes = Optional<UserAudiobookAttributes, 'id'>;

export default class UserAudiobook
  extends Model<UserAudiobookAttributes, UserAudiobookCreationAttributes>
  implements UserAudiobookAttributes
{
  public declare id: string;
  public declare read: boolean;

  public declare audiobookId: string;
  public declare userId: string;

  public declare readonly createdAt: Date;
  public declare readonly updatedAt: Date;

  public declare Audiobook: Audiobook<unknown>;
  public declare User: User;

  declare static associations: {
    Audiobook: Association<UserAudiobook, Audiobook<unknown>>;
    User: Association<UserAudiobook, User>;
  };

  public static associate(m: typeof models) {
    this.belongsTo(m.Audiobook);
    this.belongsTo(m.User);
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
        read: {
          type: BOOLEAN,
          defaultValue: false,
          allowNull: false,
        },
        audiobookId: {
          type: STRING,
          allowNull: false,
          references: 'Audiobooks',
        },
        userId: {
          type: STRING,
          allowNull: false,
          references: 'Users',
        },
      },
      {
        modelName: 'UserAudiobook',
        sequelize,
      },
    );
  }
}
