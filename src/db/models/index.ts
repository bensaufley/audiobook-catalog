import Audiobook from '~db/models/Audiobook.js';
import AudiobookAuthor from '~db/models/AudiobookAuthor.js';
import AudiobookNarrator from '~db/models/AudiobookNarrator.js';
import AudiobookTag from '~db/models/AudiobookTag.js';
import Author from '~db/models/Author.js';
import Narrator from '~db/models/Narrator.js';
import Tag from '~db/models/Tag.js';
import UpNext from '~db/models/UpNext.js';
import User from '~db/models/User.js';
import UserAudiobook from '~db/models/UserAudiobook.js';
import sequelize from '~db/sequelize.js';

const models = {
  Audiobook: Audiobook.generate(sequelize),
  AudiobookAuthor: AudiobookAuthor.generate(sequelize),
  AudiobookNarrator: AudiobookNarrator.generate(sequelize),
  AudiobookTag: AudiobookTag.generate(sequelize),
  Author: Author.generate(sequelize),
  Narrator: Narrator.generate(sequelize),
  Tag: Tag.generate(sequelize),
  User: User.generate(sequelize),
  UserAudiobook: UserAudiobook.generate(sequelize),
  UpNext: UpNext.generate(sequelize),
};

Object.keys(models).forEach((modelName) => {
  models[modelName as keyof typeof models].associate(models);
});

export default models;
