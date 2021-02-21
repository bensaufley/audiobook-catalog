import type { ToImportResolvers } from '~server/graphql/resolvers/types';

const ToImport: ToImportResolvers = {
  id: ({ _id }) => _id.toHexString(),
  filepath: ({ filepath }) => filepath,
  name: ({ name }) => name,
  lastModified: ({ lastModified }) => lastModified.getTime(),
  conflict: ({ conflict }) => conflict,
};

export default ToImport;
