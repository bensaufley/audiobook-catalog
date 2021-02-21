import getCollection from '~server/components/db/getCollection';
import type { AudiobookResolvers } from '~server/graphql/resolvers/types';

const Audiobook: AudiobookResolvers = {
  id: (parent) => parent._id.toHexString(),
  authors: async ({ _id }) => {
    const [client, collection] = await getCollection('audiobookAuthors');
    const authors = await collection.find({ audiobook: _id }).toArray();
    client.close();
    return authors;
  },
  cover: ({ cover }) => cover,
  duration: ({ duration }) => duration,
  filepath: ({ filepath }) => filepath,
  genres: async (parent) => {
    if (parent.genres.length === 0) return [];

    const [client, collection] = await getCollection('genres');
    const genres = await collection
      .find({ _id: { $in: parent.genres } })
      .sort({ name: 1 })
      .toArray();
    client.close();
    return genres;
  },
  name: ({ name }) => name,
  year: ({ year }) => year,
};

export default Audiobook;
