import type { ImportResolvers } from '~server/graphql/resolvers/types';
import type { ResolverFns } from '~server/graphql/types';

const Import: ResolverFns<ImportResolvers> = {
  id: ({ _id }) => _id.toHexString(),
  filepath: ({ filepath }) => filepath,
  name: ({ name }) => name,
  lastModified: ({ lastModified }) => lastModified.getTime(),
  status: ({ status }) => status,
  error: ({ error }) => error,
};

export default Import;
