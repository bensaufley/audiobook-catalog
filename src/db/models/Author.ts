import { type Association, Model, type Optional, type Sequelize, STRING, UUID, UUIDV4 } from 'sequelize';

import type Audiobook from '~db/models/Audiobook.js';
import type models from '~db/models/index.js';

export interface AuthorAttributes {
  id: string;
  firstName: string | null;
  lastName: string;
}

type AuthorCreationAttributes = Optional<AuthorAttributes, 'id'>;

export default class Author extends Model<AuthorAttributes, AuthorCreationAttributes> implements AuthorAttributes {
  public declare id: string;

  public declare firstName: string | null;

  public declare lastName: string;

  public declare readonly createdAt: Date;

  public declare readonly updatedAt: Date;

  declare static associations: {
    Audiobooks: Association<Author, Audiobook>;
  };

  public static associate(m: typeof models) {
    Author.belongsToMany(m.Audiobook, { through: m.AudiobookAuthor });
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
        firstName: {
          type: STRING,
        },
        lastName: {
          type: STRING,
          allowNull: false,
        },
      },
      {
        modelName: 'Author',
        sequelize,
      },
    );
  }
}
