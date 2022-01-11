import { BLOB, Model, Sequelize, STRING, UUID, UUIDV4 } from 'sequelize';
import type { models } from '~db/models';

export class Audiobook extends Model {
  public declare id: string;
  public declare title: string;
  public declare filepath: string;
  public declare cover?: string;

  public static associate(m: typeof models) {
    this.belongsToMany(m.Author, {
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
        title: {
          type: STRING,
          allowNull: false,
        },
        filepath: {
          type: STRING,
          allowNull: false,
        },
        cover: {
          type: BLOB,
        },
      },
      {
        sequelize,
      },
    );
  }
}

export default Audiobook;
