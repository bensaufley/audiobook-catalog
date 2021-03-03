import getCollection from '~server/components/db/getCollection';
import type { QueryResolvers } from '~server/graphql/resolvers/types';

const Query: QueryResolvers = {
  getAudiobooks: async (_, _args, { db }) => {
    const audiobooks = await getCollection(db, 'audiobooks');
    return audiobooks.find().sort({ name: 1 }).toArray();
  },
  findAudiobooks: async (_, { str }, { db }) => {
    const collection = await getCollection(db, 'audiobooks');
    return collection
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
  },
  getImports: async (_, _args, { db }) => {
    const collection = await getCollection(db, 'imports');
    return collection.find().sort({ lastModified: 0 }).toArray();
  },
  getUser: () => null,
  getUsers: () => [],
  logIn: () => '',
};

export default Query;
