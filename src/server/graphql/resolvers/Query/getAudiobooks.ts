import getCollection from '~server/components/db/getCollection';
import type { QueryResolvers } from '~server/graphql/resolvers/types';

const getAudiobooks: QueryResolvers['getAudiobooks'] = async (_, _args, { db }) => {
  const audiobooks = await getCollection(db, 'audiobooks');
  return audiobooks.find().sort({ name: 1 }).toArray();
};

export default getAudiobooks;
