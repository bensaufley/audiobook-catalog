import getCollection from '~server/components/db/getCollection';
import type { AudiobookResolvers } from '~server/graphql/resolvers/types';
import type { ResolverFns } from '~server/graphql/types';

const Audiobook: ResolverFns<AudiobookResolvers> = {
  id: (parent) => parent._id.toHexString(),
  authors: async ({ _id }, _, { db }) => {
    const collection = await getCollection(db, 'audiobookAuthors');
    return collection.find({ audiobook: _id }).toArray();
  },
  cover: ({ cover }) => cover,
  duration: ({ duration }) => duration,
  filename: ({ filename }) => filename,
  genres: async (parent, _, { db }) => {
    if (parent.genres.length === 0) return [];

    const collection = await getCollection(db, 'genres');
    return collection
      .find({ _id: { $in: parent.genres } })
      .sort({ name: 1 })
      .toArray();
  },
  name: ({ name }) => name,
  year: ({ year }) => year,
};

export default Audiobook;
