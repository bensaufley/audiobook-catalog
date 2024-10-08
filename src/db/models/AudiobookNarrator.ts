import { type Association, Model, type Sequelize, STRING } from 'sequelize';

import type Audiobook from '~db/models/Audiobook.js';
import type models from '~db/models/index.js';
import type Narrator from '~db/models/Narrator.js';

export interface AudiobookNarratorAttributes {
  AudiobookId: string;
  NarratorId: string;
}

type AudiobookNarratorCreationAttributes = Partial<AudiobookNarratorAttributes>;

export default class AudiobookNarrator
  extends Model<AudiobookNarratorAttributes, AudiobookNarratorCreationAttributes>
  implements AudiobookNarratorAttributes
{
  public declare AudiobookId: string;

  public declare NarratorId: string;

  public declare static associations: {
    Audiobook: Association<AudiobookNarrator, Audiobook>;
    Narrator: Association<AudiobookNarrator, Narrator>;
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
        AudiobookId: {
          type: STRING,
          allowNull: false,
          references: 'Audiobooks',
        },
        NarratorId: {
          type: STRING,
          allowNull: false,
          references: 'Users',
        },
      },
      {
        modelName: 'AudiobookNarrator',
        sequelize,
      },
    );
  }
}
