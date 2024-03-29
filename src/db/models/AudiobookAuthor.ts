import { Association, Model, Optional, Sequelize, STRING, UUID, UUIDV4 } from 'sequelize';
import type models from '~db/models';
import type Audiobook from '~db/models/Audiobook';
import type Author from '~db/models/Author';

export interface AudiobookAuthorAttributes {
  AudiobookId: string;
  AuthorId: string;
}

type AudiobookAuthorCreationAttributes = Partial<AudiobookAuthorAttributes>;

export default class AudiobookAuthor
  extends Model<AudiobookAuthorAttributes, AudiobookAuthorCreationAttributes>
  implements AudiobookAuthorAttributes
{
  public declare AudiobookId: string;
  public declare AuthorId: string;

  public declare readonly createdAt: Date;
  public declare readonly updatedAt: Date;

  declare static associations: {
    Audiobook: Association<AudiobookAuthor, Audiobook<unknown>>;
    Author: Association<AudiobookAuthor, Author>;
  };

  public static associate(m: typeof models) {
    this.belongsTo(m.Audiobook);
    this.belongsTo(m.Author);
  }

  public static generate(sequelize: Sequelize) {
    return this.init(
      {
        AudiobookId: {
          type: STRING,
          allowNull: false,
          references: 'Audiobooks',
        },
        AuthorId: {
          type: STRING,
          allowNull: false,
          references: 'Users',
        },
      },
      {
        modelName: 'AudiobookAuthor',
        sequelize,
      },
    );
  }
}
