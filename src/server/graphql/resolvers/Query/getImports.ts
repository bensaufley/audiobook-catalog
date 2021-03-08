import getCollection from '~server/components/db/getCollection';
import type { QueryResolvers } from '~server/graphql/resolvers/types';

const getImports: QueryResolvers['getImports'] = async (_, _args, { db }) => {
  const collection = await getCollection(db, 'imports');
  return collection.find().sort({ lastModified: 0 }).toArray();
};

export default getImports;
