import getCollection from '~server/components/db/getCollection';
import type { AudiobookAuthorResolvers } from '~server/graphql/resolvers/types';

const AudiobookAuthor: AudiobookAuthorResolvers = {
  id: ({ _id }) => _id.toHexString(),
  audiobook: async ({ audiobook: _id }) => {
    const [client, collection] = await getCollection('audiobooks');
    const audiobook = await collection.findOne({ _id: { $eq: _id } });
    client.close();
    return audiobook!;
  },
  author: async ({ author: _id }) => {
    const [client, collection] = await getCollection('authors');
    const author = await collection.findOne({ _id: { $eq: _id } });
    client.close();
    return author!;
  },
  meta: ({ meta }) => meta,
};

export default AudiobookAuthor;
