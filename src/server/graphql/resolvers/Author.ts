import getCollection from '~server/components/db/getCollection';
import type { AuthorResolvers } from '~server/graphql/resolvers/types';

const Author: AuthorResolvers = {
  id: ({ _id }) => _id.toHexString(),
  firstName: ({ firstName }) => firstName,
  lastName: ({ lastName }) => lastName,
  audiobooks: async ({ _id }) => {
    const [client, collection] = await getCollection('audiobookAuthors');
    const authors = await collection.find({ audiobook: { $eq: _id } }).toArray();
    client.close();
    return authors;
  },
};

export default Author;
