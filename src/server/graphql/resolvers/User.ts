import type { UserResolvers } from '~server/graphql/resolvers/types';

const User: UserResolvers = {
  id: ({ _id }) => _id.toHexString(),
  username: ({ username }) => username,
};

export default User;
