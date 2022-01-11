import { Model, Sequelize, UUID, UUIDV4 } from 'sequelize';
import { models } from '~db/models';

export default class AudiobookAuthor extends Model {
  public declare id: string;

  public static associate(m: typeof models) {
    this.hasOne(m.Audiobook);
    this.hasOne(m.Author);
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
        sequelize,
      },
    );
  }
}
