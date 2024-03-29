import Audiobook from '~db/models/Audiobook';
import AudiobookAuthor from '~db/models/AudiobookAuthor';
import AudiobookNarrator from '~db/models/AudiobookNarrator';
import Author from '~db/models/Author';
import Narrator from '~db/models/Narrator';
import User from '~db/models/User';
import UserAudiobook from '~db/models/UserAudiobook';
import sequelize from '../sequelize';

const models = {
  Audiobook: Audiobook.generate(sequelize),
  AudiobookAuthor: AudiobookAuthor.generate(sequelize),
  AudiobookNarrator: AudiobookNarrator.generate(sequelize),
  Author: Author.generate(sequelize),
  Narrator: Narrator.generate(sequelize),
  User: User.generate(sequelize),
  UserAudiobook: UserAudiobook.generate(sequelize),
};

export const ready = new Promise<void>((resolve) => {
  Object.keys(models).forEach((modelName) => {
    models[modelName as keyof typeof models].associate(models);
  });
  resolve();
});

export default models;
