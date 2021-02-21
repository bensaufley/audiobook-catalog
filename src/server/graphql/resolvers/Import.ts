import type { ImportResolvers } from '~server/graphql/resolvers/types';

const Import: ImportResolvers = {
  id: ({ _id }) => _id.toHexString(),
  filepath: ({ filepath }) => filepath,
  name: ({ name }) => name,
  lastModified: ({ lastModified }) => lastModified.getTime(),
  status: ({ status }) => status,
  error: ({ error }) => error,
};

export default Import;
