import getCollection from '~server/components/db/getCollection';
import type { AuthorResolvers } from '~server/graphql/resolvers/types';
import type { ResolverFns } from '~server/graphql/types';

const Author: ResolverFns<AuthorResolvers> = {
  id: ({ _id }) => _id.toHexString(),
  firstName: ({ firstName }) => firstName,
  lastName: ({ lastName }) => lastName,
  audiobooks: async ({ _id }, _, { db }) => {
    const collection = await getCollection(db, 'audiobookAuthors');
    return collection.find({ audiobook: { $eq: _id } }).toArray();
  },
};

export default Author;
