import Audiobook from '~db/models/Audiobook';
import AudiobookAuthor from '~db/models/AudiobookAuthor';
import AudiobookNarrator from '~db/models/AudiobookNarrator';
import Author from '~db/models/Author';
import Narrator from '~db/models/Narrator';
import sequelize from '../sequelize';

const models = {
  Audiobook: Audiobook.generate(sequelize),
  AudiobookAuthor: AudiobookAuthor.generate(sequelize),
  AudiobookNarrator: AudiobookNarrator.generate(sequelize),
  Author: Author.generate(sequelize),
  Narrator: Narrator.generate(sequelize),
};

export default models;

Object.keys(models).forEach((modelName) => {
  models[modelName as keyof typeof models].associate(models);
});
