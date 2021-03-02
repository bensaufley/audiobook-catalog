import getCollection from '~server/components/db/getCollection';
import type { AudiobookAuthorResolvers } from '~server/graphql/resolvers/types';
import type { ResolverFns } from '~server/graphql/types';

const AudiobookAuthor: ResolverFns<AudiobookAuthorResolvers> = {
  id: ({ _id }) => _id.toHexString(),
  audiobook: async ({ audiobook: _id }, _, { db }) => {
    const collection = await getCollection(db, 'audiobooks');
    return (await collection.findOne({ _id: { $eq: _id } }))!;
  },
  author: async ({ author: _id }, _, { db }) => {
    const collection = await getCollection(db, 'authors');
    return (await collection.findOne({ _id: { $eq: _id } }))!;
  },
  meta: ({ meta }) => meta,
};

export default AudiobookAuthor;
