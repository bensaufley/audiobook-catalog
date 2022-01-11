import { Model, Sequelize, STRING, UUID, UUIDV4 } from 'sequelize';
import { models } from '~db/models';

export default class Author extends Model {
  public declare id: string;
  public declare firstName?: string;
  public declare lastName: string;

  public static associate(m: typeof models) {
    Author.belongsToMany(m.Audiobook, {
      through: m.AudiobookAuthor,
    });
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
        sequelize,
      },
    );
  }
}
