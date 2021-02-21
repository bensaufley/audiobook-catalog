import type { GenreResolvers } from '~server/graphql/resolvers/types';

const Genre: GenreResolvers = {
  id: ({ _id }) => _id.toHexString(),
  name: ({ name }) => name,
};

export default Genre;
