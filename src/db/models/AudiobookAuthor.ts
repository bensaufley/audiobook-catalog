import { Association, Model, Optional, Sequelize, UUID, UUIDV4 } from 'sequelize';
import type models from '~db/models';
import type Audiobook from '~db/models/Audiobook';
import type Author from '~db/models/Author';

export interface AudiobookAuthorAttributes {
  id: string;
}

type AudiobookAuthorCreationAttributes = Optional<AudiobookAuthorAttributes, 'id'>;

export default class AudiobookAuthor
  extends Model<AudiobookAuthorAttributes, AudiobookAuthorCreationAttributes>
  implements AudiobookAuthorAttributes
{
  public declare id: string;

  public declare readonly createdAt: Date;
  public declare readonly updatedAt: Date;

  declare static associations: {
    audiobook: Association<AudiobookAuthor, Audiobook<unknown>>;
    author: Association<AudiobookAuthor, Author>;
  };

  public static associate(m: typeof models) {
    this.belongsTo(m.Audiobook);
    this.belongsTo(m.Author);
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
      },
      {
        modelName: 'AudiobookAuthor',
        sequelize,
      },
    );
  }
}
