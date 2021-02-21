import getCollection, { getCollections } from '~server/components/db/getCollection';
import type { QueryResolvers } from '~server/graphql/resolvers/types';

const Query: QueryResolvers = {
  getAudiobooks: async () => {
    const [client, audiobooks] = await getCollections('audiobooks');
    const books = await audiobooks.find().sort({ name: 1 }).toArray();
    client.close();
    return books;
  },
  findAudiobooks: async (_, { str }) => {
    const [client, collection] = await getCollection('audiobooks');
    const audiobooks = await collection
      .aggregate([
        {
          $lookup: {
            from: 'audiobookAuthors',
            localField: '_id',
            foreignField: 'audiobooks',
            as: 'audiobookAuthors',
          },
        },
        {
          $lookup: {
            from: 'authors',
            localField: 'audiobookAuthors.author',
            foreignField: '_id',
            as: 'authors',
          },
        },
        {
          $match: {
            $or: [
              { name: { $eq: new RegExp(str) } },
              { 'authors.firstName': { $eq: new RegExp(str) } },
              { 'authors.lastName': { $eq: new RegExp(str) } },
            ],
          },
        },
        { $project: { audiobookAuthors: 0, authors: 0 } },
        { $sort: { name: 1 } },
      ])
      .toArray();
    client.close();
    return audiobooks;
  },
  getImports: async () => {
    const [client, collection] = await getCollection('toImport');
    const toImports = await collection.find().sort({ lastModified: 0 }).toArray();
    client.close();
    return toImports;
  },
};

export default Query;
