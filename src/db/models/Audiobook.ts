import {
  Association,
  BelongsToMany,
  BelongsToManyAddAssociationMixin,
  BLOB,
  FLOAT,
  HasMany,
  Model,
  Optional,
  Sequelize,
  STRING,
  UUID,
  UUIDV4,
} from 'sequelize';
import type models from '~db/models';
import type AudiobookAuthor from '~db/models/AudiobookAuthor';
import type AudiobookNarrator from '~db/models/AudiobookNarrator';
import type { default as Author, AuthorAttributes } from '~db/models/Author';
import type Narrator from '~db/models/Narrator';
import type { NarratorAttributes } from '~db/models/Narrator';

export interface AudiobookAttributes<T> {
  id: string;
  title: string;
  filepath: string;
  cover: T extends null ? null : Buffer;
  coverType: T extends null ? null : string;
  duration: number | null;
}

type AudiobookCreationAttributes = Optional<AudiobookAttributes<any>, 'id'>;

export class Audiobook<T>
  extends Model<AudiobookAttributes<T>, AudiobookCreationAttributes>
  implements AudiobookAttributes<T>
{
  declare static associations: {
    Authors: Association<Audiobook<unknown>, Author>;
    Narrators: Association<Audiobook<unknown>, Narrator>;
  };

  public declare id: string;
  public declare title: string;
  public declare filepath: string;
  public declare cover: T extends null ? null : Buffer;
  public declare coverType: T extends null ? null : string;
  public declare duration: number | null;

  public declare readonly createdAt: Date;
  public declare readonly updatedAt: Date;

  public declare Authors?: Author[];
  public declare Narrators?: Author[];

  public declare addAuthor: BelongsToManyAddAssociationMixin<Author, AuthorAttributes>;

  public declare addNarrator: BelongsToManyAddAssociationMixin<Narrator, NarratorAttributes>;

  public static associate(m: typeof models) {
    this.belongsToMany(m.Author, { through: m.AudiobookAuthor });
    this.belongsToMany(m.Narrator, { through: m.AudiobookNarrator });
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
        coverType: {
          type: STRING,
        },
        duration: {
          type: FLOAT,
        },
      },
      {
        sequelize,
      },
    );
  }
}

export default Audiobook;
