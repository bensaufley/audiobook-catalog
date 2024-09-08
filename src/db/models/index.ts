import Audiobook from '~db/models/Audiobook';
import AudiobookAuthor from '~db/models/AudiobookAuthor';
import AudiobookNarrator from '~db/models/AudiobookNarrator';
import AudiobookTag from '~db/models/AudiobookTag';
import Author from '~db/models/Author';
import Narrator from '~db/models/Narrator';
import Tag from '~db/models/Tag';
import UpNext from '~db/models/UpNext';
import User from '~db/models/User';
import UserAudiobook from '~db/models/UserAudiobook';
import sequelize from '~db/sequelize';

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
