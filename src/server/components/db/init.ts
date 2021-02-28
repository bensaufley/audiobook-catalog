import { Db } from 'mongodb';

import { getCollections } from '~server/components/db/getCollection';

const init = async (db: Db) => {
  const [audiobooks, audiobookAuthors, authors, genres, imports] = await getCollections(
    db,
    'audiobooks',
    'audiobookAuthors',
    'authors',
    'genres',
    'imports',
  );

  await audiobooks.createIndex({ genres: 1 });
  await audiobookAuthors.createIndex({ audiobook: 1, author: 1 }, { unique: true });
  await authors.createIndexes([
    { key: { lastName: 1 } },
    { key: { firstName: 1, lastName: 1 }, unique: true },
  ]);
  await genres.createIndex({ name: 1 }, { unique: true });
  await imports.createIndex({ filepath: 1 }, { unique: true });
};

export default init;
