import { Association, Model, Optional, Sequelize, UUID, UUIDV4 } from 'sequelize';
import type models from '~db/models';
import type Audiobook from '~db/models/Audiobook';
import type Narrator from '~db/models/Narrator';

export interface AudiobookNarratorAttributes {
  id: string;
}

type AudiobookNarratorCreationAttributes = Optional<AudiobookNarratorAttributes, 'id'>;

export default class AudiobookNarrator
  extends Model<AudiobookNarratorAttributes, AudiobookNarratorCreationAttributes>
  implements AudiobookNarratorAttributes
{
  public declare id: string;

  public declare static associations: {
    audiobook: Association<AudiobookNarrator, Audiobook<unknown>>;
    narrator: Association<AudiobookNarrator, Narrator>;
  };

  public declare readonly createdAt: Date;
  public declare readonly updatedAt: Date;

  public static associate(m: typeof models) {
    this.belongsTo(m.Audiobook);
    this.belongsTo(m.Narrator);
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
