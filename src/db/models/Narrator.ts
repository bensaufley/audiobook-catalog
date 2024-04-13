import { type Association, Model, type Optional, type Sequelize, STRING, UUID, UUIDV4 } from 'sequelize';

import type models from '~db/models';
import type Audiobook from '~db/models/Audiobook';

export interface NarratorAttributes {
  id: string;
  firstName: string | null;
  lastName: string | null;
}

type NarratorCreationAttributes = Optional<NarratorAttributes, 'id'>;

export default class Narrator
  extends Model<NarratorAttributes, NarratorCreationAttributes>
  implements NarratorAttributes
{
  public declare id: string;

  public declare firstName: string | null;

  public declare lastName: string;

  public declare readonly createdAt: Date;

  public declare readonly updatedAt: Date;

  declare static associations: {
    Audiobooks: Association<Narrator, Audiobook<unknown>>;
  };

  public static associate(m: typeof models) {
    Narrator.belongsToMany(m.Audiobook, { through: m.AudiobookNarrator });
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
        modelName: 'Narrator',
        sequelize,
      },
    );
  }
}
