import type { GenreResolvers } from '~server/graphql/resolvers/types';
import type { ResolverFns } from '~server/graphql/types';

const Genre: ResolverFns<GenreResolvers> = {
  id: ({ _id }) => _id.toHexString(),
  name: ({ name }) => name,
};

export default Genre;
