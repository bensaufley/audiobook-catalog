import Audiobook from '~db/models/Audiobook';
import AudiobookAuthor from '~db/models/AudiobookAuthor';
import Author from '~db/models/Author';
import sequelize from '../sequelize';

export const models = {
  AudiobookAuthor: AudiobookAuthor.generate(sequelize),
  Audiobook: Audiobook.generate(sequelize),
  Author: Author.generate(sequelize),
};

Object.keys(models).forEach((modelName) => {
  models[modelName as keyof typeof models].associate(models);
});
